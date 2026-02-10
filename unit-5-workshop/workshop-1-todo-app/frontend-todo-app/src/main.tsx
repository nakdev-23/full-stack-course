import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // เพิ่ม Router
import './index.css'
import App from './App.tsx'

// BrowserRouter ครอบ App เพื่อให้ใช้ routing ได้
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
