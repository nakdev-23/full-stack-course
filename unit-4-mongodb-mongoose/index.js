const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected ✅");
    })
    .catch((err) => {
        console.error("MongoDB connection error ❌", err);
    });


const app = express();

//  ทำให้ Express อ่าน JSON ได้
app.use(express.json());

//  ทดสอบว่า server ทำงานไหม
app.get("/", (req, res) => {
    res.send("Server is running ");
});

const User = require("./models/User");
//  C = CREATE (เพิ่มข้อมูล)
app.post("/api/users", async (req, res) => {
    const { name, age } = req.body;

    const newUser = await User.create({ name, age });

    res.status(201).json({
        message: "User created ",
        data: newUser,
    });
});

// R = READ (ดึงข้อมูลทั้งหมด + ค้นหาด้วย Query Parameter)
app.get("/api/users", async (req, res) => {
    try {
        const { name } = req.query;

        // ถ้ามี query → ค้นหา
        if (name) {
            // 💡 บอก MongoDB ว่า: "ช่วยหา User ที่ชื่อมีคำว่า ___ อยู่ในนั้น"
            // - $regex: name → ค้นหาชื่อที่มีคำนี้อยู่ (เหมือนพิมพ์ค้นหาใน Google)
            // - $options: "i" → ไม่สน ตัวพิมพ์เล็ก/ใหญ่ (john = John = JOHN)
            const foundUsers = await User.find({
                name: { $regex: name, $options: "i" }
            });

            if (!foundUsers.length) {
                return res.status(404).json({
                    message: "No users found with that name ❌"
                });
            }

            return res.json({
                message: `Found ${foundUsers.length} user(s)`,
                data: foundUsers
            });
        }

        const users = await User.find();
        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching users ❌",
            error: error.message
        });
    }
});

//  R = READ (ดึงข้อมูลคนเดียวตาม ID)
app.get("/api/users/:id", async (req, res) => {
    try {
        // 💡 MongoDB ใช้ _id แบบ ObjectId (ไม่ใช่ตัวเลข 1, 2, 3)
        // ตัวอย่าง: /api/users/65f2a1b3c4d5e6f7g8h9i0j1
        const { id } = req.params;

        // 💡 findById() = หา document ที่มี _id ตรงกับที่ส่งมา
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found ❌" });
        }

        res.json(user);

    } catch (error) {
        // 💡 ถ้า id format ไม่ถูกต้อง (ไม่ใช่ ObjectId) จะเข้า catch นี้
        res.status(400).json({
            message: "Invalid user ID format ❌",
            error: error.message
        });
    }
});

// R = READ (ค้นหาผู้ใช้ด้วยชื่อ - แบบ Path Parameter) 
app.get("/api/users/search/:name", async (req, res) => {
    try {
        const { name } = req.params;

        // 💡 ใช้ $regex ค้นหาชื่อที่มีคำนี้อยู่ (แบบไม่สนตัวพิมพ์เล็ก/ใหญ่)
        const foundUsers = await User.find({
            name: { $regex: name, $options: "i" }
        });

        if (foundUsers.length === 0) {
            return res.status(404).json({
                message: "No users found with that name ❌"
            });
        }

        res.json({
            message: `Found ${foundUsers.length} user(s)`,
            data: foundUsers
        });

    } catch (error) {
        res.status(500).json({
            message: "Error searching users ❌",
            error: error.message
        });
    }
});

//  U = UPDATE (แก้ไขข้อมูล)
app.put("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        // 💡 findByIdAndUpdate() = หา document ตาม _id แล้ว update
        // - ตัวแรก: id ที่จะหา
        // - ตัวที่สอง: ข้อมูลที่จะ update
        // - ตัวที่สาม: options → { new: true } = ส่งข้อมูลใหม่กลับมา (ไม่ใช่ข้อมูลเก่า)
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, age },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found ❌" });
        }

        res.json({
            message: "User updated ✅",
            data: updatedUser,
        });

    } catch (error) {
        res.status(400).json({
            message: "Error updating user ❌",
            error: error.message
        });
    }
});

//  D = DELETE (ลบข้อมูล)
app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // 💡 findByIdAndDelete() = หา document ตาม _id แล้วลบ
        // ถ้าลบสำเร็จ จะคืนข้อมูล user ที่ถูกลบกลับมา
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found ❌" });
        }

        res.json({
            message: "User deleted ✅",
            data: deletedUser  // ส่งข้อมูลที่ถูกลบกลับไปด้วย (optional)
        });

    } catch (error) {
        res.status(400).json({
            message: "Error deleting user ❌",
            error: error.message
        });
    }
});


//  เปิด Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
