function Select({
  labelClassName,
  labelText,
  selectClassName,
  value,
  onChange,
  options,
}) {
  return (
    <>
      <label className={labelClassName}>
        {labelText}
        <select
          className={selectClassName}
          value={value ?? "null"}
          name="choice"
          onChange={onChange}
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
