import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack, Text, HStack } from "@chakra-ui/react";
import MyReservation from "../Reservation/MyReservation";

const User = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    phoneNumber: "",
  });

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user/userInfo", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("유저 정보 불러오기 실패");
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        username: data.username,
        nickname: data.nickname,  // nickname이 null일 경우 빈 문자열로 설정
        phoneNumber: data.phoneNumber,  // phoneNumber가 null일 경우 빈 문자열로 설정
      });
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
    }
  };

  // useEffect에서 빈 배열만 사용하여 컴포넌트가 마운트 될 때만 실행되도록 설정
  useEffect(() => {
    fetchUserInfo();
  }, []);  // 빈 배열로 설정하여 한 번만 호출되게 함

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
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
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) return;

    try {
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
    }
  };

  return (
    <Box className="container" p={5} maxW="lg" mx="auto">
      <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
        내 정보
      </Text>

      {user ? (
        <VStack spacing={6} align="stretch">
          <Text fontSize="lg" fontWeight="bold">
            사용자명: {user.username}
          </Text>

          <HStack spacing={4}>
            <Text fontWeight="bold" minWidth="100px">
              닉네임:
            </Text>
            <Input
              name="nickname"
              value={formData.nickname || ""}  // value가 null이 아닌 빈 문자열로 설정
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              size="sm"
            />
          </HStack>

          <HStack spacing={4}>
            <Text fontWeight="bold" minWidth="100px">
              전화번호:
            </Text>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber || ""}  // value가 null이 아닌 빈 문자열로 설정
              onChange={handleChange}
              placeholder="전화번호를 입력하세요"
              size="sm"
            />
          </HStack>

          <HStack spacing={4} justify="flex-start">
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              size="sm"
              alignSelf="flex-start"
            >
              수정하기
            </Button>
          </HStack>

          <Box mt={6}>
            <MyReservation />
          </Box>

          <HStack spacing={4} justify="flex-start">
            <Button
              colorScheme="red"
              onClick={handleDeleteUser}
              size="sm"
              alignSelf="flex-start"
            >
              회원 탈퇴
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Text>유저 정보를 불러오는 중...</Text>
      )}
    </Box>
  );
};

export default User;
