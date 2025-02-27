import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack, Text, Spinner, HStack } from "@chakra-ui/react";

const User = () => {
    const [user, setUser] = useState(null);
     const navigate = useNavigate();
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

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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

    
    

      const handleDeleteUser = async () => {
        if (!window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) return;
    
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/delete?username=${user.username}`, {
                method: "DELETE",
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error("회원 탈퇴 실패");
            }
    
            alert("회원 탈퇴가 완료되었습니다.");
            navigate('/');
        } catch (error) {
            console.error("회원 탈퇴 실패:", error);
            alert("회원 탈퇴에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <>
            <Box className="container" p={5}>
                <Text fontSize="2xl" mb={4}>User</Text>
                {isLoading ? (
                    <Spinner size="xl" />
                ) : user ? (
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="lg">사용자명: {user.username}</Text>
                        {/* username을 텍스트로 표시 */}
                        
                        <HStack spacing={4}>
                            <Text fontWeight="bold" minWidth="100px">닉네임:</Text>
                            <Input
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="닉네임"
                            />
                        </HStack>

                        <HStack spacing={4}>
                            <Text fontWeight="bold" minWidth="100px">전화번호:</Text>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="전화번호"
                            />
                        </HStack>

                        <Button colorScheme="blue" onClick={handleUpdate}>수정하기</Button>

                        <Button colorScheme="red" onClick={handleDeleteUser}>회원 탈퇴</Button>
                    </VStack>
                    
                ) : (
                    <Text>유저 정보를 불러오는 중...</Text>
                )}
            </Box>
        </>
    );
};
export default User;
