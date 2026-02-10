import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import type { LoginData } from '../types/user';  // ← ใช้ type จากไฟล์ types

function Login() {
    // useNavigate = ใช้เปลี่ยนหน้า เช่น navigate('/todos')
    const navigate = useNavigate();

    // ตั้งค่า form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginData>();  // ใช้ LoginData จาก types/user.ts

    // เก็บ error จาก API
    const [apiError, setApiError] = useState('');

    // ฟังก์ชันตอนกด submit
    const onSubmit = async (data: LoginData) => {
        setApiError('');

        try {
            // ส่งข้อมูลไป API
            const response = await authAPI.login(data);

            // เก็บ token ไว้ใน browser
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // login สำเร็จ → ไปหน้า TodoList
            navigate('/todos');
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>เข้าสู่ระบบ</h2>

                {apiError && <div className="error-message">{apiError}</div>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label>อีเมล</label>
                        <input
                            type="email"
                            placeholder="กรอกอีเมล"
                            {...register('email', {
                                required: 'กรุณากรอกอีเมล',
                            })}
                        />
                        {errors.email && (
                            <span className="field-error">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>รหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="กรอกรหัสผ่าน"
                            {...register('password', {
                                required: 'กรุณากรอกรหัสผ่าน',
                                minLength: { value: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัว' }
                            })}
                        />
                        {errors.password && (
                            <span className="field-error">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>

                {/* Link = เหมือนแท็ก <a> แต่ไม่ reload หน้า */}
                <p className="auth-switch">
                    ยังไม่มีบัญชี?{' '}
                    <Link to="/register">สมัครสมาชิก</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
