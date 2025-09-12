import React, { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './ImageCropper.css';

const ImageCropper = ({ onImageCrop }) => {
  const [image, setImage] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const cropperRef = useRef(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCropData = () => {
    try {
      if (cropperRef.current && cropperRef.current.cropper) {
        const canvas = cropperRef.current.cropper.getCroppedCanvas({
          width: 300,
          height: 300,
          minWidth: 100,
          minHeight: 100,
          maxWidth: 1000,
          maxHeight: 1000,
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });
        
        if (canvas) {
          const croppedImage = canvas.toDataURL('image/jpeg', 0.8);
          console.log("Image cropped successfully");
          onImageCrop(croppedImage);
          setCroppedImageUrl(croppedImage);
          setShowCropper(false);
        } else {
          console.error("Failed to create canvas");
          alert("Failed to crop image. Please try again.");
        }
      } else {
        console.error("Cropper reference is not available");
        alert("Error accessing image cropper. Please try again.");
      }
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Error while processing image. Please try again.");
    }
  };

  const cancelCrop = () => {
    setImage('');
    setShowCropper(false);
  };
  
  const removeCroppedImage = () => {
    setCroppedImageUrl(null);
    onImageCrop(null);
  };

  return (
    <div className="image-cropper-container">
      <div className="form-group mb-3">
        <label htmlFor="profileImage" className="form-label">Profile Picture (Optional)</label>
        <input 
          type="file" 
          className="form-control" 
          id="profileImage"
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <div className="form-text">Upload a professional photo for your resume</div>
        
        {croppedImageUrl && (
          <div className="mt-3 text-center">
            <div className="mb-2">
              <img 
                src={croppedImageUrl} 
                alt="Cropped profile" 
                className="rounded-circle border" 
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>
            <button 
              type="button" 
              className="btn btn-sm btn-outline-danger" 
              onClick={removeCroppedImage}
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
      
      {showCropper && (
        <div className="cropper-modal" onClick={(e) => {
          // Close modal when clicking outside of content
          if (e.target.className === 'cropper-modal') {
            cancelCrop();
          }
        }}>
          <div className="cropper-modal-content">
            <div className="cropper-header mb-3">
              <h5>Crop Your Image</h5>
              <p className="text-muted small">Adjust to create a professional headshot</p>
            </div>
            
            <Cropper
              ref={cropperRef}
              src={image}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={true}
              preview=".img-preview"
              viewMode={1}
              dragMode="move"
              scalable={true}
              cropBoxMovable={true}
              cropBoxResizable={true}
              zoomable={true}
            />
            
            <div className="mt-3 img-preview-container">
              <div className="img-preview" style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: '50%' }} />
              <p className="text-muted small mt-2">Preview</p>
            </div>
            
            <div className="d-flex justify-content-between mt-3">
              <button 
                type="button" 
                className="btn btn-secondary btn-lg px-4" 
                onClick={() => cancelCrop()}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-lg px-4" 
                onClick={() => getCropData()}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
