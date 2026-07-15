import { z } from 'zod';

// 定義登入的驗證規則
export const loginSchema = z.object({
  // 1. 驗證帳號必須是 Email 格式
  account: z
    .string()
    .min(1, { message: "此欄位必填" })
    .email({ message: "帳號必須是有效的 Email 格式" }),

  // 2. 驗證密碼必填
  password: z
    .string()
    .min(1, { message: "此欄位必填" }),
    
    // 3. 驗證密碼至少 6 位元，且透過正規表達式確保含英文與數字，可包含特殊字元
  // password_register: z
  //   .string()
  //   .min(6, { message: "密碼至少需要 6 個字元" })
  //   .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
  //     message: "密碼必須包含至少一個英文與一個數字（可包含特殊字元）",
  //   }),
});