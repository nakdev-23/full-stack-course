const jwt = require('jsonwebtoken');  // สำหรับถอดรหัส token
const User = require('../models/User');  // import User Model

// Auth Middleware - ตรวจสอบว่า user login แล้วหรือยัง
const authMiddleware = async (req, res, next) => {
    try {
        // 1. รับ token จาก Header
        // Header จะมีรูปแบบ: "Authorization: Bearer <token>"
        const authHeader = req.headers.authorization;

        // 2. ตรวจสอบว่ามี token มาไหม
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'ไม่พบ token กรุณาเข้าสู่ระบบก่อน'
            });
        }

        // 3. ดึง token ออกมา (ตัดคำว่า "Bearer " ออก)
        // "Bearer eyJhbGci..." → "eyJhbGci..."
        const token = authHeader.split(' ')[1];

        // 4. ถอดรหัส token เพื่อดูข้อมูลข้างใน
        // jwt.verify() จะตรวจสอบว่า token ถูกต้องและไม่หมดอายุ
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. หา user จาก userId ที่เก็บไว้ใน token
        // .select('-password') = ไม่เอา password มาด้วย (เพื่อความปลอดภัย)
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                message: 'ไม่พบผู้ใช้นี้ในระบบ'
            });
        }

        // 6. เก็บข้อมูล user ไว้ใน req.user เพื่อให้ route ถัดไปใช้ได้
        // เช่น req.user.id, req.user.username
        req.user = user;

        // 7. เรียก next() เพื่อไปยัง route ถัดไป
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);

        // ถ้า token หมดอายุหรือไม่ถูกต้อง
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token ไม่ถูกต้อง' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่' });
        }

        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบ token' });
    }
};

// Export ออกไปใช้
module.exports = authMiddleware;
