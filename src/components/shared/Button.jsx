import buttonStyles from "../../styles/buttons.module.css";

function Button({ handler, className, buttonText, type = "submit", ...rest }) {
  return (
    <button
      {...rest}
      type={type}
      onClick={typeof handler === "function" ? handler : undefined}
      className={className ?? buttonStyles.primary}
    >
      {buttonText}
    </button>
  );
}
export default Button;
