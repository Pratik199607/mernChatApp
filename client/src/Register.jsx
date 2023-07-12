import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

export default function Register(){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const { setUserName: setLoggedInUsername, setId } = useContext(UserContext);

    async function register(e) {
        e.preventDefault();
        const { data } = await axios.post('/register', { username, password });
        setLoggedInUsername(username);
        setId(data.id);
    }

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
            <form className='w-64 mx-auto mb-12' onSubmit={register}>
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
                    Register
                </button>
            </form>
        </div>
  )
};

// export default Register;