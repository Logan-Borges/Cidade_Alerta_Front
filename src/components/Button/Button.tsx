import "./Button.css";

interface ButtonProps {
  text: string;
  task: () => void;
  fullWidth?: boolean;
}

const Button = ({ text, task, fullWidth }: ButtonProps) => {
  return (
    <button
      onClick={() => task()}
      className={`primary ${fullWidth ? "full-width" : ""}`}
    >
      {text}
    </button>
  );
};

export default Button;