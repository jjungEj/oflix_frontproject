
import React, { useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { Box, Input, Button, VStack, Text } from '@chakra-ui/react';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginProcess = async (username, password) => {
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '로그인 실패');
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
            const data = await loginProcess(username, password);
            navigate('/');
        } catch (error) {
            console.error('로그인 에러:', error);
        }
    };

    return (
        <Box maxW="400px" mx="auto" mt="50px" p="6" borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
                로그인
            </Text>

            <VStack spacing="4" as="form" onSubmit={handleLogin}>
                <Input
                    type="text"
                    placeholder="아이디 입력"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMessage && (
                    <Text color="red.500" fontSize="sm">
                        {errorMessage}
                    </Text>
                )}
                <Box display="flex" justifyContent="space-between" w="100%" fontSize="sm">
                    <Link to="/find/find-username" style={{ color: '#3182ce', textDecoration: 'underline' }}>
                        아이디 찾기
                    </Link>
                    <Link to="/reset-password" style={{ color: '#3182ce', textDecoration: 'underline' }}>
                        비밀번호 찾기
                    </Link>
                </Box>
                <Button colorScheme="red" w="100%" type="submit">
                    로그인
                </Button>
            </VStack>
        </Box>
    );
};

export default LoginForm;