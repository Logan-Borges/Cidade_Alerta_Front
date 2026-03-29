//React
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Components
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SingUp from "./pages/singup/SingUp";
//css
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/cadastro" element={<SingUp />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;