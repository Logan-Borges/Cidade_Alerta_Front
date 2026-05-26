import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SingUp from "./pages/singup/SingUp";
import SignIn from "./pages/signin/SignIn";
import OccurrenceList from "./components/Occurrence/OccurrenceList";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Reportar from "./pages/reportar/Reportar";
import "./App.css";

const AUTH_ROUTES = ["/login", "/cadastro"];
const FULL_ROUTES = ["/", "/profile", "/ocorrencias"];

function Layout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);
  const isFull = FULL_ROUTES.includes(pathname);
  const isReportar = pathname === "/reportar";

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/cadastro" element={<SingUp />} />
      </Routes>
    );
  }

  if (isFull) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ocorrencias" element={<OccurrenceList />} />
        </Routes>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/reportar" element={<Reportar />} />
        <Route path="/ocorrencias" element={<OccurrenceList />} />
      </Routes>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;