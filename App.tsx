//React
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Components
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SingUp from "./pages/singup/SingUp";
import SignIn from "./pages/signin/SignIn";

import OccurrenceList from "./components/Occurrence/OccurrenceList";
//css
import "./App.css";
import ReportIncident from "./pages/report/Report";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="content">
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/cadastro" element={<SingUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/ocorrencias" element={<OccurrenceList />} />
            <Route path="/reportar" element={<ReportIncident />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;