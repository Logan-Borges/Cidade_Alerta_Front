import { useState, useEffect } from "react";
import "./NavBar.css";
import { LogoCidadeAlerta } from "../../assets/logo";
import Button from "../Button/Button";
import MenuHamburguer from "./MenuHamburguer";

type NavItem = {
  label: string;
  action?: () => void;
  url?: string;
  type?: "text" | "button";
};

interface NavbarProps {
  logoText?: string;
}

const Navbar = ({
  logoText = "Cidade Alerta",
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const menu: NavItem[] = [
    { label: "Home", url: "/home", type: "text" },
    { label: "Reportar", url: "/reportar", type: "text" },
    { label: "Ocorrências", url: "/ocorrencias", type: "text" },
    ...(isLoggedIn
      ? [
          { label: "Perfil", url: "/perfil", type: "text" },
          { label: "Sair", action: handleLogout, type: "button" },
        ]
      : [
          { label: "Login", action: () => (window.location.href = "/login"), type: "button" },
          { label: "Cadastro", action: () => (window.location.href = "/cadastro"), type: "button" },
        ]),
  ] as NavItem[];

  return (
    <nav className="navbar">
      <div className="logo">
        <LogoCidadeAlerta size={40} color="#e7eb0b" />
        {logoText}
      </div>
      <MenuHamburguer onChange={(next) => setMenuOpen(next)} open={menuOpen} />
      <div className="itemsNavBar">
        <ul id="site-menu" className={`menu ${menuOpen ? "open" : ""}`}>
          {menu.map((item, idx) => (
            <li key={idx}>
              {item.type === "button" ? (
                <Button
                  text={item.label}
                  task={() => {
                    if (typeof item.action === "function") item.action();
                    setMenuOpen(false);
                  }}
                />
              ) : (
                <a href={item.url} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;