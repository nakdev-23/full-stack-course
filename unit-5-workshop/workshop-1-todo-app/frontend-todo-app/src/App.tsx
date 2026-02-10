import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TodoList from './pages/TodoList'
import './App.css'

function App() {
  return (
    <Routes>
      {/* หน้าแรก "/" → แสดงหน้า Home */}
      <Route path="/" element={<Home />} />

      {/* หน้า Login */}
      <Route path="/login" element={<Login />} />

      {/* หน้า Register */}
      <Route path="/register" element={<Register />} />

      {/* หน้า TodoList - แสดงรายการ Todo */}
      <Route path="/todos" element={<TodoList />} />
    </Routes>
  )
}

export default App

