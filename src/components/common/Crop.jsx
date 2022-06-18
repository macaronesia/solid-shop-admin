import React, {
  useRef,
  useState
} from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop
} from 'react-image-crop';

const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => centerCrop(
  makeAspectCrop(
    {
      unit: '%',
      width: 90
    },
    aspect,
    mediaWidth,
    mediaHeight
  ),
  mediaWidth,
  mediaHeight
);

function Crop({
  imgSrc,
  format,
  aspect,
  onComplete,
  close
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    setImageLoaded(true);
    const { width, height } = e.currentTarget;
    if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    } else {
      setCrop({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      });
    }
  };

  const cropImage = () => {
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    ctx.save();
    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
    ctx.restore();
    onComplete(canvas.toDataURL(format));
  };

  return (
    <div>
      <div className="modal-backdrop fade show" />
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="crop-container">
          <ReactCrop
            className="crop-widget"
            crop={crop}
            onChange={(pixelCrop, percentCrop) => {
              setCrop(percentCrop);
            }}
            onComplete={setCompletedCrop}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Crop me"
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <div className="btn-group crop-btn-group">
            <button
              type="button"
              className="btn btn-default"
              onClick={close}
              data-test="cropCancel"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-info"
              onClick={cropImage}
              disabled={!imageLoaded}
              data-test="cropConfirm"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Crop;
