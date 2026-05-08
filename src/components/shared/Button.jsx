function Button({ handler, className, buttonText }) {
  return (
    <button
      type="submit"
      onClick={typeof handler === "function" ? handler : undefined}
      className={className}
    >
      {buttonText}
    </button>
  );
}
export default Button;
