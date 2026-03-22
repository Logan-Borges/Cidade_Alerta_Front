import "./Button.css";

const Button = ({ text, task }) => {
  return (
    <button
      onClick={() => task()}
      className="primary"
    >
      {text}
    </button>
  );
};

export default Button;