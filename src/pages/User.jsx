import React, { useEffect, useState } from "react";
import { Box, Button, Input, VStack, Text, Spinner } from "@chakra-ui/react";
import Header from "../components/Header/Header";

const User = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        nickname: "",
        phoneNumber: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/user/userInfo", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("유저 정보 불러오기 실패");
            }

            const data = await response.json();
            setUser(data); // 'user'는 이제 객체입니다
            setFormData({
                username: data.username,
                nickname: data.nickname,
                phoneNumber: data.phoneNumber
            });
        } catch (error) {
            console.error("유저 정보 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 마이페이지로 돌아왔을 때마다 유저 정보를 새로 불러옵니다.
    useEffect(() => {
        fetchUserInfo();
    }, []); // 빈 배열을 전달하여 처음 한 번만 실행되게 설정

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 유저 정보 업데이트
    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/update`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("유저 정보 업데이트 실패");
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            alert("유저 정보가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("유저 정보 업데이트 실패:", error);
            alert("유저 정보 업데이트에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Box className="container" p={5}>
                <Text fontSize="2xl" mb={4}>User</Text>
                {isLoading ? (
                    <Spinner size="xl" />
                ) : user ? (
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="lg">사용자명: {user.username}</Text>

                        <Input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="사용자명"
                        />

                        <Input
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임"
                        />

                        <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="전화번호"
                        />

                        <Button colorScheme="blue" onClick={handleUpdate}>수정하기</Button>
                    </VStack>
                ) : (
                    <Text>유저 정보를 불러오는 중...</Text>
                )}
            </Box>
        </>
    );
};
export default User;
