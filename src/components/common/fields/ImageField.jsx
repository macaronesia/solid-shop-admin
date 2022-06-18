import React, {
  useRef,
  useState
} from 'react';

import Crop from '@/components/common/Crop';

function ImageField({
  title,
  id,
  aspect,
  format,
  value,
  onComplete,
  onReset,
  invalid,
  error
}) {
  const [inputSrc, setInputSrc] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const fileRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length) {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => setInputSrc(reader.result.toString() || '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleReset = () => {
    onReset();
    setPreviewSrc('');
  };
  const closeCrop = () => {
    setInputSrc('');
    fileRef.current.value = null;
  };
  const handleCropped = async (dataURL) => {
    setPreviewSrc(dataURL);
    const blob = await (await fetch(dataURL)).blob();
    onComplete(new File([blob], '', { type: format }));
    closeCrop();
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{title}</label>
      {Boolean(previewSrc) && (
        <div className="preview-image-container">
          <img src={previewSrc} alt="Preview" className="preview-image" />
        </div>
      )}
      <div className="input-group">
        <div className="custom-file">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            id={id}
            className={`custom-file-input ${invalid ? 'is-invalid' : ''}`}
            onChange={handleChange}
          />
          <label className="custom-file-label" htmlFor={id}>{value ? 'Image' : 'Choose file'}</label>
        </div>
        {onReset && (
          <div className="input-group-append">
            <button type="button" className="input-group-text" onClick={handleReset}>Reset</button>
          </div>
        )}
      </div>
      <span className="error invalid-feedback" style={{ display: invalid ? 'block' : 'none' }}>{error}</span>
      {Boolean(inputSrc) && (
        <Crop
          imgSrc={inputSrc}
          aspect={aspect}
          format={format}
          onComplete={handleCropped}
          close={closeCrop}
        />
      )}
    </div>
  );
}

export default ImageField;
