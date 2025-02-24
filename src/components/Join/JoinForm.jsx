import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const JoinForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    phoneNumber: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      console.log("회원가입 성공!");
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        회원가입
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleJoin}>
        {[
          { label: "아이디", type: "text", name: "username", placeholder: "아이디 입력" },
          { label: "비밀번호", type: "password", name: "password", placeholder: "비밀번호 입력" },
          { label: "닉네임", type: "text", name: "nickname", placeholder: "닉네임 입력" },
          { label: "전화번호", type: "tel", name: "phoneNumber", placeholder: "전화번호 입력" },
          { label: "생년월일", type: "date", name: "birthDate", placeholder: "" },
        ].map(({ label, type, name, placeholder }) => (
          <Box w="100%" key={name}>
            <Text fontSize="sm" fontWeight="bold" mb="1">
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

        <Button colorScheme="red" w="100%" type="submit">
          가입하기
        </Button>
      </VStack>
    </Box>
  );
};

export default JoinForm;