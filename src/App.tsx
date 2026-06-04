import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SingUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import OccurrenceList from "./components/Occurrence/OccurrenceList";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Reportar from "./pages/report/Report";
import Analytics from "./pages/analytics/Analytics";
import "./App.css";

const AUTH_ROUTES = ["/login", "/cadastro"];
const FULL_ROUTES = ["/", "/profile", "/ocorrencias"];

function AdminRoute({ children }: { children: React.ReactNode }) {
  const role = localStorage.getItem("role");
  if (role !== "ADMIN") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Layout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);
  const isFull = FULL_ROUTES.includes(pathname);

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
        <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
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