// โครงสร้างข้อมูล Todo ทั้งหมด ที่ได้รับจาก API 
export interface Todo {
    _id: string;          // รหัส Todo (จาก MongoDB)
    title: string;        // ชื่องาน
    description: string;  // รายละเอียด
    completed: boolean;   // เสร็จแล้วหรือยัง (true/false)
    user: string;         // รหัสเจ้าของ Todo
    createdAt: string;    // วันที่สร้าง
    updatedAt: string;    // วันที่แก้ไขล่าสุด
}

// ข้อมูลสำหรับสร้าง Todo ใหม่ (ข้อมูลที่ส่งไป API)
export interface CreateTodoData {
    title: string;        // ชื่องาน
    description?: string; // รายละเอียด (ไม่บังคับ, ? หมายถึง optional)
}

// ข้อมูลสำหรับแก้ไข Todo (ข้อมูลที่ส่งไป API)
export interface UpdateTodoData {
    title?: string;       // ชื่องานใหม่ (optional)
    description?: string; // รายละเอียดใหม่ (optional)
    completed?: boolean;  // สถานะเสร็จ/ไม่เสร็จ (optional)
}

// Response ที่ได้จาก Get All Todos (โครงสร้างข้อมูลที่ได้รับจาก API)
export interface TodosResponse {
    count: number;        // จำนวน Todo ทั้งหมด
    todos: Todo[];        // Array ของ Todo
}

// Response ที่ได้จาก Create/Update Todo (โครงสร้างข้อมูลที่ได้รับจาก API)
export interface TodoResponse {
    message: string;      // ข้อความ
    todo: Todo;           // ข้อมูล Todo
}

