import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import SingUp from "./pages/singup/SingUp";
import SignIn from "./pages/signin/SignIn";
import OccurrenceList from "./components/Occurrence/OccurrenceList";
import Profile from "./pages/profile/Profile";
import "./App.css";

const AUTH_ROUTES = ["/login", "/cadastro"];

function Layout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/cadastro" element={<SingUp />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/ocorrencias" element={<OccurrenceList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
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
