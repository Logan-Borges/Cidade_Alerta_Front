import "./Button.css";

interface ButtonProps {
  text: string;
  task: () => void;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({ text, task, fullWidth, isLoading }: ButtonProps) => {
  return (
    <button
      onClick={() => !isLoading && task()} // Evita múltiplos cliques se estiver carregando
      className={`primary ${fullWidth ? "full-width" : ""} ${isLoading ? "loading" : ""}`}
      disabled={isLoading} // Desabilita o botão nativamente
    >
      {isLoading ? (
        <span className="spinner"></span> // Ícone carregando
      ) : (
        text
      )}
    </button>
  );
};

export default Button;