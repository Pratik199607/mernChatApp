import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

export default function RegisterAndLoginForm(){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { setUserName: setLoggedInUsername, setId } = useContext(UserContext);
    const [isLoginRegister, setIsLoginRegister] = useState('register');

    async function handleSubmit(e) {
        e.preventDefault();
        const url = isLoginRegister === 'register' ? 'register' : 'login';
        const { data } = await axios.post(url, { username, password });
        setLoggedInUsername(username);
        setId(data.id);
        console.log(data);
    }

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
            <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='username'
                    value={username}
                    className='block w-full rounded-sm p-2 mb-2 border'
                    onChange={e=>setUserName(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='password'
                    value={password}
                    className='block w-full rounded-sm p-2 mb-2 border'
                    onChange={e=>setPassword(e.target.value)}
                />
                <button className='bg-blue-500 text-white block rounded-sm w-full p-1 mt-3'>
                    {isLoginRegister==='register'?'Register':'Login'}
                </button>
                {isLoginRegister==="register" && (
                    <div className='text-center mt-2'>
                        Already a member? 
                        <button href='' onClick={()=>setIsLoginRegister('login')}>
                            Login Here
                        </button>
                    </div>
                )}
                {isLoginRegister==="login" && (
                    <div className='text-center mt-2'>
                        Dont have an account?
                        <button href='' onClick={()=>setIsLoginRegister('register')}>
                            Register
                        </button>
                    </div>
                )}
            </form>
        </div>
  )
};

// export default Register;