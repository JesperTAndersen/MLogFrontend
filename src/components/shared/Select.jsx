import formStyles from "../../styles/forms.module.css";

function Select({ labelText, value, onChange, options, required }) {
  return (
    <>
      <label className={formStyles.label}>
        {labelText}
        <select
          className={formStyles.control}
          value={value ?? ""}
          name="choice"
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

export default Select;
