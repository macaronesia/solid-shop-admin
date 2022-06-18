import React, { useRef } from 'react';

function FileField({
  title,
  id,
  accept,
  value,
  onSelect,
  onReset,
  invalid,
  error
}) {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      onSelect(e.target.files[0]);
    }
  };
  const handleReset = () => {
    onReset();
    fileRef.current.value = null;
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{title}</label>
      <div className="input-group">
        <div className="custom-file">
          <input
            ref={fileRef}
            type="file"
            id={id}
            className={`custom-file-input ${invalid ? 'is-invalid' : ''}`}
            onChange={handleChange}
            {...{
              ...(accept ? { accept } : {})
            }}
          />
          <label className="custom-file-label" htmlFor={id}>{value ? value.name : 'Choose file'}</label>
        </div>
        {onReset && (
          <div className="input-group-append">
            <button type="button" className="input-group-text" onClick={handleReset}>Reset</button>
          </div>
        )}
      </div>
      <span className="error invalid-feedback" style={{ display: invalid ? 'block' : 'none' }}>{error}</span>
    </div>
  );
}

export default FileField;
