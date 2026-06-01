import formStyles from "../../styles/forms.module.css";

function Select({
  labelText,
  value,
  defaultValue,
  onChange,
  options,
  required,
  name = "choice",
}) {
  const selectProps = {
    className: formStyles.control,
    name,
    onChange,
    required,
  };

  if (value !== undefined) {
    selectProps.value = value ?? "";
  } else {
    selectProps.defaultValue = defaultValue ?? "";
  }

  return (
    <>
      <label className={formStyles.label}>
        {labelText}
        {required ? <span> *</span> : null}
        <select {...selectProps}>
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
