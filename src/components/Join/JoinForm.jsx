
import React, { useState } from 'react';

const JoinForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState(''); 

    const handleJoin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/user/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    nickname, 
                    phoneNumber, 
                    birthDate, 
                }),
            });

            if (!response.ok) {
                throw new Error("회원가입 실패");
            }

            const data = await response.json();
            console.log("회원가입 성공:", data);
            alert("회원가입이 완료되었습니다!");
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <div className="form">
            <h2 className='login-title'>Join</h2>

            <form className='login-form' onSubmit={handleJoin}>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input 
                        type='text'
                        id='username'
                        placeholder='ID를 입력하세요'
                        name='username'
                        autoComplete='username'
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type='password'
                        id='password'
                        placeholder='Password'
                        name='password'
                        autoComplete='password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='nickname'>Nickname</label> 
                    <input 
                        type='text'
                        id='nickname'
                        placeholder='Nickname'
                        name='nickname'
                        autoComplete='nickname'
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='phoneNumber'>Phone Number</label>
                    <input 
                        type='tel'
                        id='phoneNumber'
                        placeholder='Phone Number'
                        name='phoneNumber'
                        autoComplete='tel'
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor='birthDate'>Date of Birth</label>
                    <input 
                        type='date'
                        id='birthDate'
                        name='birthDate'
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>
                <button type='submit' className='btn btn--form btn-login'>
                    Join
                </button>
            </form>
        </div>
    );
};

export default JoinForm;
