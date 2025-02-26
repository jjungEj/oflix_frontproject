import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const FindIdForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [foundUsername, setFoundUsername] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFindId = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/find/find-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, nickname }),
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
    <Box maxW="400px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
        아이디 찾기
      </Text>

      <VStack spacing="4" as="form" onSubmit={handleFindId}>
        <Input
          type="text"
          placeholder="전화번호 입력"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />

        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        {foundUsername && <Text color="green.500">{foundUsername}</Text>}

        <Button colorScheme="red" w="100%" type="submit">
          아이디 찾기
        </Button>
      </VStack>
    </Box>
  );
};

export default FindIdForm;
