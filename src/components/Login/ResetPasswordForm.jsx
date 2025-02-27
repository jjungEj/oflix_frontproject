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
    <Box maxW="500px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="white">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        비밀번호 재설정
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleSubmit} w="100%">
        {[
          { label: "아이디", type: "text", name: "username", placeholder: "아이디 입력" },
          { label: "전화번호", type: "text", name: "phoneNumber", placeholder: "전화번호 입력" },
          { label: "이름", type: "text", name: "nickname", placeholder: "이름 입력" },
          { label: "새 비밀번호", type: "password", name: "newPassword", placeholder: "새 비밀번호 입력" },
        ].map(({ label, type, name, placeholder }) => (
          <Box w="100%" key={name}>
            <Text fontSize="sm" fontWeight="bold" mb="1" textAlign="left">
              {label}
            </Text>
            <Input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </Box>
        ))}

        {message && <Text color="green.500" fontSize="sm">{message}</Text>}
        {errorMessage && <Text color="red.500" fontSize="sm">{errorMessage}</Text>}

        <Button colorPalette="red" w="100%" type="submit">
          비밀번호 변경
        </Button>
      </VStack>
    </Box>
  );
};

export default ResetPasswordForm;
