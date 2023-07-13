import React, { useEffect, useState } from 'react'

export default function Chat() {
    const [wsConn, setWsConn] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWsConn(ws);
        ws.addEventListener('message', handleMessage);
    }, []);
    useEffect(() => {

    }, [onlinePeople]);


    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        console.log(people)
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        
        const messageData = JSON.parse(e.data);
        if ('online' in messageData) {
            console.log('Online',messageData.online);
            showOnlinePeople(messageData.online);
            
        }
    }

    return (
        <div className='flex h-screen'>
            <div className="bg-white w-1/3 pl-4 pt-4">
                <div className="text-blue-600 font-bold flex gap-2 text-lg text-center items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                        <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                        <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
                    </svg>
                    chatApp
                </div>
                {Object.keys(onlinePeople).map((userId) => (
                    <div className='border-b text-black border-gray-100 py-2'>
                        {onlinePeople[userId]}
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className='flex-grow'>messages with selected person</div>
                <div className="flex gap-2">
                    <input type="text"
                        placeholder='Type your message here'
                        className='bg-white w-full text-xs border p-2 rounded-sm sm:flex-grow sm:text-base'
                    />
                    <button className='bg-blue-500 p-2 text-white rounded-sm'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <   path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg> */}
                    </button>
                </div>
            </div>
        </div>
  )
};

