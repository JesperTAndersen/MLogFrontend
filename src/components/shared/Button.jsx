import buttonStyles from "../../styles/buttons.module.css";

function Button({ handler, className, buttonText }) {
  return (
    <button
      type="submit"
      onClick={typeof handler === "function" ? handler : undefined}
      className={className ?? buttonStyles.primary}
    >
      {buttonText}
    </button>
  );
}
export default Button;
