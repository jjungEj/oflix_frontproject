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
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    nickname: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 유효성 검사 함수
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // 아이디 유효성 검사 (이메일 형식)
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(formData.username)) {
      formErrors.username = "아이디는 유효한 이메일 형식이어야 합니다.";
      isValid = false;
    }

    // 비밀번호 유효성 검사 (8자 이상)
    if (formData.password.length < 8) {
      formErrors.password = "비밀번호는 8자 이상이어야 합니다.";
      isValid = false;
    }

    // 이름 유효성 검사
    if (!formData.nickname) {
      formErrors.nickname = "이름은 필수 입력 항목입니다.";
      isValid = false;
    }

    // 전화번호 유효성 검사 (하이픈 없이 10자 또는 11자리 숫자)
    const phonePattern = /^\d{10,11}$/;
    if (!phonePattern.test(formData.phoneNumber)) {
      formErrors.phoneNumber = "전화번호는 하이픈 없이 10자리 또는 11자리 숫자여야 합니다.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    // 유효성 검사 실행
    if (!validateForm()) {
      return;
    }

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
      alert("회원 가입이 완료되었습니다.");
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("회원가입 오류:", error);
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="white">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        회원가입
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleJoin}>
        {[ 
          { label: "아이디", type: "text", name: "username", placeholder: "아이디 입력" },
          { label: "비밀번호", type: "password", name: "password", placeholder: "비밀번호 입력" },
          { label: "이름", type: "text", name: "nickname", placeholder: "이름 입력" },
          { label: "전화번호", type: "tel", name: "phoneNumber", placeholder: "전화번호 입력" },
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
            {errors[name] && (
              <Text fontSize="sm" color="red.500" mt="1">
                {errors[name]}
              </Text>
            )}
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
