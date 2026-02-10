import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <h1>📝 Todo App</h1>
            <p>จัดการรายการสิ่งที่ต้องทำของคุณ</p>

            <div className="home-buttons">
                {/* ปุ่มไปหน้า Login */}
                <Link to="/login" className="btn-primary">
                    เข้าสู่ระบบ
                </Link>
                <br />
                {/* ปุ่มไปหน้า Register */}
                <Link to="/register" className="btn-secondary">
                    สมัครสมาชิก
                </Link>
            </div>
        </div>
    );
}

export default Home;
