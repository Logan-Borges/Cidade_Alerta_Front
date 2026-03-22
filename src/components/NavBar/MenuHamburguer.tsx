import "./MenuHamburguer.css";

export default function MenuHamburguer({ onChange, open }: { onChange: (next: boolean) => void; open?: boolean }) {
        return (
                <div className="hamburguer">
                        <input
                                type="checkbox"
                                id="menuHamburguer"
                                checked={!!open}
                                onChange={(e) => onChange(e.currentTarget.checked)}
                                aria-hidden={false}
                        />
                        <label htmlFor="menuHamburguer" className="toggleMenu">
                                <div className="barsMenu" id="bar1"></div>
                                <div className="barsMenu" id="bar2"></div>
                                <div className="barsMenu" id="bar3"></div>
                        </label>
                </div>
        );
}