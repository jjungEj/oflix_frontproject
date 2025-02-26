import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const ResetPasswordForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        phoneNumber: "",
        nickname: "",
        newPassword: "",
    });
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setErrorMessage("");

        try {
            const response = await fetch("/api/find/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "비밀번호 변경 실패");
            }

            setMessage("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동하세요.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
                비밀번호 재설정
            </Text>

            <VStack spacing="4" as="form" onSubmit={handleSubmit}>
                <Input
                    type="text"
                    name="username"
                    placeholder="아이디 입력"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="text"
                    name="phoneNumber"
                    placeholder="전화번호 입력"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="text"
                    name="nickname"
                    placeholder="닉네임 입력"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="password"
                    name="newPassword"
                    placeholder="새 비밀번호 입력"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />

                {message && <Text color="green.500">{message}</Text>}
                {errorMessage && <Text color="red.500">{errorMessage}</Text>}

                <Button colorScheme="red" w="100%" type="submit">
                    비밀번호 변경
                </Button>
            </VStack>
        </Box>
    );
};

export default ResetPasswordForm;
