"use client";

import { useUser } from "@/app/context/user";
import { useChatroom } from "./hooks/useChatroom";
import Container from "@/app/user/_components/container";

import RoomList from "./_components/RoomList";
import CreateRoomForm from "./_components/CreateRoomForm";
import ChatWindow from "./_components/ChatWindow";
import PasswordModal from "./_components/PasswordModal";

export default function Chatroom() {
  const { user, loading } = useUser();
  const {
    rooms,
    currentRoom,
    messages,
    passwordModalRoom,
    setPasswordModalRoom,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    deleteRoom,
  } = useChatroom();

  if (loading) return <div className="flex h-screen items-center justify-center">載入中...</div>;
  if (!user) return <div className="flex h-screen items-center justify-center">請先登入</div>;

  const currentUserId = Number(user.id);

  return (
    <Container className="py-2 md:py-6 overflow-x-auto">
      <div className="flex flex-row h-[600px] md:h-[750px] gap-2 md:gap-6 min-w-[640px]">
        {/* 左側：大廳 */}
        <RoomList
          rooms={rooms}
          currentRoomId={currentRoom?.id}
          currentUserId={currentUserId}
          onJoinRoom={(room) => joinRoom(room.id)}
          onDeleteRoom={deleteRoom}
        />

        {/* 右側：控制台 & 聊天室 */}
        <div className="flex flex-1 flex-col gap-2 md:gap-4 shrink-0">
          <CreateRoomForm onCreateRoom={createRoom} />
          <ChatWindow
            currentRoom={currentRoom}
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={sendMessage}
            onLeaveRoom={leaveRoom}
          />
        </div>
      </div>

      {/* 彈窗 */}
      {passwordModalRoom && (
        <PasswordModal
          roomName={passwordModalRoom.name}
          onSubmit={(pwd) => joinRoom(passwordModalRoom.id, pwd)}
          onClose={() => setPasswordModalRoom(null)}
        />
      )}
    </Container>
  );
}