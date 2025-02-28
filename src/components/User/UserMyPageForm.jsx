import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack, Text, HStack } from "@chakra-ui/react";
import MyReservation from "../Reservation/MyReservation";

const User = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("userInfo"); // Keeps track of the active tab
  const navigate = useNavigate();

  useEffect(() => {
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
        console.log(data);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("유저 정보 업데이트 실패");
      }

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
    <Box maxW={activeTab === "reservation" ? "1200px" : "lg"} backgroundColor="white" p={5} mx="auto " boxShadow="md">
      <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">
        내 정보
      </Text>

      <HStack justify="center" spacing={4} mb={4}>
        <Button
          variant={activeTab === "userInfo" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setActiveTab("userInfo")}
        >
          회원 정보
        </Button>
        <Button
          variant={activeTab === "reservation" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setActiveTab("reservation")}
        >
          예매 정보
        </Button>
        <Button
          variant={activeTab === "accountManagement" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setActiveTab("accountManagement")}
        >
          계정 관리
        </Button>
      </HStack>

      
      {activeTab === "userInfo" && (
        <VStack spacing={6} align="stretch">
          {user ? (
            <>
              <Text fontSize="lg" fontWeight="bold">
                사용자명: {user.username}
              </Text>

              <HStack spacing={4}>
                <Text fontWeight="bold" minWidth="100px">
                  닉네임:
                </Text>
                <Input
                  name="nickname"
                  value={user?.nickname ?? ""}
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
                  value={user?.phoneNumber ?? ""}
                  onChange={handleChange}
                  placeholder="전화번호를 입력하세요"
                  size="sm"
                />
              </HStack>

              <HStack spacing={4} justify="center">
                <Button colorScheme="blue" onClick={handleUpdate} size="sm">
                  수정하기
                </Button>
              </HStack>
            </>
          ) : (
            <Text>유저 정보를 불러오는 중...</Text>
          )}
        </VStack>
      )}

      {activeTab === "reservation" && (
        <Box mt={6}>
          <MyReservation />
        </Box>
      )}

      {activeTab === "accountManagement" && (
        <VStack spacing={6} align="center">
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            정말로 회원 탈퇴를 하시겠습니까?
          </Text>
          <Text fontSize="md" textAlign="center" color="gray.600">
            회원 탈퇴 후에는 모든 데이터가 삭제되며, 복구할 수 없습니다.
          </Text>

          <HStack spacing={4} justify="center" mt={6}>
            <Button colorScheme="red" onClick={handleDeleteUser} size="lg">
              회원 탈퇴
            </Button>
          </HStack>
        </VStack>
      )}

    </Box>
  );
};

export default User;
