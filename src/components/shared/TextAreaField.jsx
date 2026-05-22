import formStyles from "../../styles/forms.module.css";

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
}) {
  return (
    <label className={formStyles.label}>
      {label}
      {required ? <span> *</span> : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`${formStyles.control} ${formStyles.textarea}`}
      />
    </label>
  );
}

export default TextAreaField;
