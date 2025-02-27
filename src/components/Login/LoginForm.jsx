import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const loginProcess = async (username, password) => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인 실패");
      }

      return await response.json();
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await loginProcess(formData.username, formData.password);
      navigate("/");
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="white">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        로그인
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleLogin} w="100%">
        {[
          { label: "아이디", type: "text", name: "username", placeholder: "아이디 입력" },
          { label: "비밀번호", type: "password", name: "password", placeholder: "비밀번호 입력" },
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

        {errorMessage && (
          <Text color="red.500" fontSize="sm">
            {errorMessage}
          </Text>
        )}

        {/* 아이디 찾기 & 비밀번호 찾기 링크 (오른쪽 정렬 + 간격 추가) */}
        <Box display="flex" justifyContent="flex-end" w="100%" fontSize="sm">
          <Link to="/find/find-username" style={{ color: "#3182ce", textDecoration: "underline", marginRight: "10px" }}>
            아이디 찾기
          </Link>
          <Link to="/reset-password" style={{ color: "#3182ce", textDecoration: "underline" }}>
            비밀번호 찾기
          </Link>
        </Box>

        <Button colorPalette="red" w="100%" type="submit">
          로그인
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm;
