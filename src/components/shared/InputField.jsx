import './InputField.css'

function InputField({ label, type, value, onChange, placeholder, required }) {
  return (
    <>
      {label ? (
        <label className='label'>
          {label}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
          ></input>
        </label>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        ></input>
      )}
    </>
  );
}

export default InputField;
