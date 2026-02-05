const express = require("express");
const app = express();

//  ทำให้ Express อ่าน JSON ได้
app.use(express.json());


//  ทดสอบว่า server ทำงานไหม
app.get("/", (req, res) => {
    res.send("Server is running ");
});

let users = [];
//  C = CREATE (เพิ่มข้อมูล)
app.post("/api/users", (req, res) => {
    const { name, age } = req.body;

    const newUser = {
        id: users.length + 1,
        name,
        age,
    };

    users.push(newUser);

    res.status(201).json({
        message: "User created ",
        data: newUser,
    });
});

// R = READ (ดึงข้อมูลทั้งหมด + ค้นหาด้วย Query Parameter)
app.get("/api/users", (req, res) => {
    const { name } = req.query;

    // ถ้ามี query → ค้นหา
    if (name) {
        const searchTerm = name.toLowerCase();

        const foundUsers = users.filter(u =>
            u.name.toLowerCase().includes(searchTerm)
        );

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

    // ถ้าไม่มี query → ดึงทั้งหมด
    res.json(users);
});

//  R = READ (ดึงข้อมูลคนเดียวตาม ID หรือการค้นหาด้วย ID)
app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found ❌" });
    }

    res.json(user);
});

// R = READ (ค้นหาผู้ใช้ด้วยชื่อ - แบบ Path Parameter) 
app.get("/api/users/search/:name", (req, res) => {
    const name = req.params.name.toLowerCase();

    const foundUsers = users.filter((u) =>
        u.name.toLowerCase().includes(name)
    );

    if (foundUsers.length === 0) {
        return res.status(404).json({
            message: "No users found with that name ❌"
        });
    }
    res.json({
        message: `Found ${foundUsers.length} user(s)`,
        data: foundUsers
    });
});

//  U = UPDATE (แก้ไขข้อมูล)
app.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, age } = req.body;

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found ❌" });
    }

    users[userIndex] = { id, name, age };

    res.json({
        message: "User updated ",
        data: users[userIndex],
    });
});

//  D = DELETE (ลบข้อมูล)
app.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

    users = users.filter((u) => u.id !== id);

    res.json({
        message: "User deleted ",
    });
});


//  เปิด Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
