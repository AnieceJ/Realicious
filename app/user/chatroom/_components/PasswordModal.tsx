import { useState } from "react";

interface PasswordModalProps {
  roomName: string;
  onSubmit: (password: string) => void;
  onClose: () => void;
}

export default function PasswordModal({
  roomName,
  onSubmit,
  onClose,
}: PasswordModalProps) {
  const [inputPassword, setInputPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    onSubmit(inputPassword);
    setInputPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h4 className="text-sm font-bold text-slate-800">
          輸入密碼進入【{roomName}】
        </h4>
        <p className="mt-1 text-xs text-slate-400">
          此聊天室受密碼保護，請輸入密碼以驗證。
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            placeholder="請輸入房間密碼"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              進入房間
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}