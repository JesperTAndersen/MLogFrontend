import formStyles from "../../styles/forms.module.css";

function InputField({ label, type, value, onChange, placeholder, required }) {
  return (
    <>
      {label ? (
        <label className={formStyles.label}>
          {label}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={formStyles.control}
          ></input>
        </label>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={formStyles.control}
        ></input>
      )}
    </>
  );
}

export default InputField;
