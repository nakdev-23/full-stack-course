// import สิ่งที่ต้องใช้
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { todoAPI } from '../services/api';
import type { Todo } from '../types/todo';

function TodoList() {
    const navigate = useNavigate();

    // เก็บรายการ Todo ทั้งหมด
    const [todos, setTodos] = useState<Todo[]>([]);
    // เก็บข้อความที่พิมพ์ในช่องเพิ่ม Todo
    const [newTodo, setNewTodo] = useState('');
    // เก็บรายละเอียดที่พิมพ์ในช่อง description
    const [newDescription, setNewDescription] = useState('');
    // สถานะกำลังโหลดข้อมูล
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูล user จาก localStorage (ที่เก็บไว้ตอน Login)
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // useEffect = ทำงานครั้งเดียวตอนเปิดหน้า
    // ใช้ดึงข้อมูล Todo ทั้งหมดจาก API
    useEffect(() => {
        fetchTodos();
    }, []);   // [] = ทำครั้งเดียว ไม่ทำซ้ำ

    // ฟังก์ชันดึง Todo ทั้งหมดจาก API
    const fetchTodos = async () => {
        try {
            const response = await todoAPI.getAll();
            setTodos(response.data.todos);  // เก็บข้อมูลใน state
        } catch (err) {
            console.error('โหลด Todo ไม่สำเร็จ:', err);
        } finally {
            setLoading(false);  // โหลดเสร็จแล้ว
        }
    };

    // ฟังก์ชันเพิ่ม Todo ใหม่
    const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();                // ไม่ให้หน้า refresh
        if (!newTodo.trim()) return;       // ถ้าช่องว่าง ไม่ทำอะไร

        try {
            const response = await todoAPI.create({
                title: newTodo,
                description: newDescription,   // ส่ง description ด้วย
            });
            // เพิ่ม Todo ใหม่ไว้ด้านบนสุดของรายการ
            setTodos([response.data.todo, ...todos]);
            setNewTodo('');                // ล้างช่องกรอก
            setNewDescription('');         // ล้างช่อง description
        } catch (err) {
            console.error('เพิ่ม Todo ไม่สำเร็จ:', err);
        }
    };

    // ฟังก์ชันสลับสถานะ เสร็จ/ยังไม่เสร็จ
    const handleToggle = async (todo: Todo) => {
        try {
            const response = await todoAPI.update(todo._id, {
                completed: !todo.completed   // สลับค่า true ↔ false
            });
            // อัปเดตเฉพาะ Todo ที่เปลี่ยน
            setTodos(todos.map(t =>
                t._id === todo._id ? response.data.todo : t
            ));
        } catch (err) {
            console.error('อัปเดต Todo ไม่สำเร็จ:', err);
        }
    };

    // ฟังก์ชันลบ Todo
    const handleDelete = async (id: string) => {
        try {
            await todoAPI.delete(id);
            // ลบออกจาก state (เอาเฉพาะตัวที่ id ไม่ตรง)
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            console.error('ลบ Todo ไม่สำเร็จ:', err);
        }
    };

    // ฟังก์ชัน Logout
    const handleLogout = () => {
        localStorage.removeItem('token');   // ลบ token
        localStorage.removeItem('user');    // ลบข้อมูล user
        navigate('/login');                 // กลับไปหน้า Login
    };

    // ถ้ากำลังโหลด แสดงข้อความ
    if (loading) {
        return <div className="loading">กำลังโหลด...</div>;
    }

    // ส่วนแสดงผล
    return (
        <div className="todo-container">

            {/* Header - ชื่อ app + ปุ่ม Logout */}
            <div className="todo-header">
                <h1>📝 Todo List</h1>
                <div className="user-info">
                    <span>สวัสดี, {user.username}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        ออกจากระบบ
                    </button>
                </div>
            </div>

            {/* ฟอร์มเพิ่ม Todo ใหม่ */}
            <form onSubmit={handleAddTodo} className="add-todo-form">
                <div className="form-inputs">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="ชื่องาน..."
                        className="todo-input"
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="รายละเอียด (ไม่บังคับ)"
                        className="todo-input"
                    />
                </div>
                <button type="submit" className="btn-add">เพิ่ม</button>
            </form>

            {/* รายการ Todo */}
            {todos.length === 0 ? (
                // ถ้าไม่มี Todo แสดงข้อความ
                <div className="empty-message">
                    ยังไม่มีรายการ เพิ่มรายการแรกของคุณเลย! 🎉
                </div>
            ) : (
                // แสดง Todo ทีละอัน
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-content">
                                {/* Checkbox สลับสถานะ */}
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => handleToggle(todo)}
                                    className="todo-checkbox"
                                />
                                {/* ชื่อ + รายละเอียด */}
                                <div className="todo-text">
                                    <span className="todo-title">{todo.title}</span>
                                    {/* แสดง description ถ้ามี */}
                                    {todo.description && (
                                        <span className="todo-description">{todo.description}</span>
                                    )}
                                </div>
                            </div>
                            {/* ปุ่มลบ */}
                            <button onClick={() => handleDelete(todo._id)} className="btn-delete">
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* สถิติ */}
            {todos.length > 0 && (
                <div className="todo-stats">
                    <span>ทั้งหมด: {todos.length}</span>
                    <span>เสร็จแล้ว: {todos.filter(t => t.completed).length}</span>
                    <span>ยังไม่เสร็จ: {todos.filter(t => !t.completed).length}</span>
                </div>
            )}
        </div>
    );
}

export default TodoList;
