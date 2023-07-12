import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'
export const UserContext = createContext({});

export function UserContextProvider({children})  {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        axios.get('/profile',{withCredentials:true}).then(res => {
            console.log(res.data);
            setId(res.data.userId);
            setUsername(res.data.username);
        });
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    )
};

// export default UserContextProvider;