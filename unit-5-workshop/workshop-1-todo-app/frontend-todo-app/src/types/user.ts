// ข้อมูล User ที่ได้รับจาก API (โครงสร้างข้อมูลที่ได้รับจาก API)
export interface User {
    id: string;           // รหัสผู้ใช้
    username: string;     // ชื่อผู้ใช้
    email: string;        // อีเมล
}

// ข้อมูลสำหรับ Login (ข้อมูลที่ส่งไป API)   
export interface LoginData {
    email: string;        // อีเมลที่กรอก
    password: string;     // รหัสผ่านที่กรอก
}

// ข้อมูลสำหรับ Register (ข้อมูลที่ส่งไป API)
export interface RegisterData {
    username: string;     // ชื่อผู้ใช้ที่กรอก
    email: string;        // อีเมลที่กรอก
    password: string;     // รหัสผ่านที่กรอก
}

// ข้อมูลที่กรอกใน form Register (มี confirmPassword เพิ่ม)
export interface RegisterFormData extends RegisterData {
    confirmPassword: string;  // ยืนยันรหัสผ่าน
}

// Response ที่ได้จาก Login API (โครงสร้างข้อมูลที่ได้รับจาก API)
export interface LoginResponse {
    message: string;      // ข้อความ เช่น "เข้าสู่ระบบสำเร็จ"
    token: string;        // JWT token
    user: User;           // ข้อมูล user
}

// Response ที่ได้จาก Register API (โครงสร้างข้อมูลที่ได้รับจาก API)
export interface RegisterResponse {
    message: string;      // ข้อความ เช่น "สมัครสมาชิกสำเร็จ"
    user: User;           // ข้อมูล user ที่สร้าง
}


