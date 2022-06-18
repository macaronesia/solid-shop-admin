import React from 'react';

function SelectField({
  title,
  id,
  name,
  options,
  value,
  onSelect,
  onBlur,
  invalid,
  error
}) {
  const onChange = (e) => {
    const i = parseInt(e.target.value, 10);
    onSelect(i >= 0 ? options[i].value : null);
  };
  return (
    <div className="form-group">
      <label htmlFor={id}>{title}</label>
      <select
        id={id}
        name={name}
        className={`form-control ${invalid ? 'is-invalid' : ''}`}
        onChange={onChange}
        value={options ? options.findIndex((option) => value === option.value) : -1}
        {...{
          ...(onBlur ? { onBlur } : {})
        }}
      >
        <option value="-1"> </option>
        {options && options.map((option, index) => (
          <option key={option.value} value={index}>{option.name}</option>
        ))}
      </select>
      <span className="error invalid-feedback">{error}</span>
    </div>
  );
}

export default SelectField;
