import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <main>
                <Routes>
                    {/* rota de teste para navbar */}
                    <Route path="/navbar" element={<Navbar />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
