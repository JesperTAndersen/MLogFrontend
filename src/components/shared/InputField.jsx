import formStyles from "../../styles/forms.module.css";

function InputField({ label, type, value, onChange, placeholder, required, hideRequired = false }) {
  return (
    <>
      <label className={formStyles.label}>
        {label}
        {required && !hideRequired ? <span> *</span> : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={formStyles.control}
        />
      </label>
    </>
  );
}

export default InputField;
