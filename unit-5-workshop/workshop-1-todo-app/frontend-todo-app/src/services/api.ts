import axios from 'axios';
import type { LoginData, RegisterData, LoginResponse, RegisterResponse } from '../types/user';
import type { CreateTodoData, UpdateTodoData, TodosResponse, TodoResponse, Todo } from '../types/todo';


// สร้าง axios  Instance ที่ตั้งค่าพื้นฐานไว้
// ไม่ต้องพิมพ์ URL เต็มทุกครั้ง
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'  // บอกว่าส่งข้อมูลแบบ JSON
    }
});



// Interceptor - เพิ่ม Token อัตโนมัติ 
// (ดึงค่า token จาก ให้เก็บที่ localStorage คือใน browser ของ user และดึง token มาใช้ทุกครั้งที่มีการเรียก API)

// ทุกครั้งที่เรียก API จะทำงานนี้ก่อน
API.interceptors.request.use((config) => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem('token');

    // ถ้ามี token ให้ใส่ใน Header
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Auth API - สำหรับสมัครสมาชิก / เข้าสู่ระบบ
export const authAPI = {
    // สมัครสมาชิก
    // data = { username, email, password }
    register: (data: RegisterData) => {
        return API.post<RegisterResponse>('/auth/register', data);
    },

    // เข้าสู่ระบบ
    // data = { email, password }
    login: (data: LoginData) => {
        return API.post<LoginResponse>('/auth/login', data);
    },
};

// Todo API - CRUD รายการ Todo
export const todoAPI = {
    // ดึงข้อมูล Todo ทั้งหมดจาก ฐานข้อมูล
    getAll: () => {
        return API.get<TodosResponse>('/todos');
    },

    // ดึงข้อมูล Todo เฉพาะอัน (ตาม id)
    getOne: (id: string) => {
        return API.get<Todo>(`/todos/${id}`);
    },

    // สร้าง Todo ใหม่ บันทึกลงฐานข้อมูล
    // data = { title, description? }
    create: (data: CreateTodoData) => {
        return API.post<TodoResponse>('/todos', data);
    },

    // แก้ไข Todo ระบุ id
    // data = { title?, description?, completed? }
    update: (id: string, data: UpdateTodoData) => {
        return API.put<TodoResponse>(`/todos/${id}`, data);
    },

    // ลบ Todo ระบุ id
    delete: (id: string) => {
        return API.delete<TodoResponse>(`/todos/${id}`);
    },
};

export default API;

