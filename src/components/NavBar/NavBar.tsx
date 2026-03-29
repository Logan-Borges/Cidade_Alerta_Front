import { useState } from "react";
//css
import "./NavBar.css";
//logo
import { LogoCidadeAlerta } from "../../assets/logo";
//componentes
import Button from "../Button/Button";
import MenuHamburguer from "./MenuHamburguer";

type NavItem = {
  label: string;
  action?: () => void;
  url?: string;
  type?: "text" | "button";
};

interface NavbarProps {
  menu?: NavItem[];
  logoText?: string;
}

const Navbar = ({
  logoText = "Cidade Alerta",
  menu = [
    { label: "Home", url: "/home", type: "text" },
    { label: "Reportar", url: "/reportar", type: "text" },
    { label: "Login", url: "/login", type: "button" },
    { label: "Cadastro", action: () => window.location.href = "/cadastro", type: "button" }
  ],
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <nav className="navbar">

      <div className="logo">
        <LogoCidadeAlerta
          size={40}
          color="#e7eb0b"
        />
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
                  task={() => { if (typeof item.action === 'function') item.action(); setMenuOpen(false); }}
                />
              ) : (
                <a href={item.url} onClick={() => setMenuOpen(false)}>{item.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;