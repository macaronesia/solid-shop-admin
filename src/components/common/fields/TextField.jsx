import React from 'react';

function TextField({
  title,
  id,
  name,
  maxLength,
  value,
  onChange,
  onBlur,
  invalid,
  error
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{title}</label>
      <input
        type="text"
        id={id}
        name={name}
        className={`form-control ${invalid ? 'is-invalid' : ''}`}
        onChange={onChange}
        value={value}
        {...{
          ...(onBlur ? { onBlur } : {}),
          ...(maxLength ? { maxLength } : {})
        }}
      />
      <span className="error invalid-feedback">{error}</span>
    </div>
  );
}

export default TextField;
