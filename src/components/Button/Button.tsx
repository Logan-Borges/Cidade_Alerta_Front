import "./Button.css";
import Loading from "../Loading/Loading";

interface ButtonProps {
  text: string;
  task: () => void;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({ text, task, fullWidth, isLoading }: ButtonProps) => {
  return (
    <button
      onClick={() => !isLoading && task()}
      className={`primary ${fullWidth ? "full-width" : ""}`}
      disabled={isLoading}
    >
      {isLoading ? <Loading /> : text}
    </button>
  );
};

export default Button;