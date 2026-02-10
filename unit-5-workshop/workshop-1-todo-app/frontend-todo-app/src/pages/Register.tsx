// import สิ่งที่ต้องใช้
import { useState } from 'react';                        // useState = สร้างตัวแปรที่เปลี่ยนค่าได้
import { useForm } from 'react-hook-form';                // useForm = จัดการ form (กรอกข้อมูล, ตรวจสอบ)
import { useNavigate, Link } from 'react-router-dom';     // useNavigate = เปลี่ยนหน้า, Link = ลิงก์
import { authAPI } from '../services/api';                 // authAPI = ฟังก์ชันเรียก API
import type { RegisterFormData } from '../types/user';     // RegisterFormData = รูปร่างข้อมูลที่ form ต้องกรอก

function Register() {
    // navigate ใช้เปลี่ยนหน้า เช่น navigate('/login') = ไปหน้า login
    const navigate = useNavigate();

    // ตั้งค่า form ด้วย useForm
    const {
        register,       // register = ผูก input กับ form (แทนการใช้ useState ทีละตัว)
        handleSubmit,   // handleSubmit = ตรวจสอบข้อมูลก่อนส่ง ถ้าผ่านจะเรียก onSubmit
        watch,          // watch = ดูค่าที่พิมพ์ใน field อื่น (ใช้เช็ครหัสผ่านตรงกัน)
        formState: {
            errors,         // errors = เก็บข้อผิดพลาดทุก field เช่น errors.email.message
            isSubmitting    // isSubmitting = true ตอนกำลังส่งข้อมูล (ใช้ disable ปุ่ม)
        }
    } = useForm<RegisterFormData>();
    // <RegisterFormData> บอกว่า form นี้มี field: username, email, password, confirmPassword

    // สร้างตัวแปรเก็บ error ที่ได้จาก API (เช่น "อีเมลนี้ถูกใช้แล้ว")
    const [apiError, setApiError] = useState('');

    // ฟังก์ชันนี้ทำงานเมื่อกด submit และผ่านการตรวจสอบแล้ว
    // data = ข้อมูลทั้งหมดที่กรอกใน form
    const onSubmit = async (data: RegisterFormData) => {
        setApiError('');  // ล้าง error เดิมก่อน

        try {
            // ส่งข้อมูลไป API เพื่อสมัครสมาชิก
            // ส่งแค่ username, email, password (ไม่ส่ง confirmPassword เพราะ API ไม่ต้องการ)
            await authAPI.register({
                username: data.username,
                email: data.email,
                password: data.password,
            });

            // สมัครสำเร็จ → พาไปหน้า login เพื่อเข้าสู่ระบบ
            navigate('/login');
        } catch (err: any) {
            // สมัครไม่สำเร็จ → แสดง error (เช่น "อีเมลนี้ถูกใช้แล้ว")
            setApiError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ');
        }
    };

    // ส่วนแสดงผล (HTML ที่เขียนใน React เรียกว่า JSX)
    return (
        // auth-container = กล่องใหญ่จัดทุกอย่างให้อยู่กลางจอ
        <div className="auth-container">
            {/* auth-card = กล่องสี่เหลี่ยมขาวที่ครอบ form */}
            <div className="auth-card">
                <h2>สมัครสมาชิก</h2>

                {/* ถ้ามี error จาก API → แสดงกล่องสีแดง */}
                {/* && หมายถึง "ถ้าด้านซ้ายเป็นจริง ให้แสดงด้านขวา" */}
                {apiError && <div className="error-message">{apiError}</div>}

                {/* handleSubmit ตรวจสอบ validation ก่อน → ถ้าผ่าน → เรียก onSubmit */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* ช่อง Username */}
                    <div className="form-group">
                        <label>ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            placeholder="กรอกชื่อผู้ใช้"
                            // ...register ผูก input นี้กับ form ในชื่อ 'username'
                            // required = ห้ามเว้นว่าง, minLength = ขั้นต่ำ 3 ตัวอักษร
                            {...register('username', {
                                required: 'กรุณากรอกชื่อผู้ใช้',
                                minLength: { value: 3, message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัว' }
                            })}
                        />
                        {/* ถ้า username มี error → แสดงข้อความสีแดงใต้ input */}
                        {errors.username && (
                            <span className="field-error">{errors.username.message}</span>
                        )}
                    </div>

                    {/* ช่อง Email */}
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

                    {/* ช่อง Password */}
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

                    {/* ช่อง ยืนยันรหัสผ่าน */}
                    <div className="form-group">
                        <label>ยืนยันรหัสผ่าน</label>
                        <input
                            type="password"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            {...register('confirmPassword', {
                                required: 'กรุณายืนยันรหัสผ่าน',
                                // validate = ตรวจสอบเอง
                                // watch('password') = ดูค่าที่พิมพ์ในช่อง password
                                // ถ้าไม่ตรงกัน → แสดง "รหัสผ่านไม่ตรงกัน"
                                validate: (value) =>
                                    value === watch('password') || 'รหัสผ่านไม่ตรงกัน'
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="field-error">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    {/* ปุ่ม submit */}
                    {/* disabled = ปิดปุ่มตอนกำลังส่งข้อมูล กันกดซ้ำ */}
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </button>
                </form>

                {/* ลิงก์กลับไปหน้า Login */}
                <p className="auth-switch">
                    มีบัญชีแล้ว?{' '}
                    <Link to="/login">เข้าสู่ระบบ</Link>
                </p>
            </div>
        </div>
    );
}

// export = ส่งออก component ให้ไฟล์อื่นนำไปใช้ได้
export default Register;
