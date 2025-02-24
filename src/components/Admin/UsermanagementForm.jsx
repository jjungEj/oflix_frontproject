import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Text, Heading, Grid, GridItem, HStack } from '@chakra-ui/react';

const UsermanagementForm = () => {
    const [users, setUsers] = useState([]);  // 유저 목록 상태
    const [error, setError] = useState(null); // 에러 상태

    // 유저 정보 가져오기
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/alluser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setUsers(data);  // 유저 목록 상태 업데이트
        } catch (err) {
            setError(err.message);  // 에러 상태 업데이트
        }
    };

    // 유저 삭제 함수
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // 인증 토큰 추가 필요 시
                    // 'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('유저 삭제에 실패했습니다.');
            }

            // 삭제 성공 시 해당 유저를 목록에서 제거
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (err) {
            setError(err.message);  // 에러 상태 업데이트
        }
    };

    // 컴포넌트가 마운트되면 유저 정보 가져오기
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box p={4}>
            
            <Heading as="h1" size="lg" mb={4}>Admin Page</Heading>
            <Text mb={4}>관리자 페이지입니다.</Text>

            {error && (
                <Box mb={4} color="red.500">
                    <Text>{error}</Text>
                </Box>
            )}

            <Grid templateColumns="repeat(6, 1fr)" gap={6} mb={6}>
                <GridItem><Text fontWeight="bold">ID</Text></GridItem>
                <GridItem><Text fontWeight="bold">Username</Text></GridItem>
                <GridItem><Text fontWeight="bold">Nickname</Text></GridItem>
                <GridItem><Text fontWeight="bold">Phone</Text></GridItem>
                <GridItem><Text fontWeight="bold">Role</Text></GridItem>
                <GridItem><Text fontWeight="bold">Actions</Text></GridItem>
            </Grid>

            {users.length > 0 ? (
                users.map(user => (
                    <Grid templateColumns="repeat(6, 1fr)" gap={6} key={user.id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
                        <GridItem>{user.id}</GridItem>
                        <GridItem>{user.username}</GridItem>
                        <GridItem>{user.nickname}</GridItem>
                        <GridItem>{user.phoneNumber}</GridItem>
                        <GridItem>{user.role}</GridItem>
                        <GridItem>
                            <Button colorScheme="red" onClick={() => handleDelete(user.id)}>
                                삭제
                            </Button>
                        </GridItem>
                    </Grid>
                ))
            ) : (
                <Text>등록된 유저가 없습니다.</Text>
            )}
        </Box>
    );
};

export default UsermanagementForm;
