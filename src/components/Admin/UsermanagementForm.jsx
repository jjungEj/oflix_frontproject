import React, { useState, useEffect } from 'react';
import { 
    Box, Button, Text, Heading, Grid, GridItem, HStack,
} from '@chakra-ui/react';

const UsermanagementForm = () => {
    const [users, setUsers] = useState([]);  // 유저 목록 상태
    const [error, setError] = useState(null); // 에러 상태
    const [editUserId, setEditUserId] = useState(null); // 수정 중인 유저 ID
    const [selectedRole, setSelectedRole] = useState({}); // 변경할 역할 상태
    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(10); // 페이지 크기
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [sortBy, setSortBy] = useState('username'); // 기본 정렬 기준
    const [direction, setDirection] = useState('desc'); // 정렬 방향 상태 ('asc' 또는 'desc')

    // 유저 정보 가져오기
    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/admin/alluser?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('유저 정보를 가져오는데 실패했습니다.');
            }

            const data = await response.json();
            setUsers(Array.isArray(data.content) ? data.content : []); // 페이지 데이터는 content에 있음
            setTotalPages(data.totalPages || 0); // 총 페이지 수 업데이트
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

    // 정렬 기준 변경 시 처리
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    // 정렬 방향 변경 시 처리
    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, size, sortBy, direction]); // page, size, sortBy, direction이 변경될 때마다 유저 데이터를 가져옵니다.

    return (
        <div className="container">
        <Box p={4}>
            <Heading as="h1" size="lg" mb={4}>회원 관리</Heading>

            {error && (
                <Box mb={4} color="red.500">
                    <Text>{error}</Text>
                </Box>
            )}

            {/* 정렬 기준 선택 드롭다운 */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <span>정렬 기준:</span>
                <select 
                    value={sortBy} 
                    onChange={handleSortChange} 
                    style={{
                        marginLeft: '8px',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                    }}
                >
                    <option value="username">이름순</option>
                    <option value="id">아이디순</option>
                </select>

                <span style={{ marginLeft: '16px' }}>정렬 방향:</span>
                <select 
                    value={direction} 
                    onChange={handleDirectionChange} 
                    style={{
                        marginLeft: '8px',
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                    }}
                >
                    <option value="asc">오름차순</option>
                    <option value="desc">내림차순</option>
                </select>
            </div>

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

            {/* 페이지네이션 버튼 */}
            <HStack mt={4}>
                <Button 
                    onClick={() => setPage(prevPage => Math.max(prevPage - 1, 0))}
                    isDisabled={page === 0}
                >
                    이전
                </Button>
                <Text>{page + 1} / {totalPages}</Text>
                <Button 
                    onClick={() => setPage(prevPage => Math.min(prevPage + 1, totalPages - 1))}
                    isDisabled={page === totalPages - 1}
                >
                    다음
                </Button>
            </HStack>
        </Box>
        </div>
    );
};

export default UsermanagementForm;
