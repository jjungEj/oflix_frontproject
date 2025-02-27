import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const FindIdForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    nickname: "",
  });
  const [foundUsername, setFoundUsername] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFindId = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/find/find-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "아이디 찾기 실패");
      }

      const data = await response.text();
      setFoundUsername(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
      setFoundUsername(null);
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md" backgroundColor="white">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        아이디 찾기
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleFindId} w="100%">
        {[
          { label: "전화번호", type: "text", name: "phoneNumber", placeholder: "전화번호 입력" },
          { label: "닉네임", type: "text", name: "nickname", placeholder: "닉네임 입력" },
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

        {errorMessage && <Text color="red.500" fontSize="sm">{errorMessage}</Text>}
        {foundUsername && <Text color="green.500" fontSize="sm">{foundUsername}</Text>}

        <Button colorPalette="red" w="100%" type="submit">
          아이디 찾기
        </Button>
      </VStack>
    </Box>
  );
};

export default FindIdForm;
