import { z } from "zod";

// DTO สำหรับรับข้อมูล username และ password
export const CreateUserDTO = z.object({
  username: z.string().min(1, "Username is required").max(255, "Username is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")  // เพิ่มเงื่อนไขให้รหัสผ่านมีตัวอักษรพิมพ์ใหญ่
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")  // เพิ่มเงื่อนไขให้รหัสผ่านมีตัวอักษรพิมพ์เล็ก
    .regex(/[0-9]/, "Password must contain at least one number")  // เพิ่มเงื่อนไขให้รหัสผ่านมีตัวเลข
});

// DTO สำหรับ validate การลงชื่อเข้าใช้ (username และ password)
export const SignInDTO = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
