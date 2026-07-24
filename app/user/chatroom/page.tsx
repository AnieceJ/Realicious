"use client";
import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

import Container from "../_components/container";
import Left from "./_components/left";

interface Message {
  sender: string;
  content: string;
}

// 連線後端
const socket: Socket = io('http://localhost:3001/');

export default function Chatroom() {

const [roomId, setRoomId] = useState('room-101'); // 預設測試房間名
  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);

  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 監聽後端廣播過來的「receive_message」事件
    socket.on('receive_message', (newMessage: Message) => {
      // 將新訊息追加到現有的訊息陣列中
      setMessages((prev) => [...prev, newMessage]);
    });

    // 清理函數：當元件卸載時，取消監聽，防止記憶體洩漏
    return () => {
      socket.off('receive_message');
    };
  }, []);

  // 1. 按下「加入房間」
  const handleJoinRoom = () => {
    if (userName.trim() && roomId.trim()) {
      socket.emit('join_room', roomId);
      console.log("前端準備發送 join_room:", roomId); // 👈 加這行確認有沒有執行
      setJoined(true);
    }
  };

  // 2. 按下「發送訊息」
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const messageData = {
      roomId,
      sender: userName,
      content: messageInput,
    };

    // 透過 Socket 傳送到後端
    socket.emit('send_message', messageData);
    setMessageInput(''); // 清空輸入框
  };

  // return (
  //   <Container className="bg-white flex-col sm:flex-row overflow-hidden">
  //     <Left></Left>
  //     <div className="w-[70%] h-180 p-4 flex-col justify-center items-center">
  //       <div className="w-full h-125 overflow-y-auto border flex flex-col">
  //         <div className="w-150 bg-gray-100 flex my-4">
  //           <div className=" w-12.5 border mx-4"></div>
  //           <div>
  //             <p>XXX</p>
  //             <p>今天天氣真好</p>
  //           </div>
  //         </div>
  //         <div className="w-150 bg-gray-100 flex flex-row-reverse my-4">
  //           <div className="w-12.5 border mx-4 "></div>
  //           <div className="">
  //             <p>XXX</p>
  //             <p>今天天氣真好</p>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="w-full h-50 border">
  //         <input className="w-50 h-12.5 border" type="text" />
  //         <button className="w-25 h-12.5 border">送出</button>
  //       </div>
  //     </div>
  //   </Container>
  // );
  if (!joined) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Step 1: 輸入名字與房間號碼</h2>
        <input
          type="text"
          placeholder="你的名字"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="房間 ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleJoinRoom}>進入房間</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>房間：{roomId}（使用者：{userName}）</h2>
      
      {/* 訊息展示區 */}
      <div
        style={{
          border: '1px solid #ccc',
          height: '300px',
          overflowY: 'scroll',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <strong>{msg.sender}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {/* 發送訊息區 */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="輸入訊息..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ width: '70%', padding: '5px' }}
        />
        <button type="submit" style={{ width: '25%', padding: '5px', marginLeft: '5px' }}>
          發送
        </button>
      </form>
    </div>
  );
}

