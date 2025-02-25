import React, { useState, useEffect } from 'react';
import { 
    Box, Button, Text, Heading, Grid, GridItem, HStack 
} from '@chakra-ui/react';

const UsermanagementForm = () => {
    const [users, setUsers] = useState([]);  // 유저 목록 상태
    const [error, setError] = useState(null); // 에러 상태
    const [editUserId, setEditUserId] = useState(null); // 수정 중인 유저 ID
    const [selectedRole, setSelectedRole] = useState({}); // 변경할 역할 상태

    // 유저 정보 가져오기
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/alluser', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // 유저 삭제 함수
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('유저 삭제에 실패했습니다.');
            }

            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (err) {
            setError(err.message);
        }
    };

    // 유저 역할 수정 함수
    const handleUpdate = async (userId) => {
        if (!selectedRole[userId]) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedRole[userId]), // 변환 없이 그대로 저장!
            });

            if (!response.ok) {
                throw new Error('역할 변경에 실패했습니다.');
            }

            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, role: selectedRole[userId] } : user
                )
            );

            setEditUserId(null); // 수정 모드 종료
        } catch (err) {
            setError(err.message);
        }
    };

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
                        <GridItem>
                            {editUserId === user.id ? (
                                <select 
                                    value={selectedRole[user.id] || user.role} 
                                    onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                                    style={{ padding: '6px', borderRadius: '5px', border: '1px solid gray' }}
                                >
                                    <option value="ROLE_USER">ROLE_USER</option>
                                    <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                </select>
                            ) : (
                                user.role
                            )}
                        </GridItem>
                        <GridItem>
                            {editUserId === user.id ? (
                                <HStack>
                                    <Button colorScheme="blue" onClick={() => handleUpdate(user.id)}>
                                        저장
                                    </Button>
                                    <Button colorScheme="gray" onClick={() => setEditUserId(null)}>
                                        취소
                                    </Button>
                                </HStack>
                            ) : (
                                <HStack>
                                    <Button colorScheme="yellow" onClick={() => setEditUserId(user.id)}>
                                        수정
                                    </Button>
                                    <Button colorScheme="red" onClick={() => handleDelete(user.id)}>
                                        삭제
                                    </Button>
                                </HStack>
                            )}
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
