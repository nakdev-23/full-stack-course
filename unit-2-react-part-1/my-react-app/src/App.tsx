import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("Nak dev");
  return (
    <>
      <h1>สวัสดี นี่คือ {name}</h1>
      <input
        type="text"
        placeholder="พิมพ์ชื่อใหม่..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </>
  );
}

export default App;
