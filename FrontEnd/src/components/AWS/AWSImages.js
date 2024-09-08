import React, { useState, useRef } from 'react';
import AWS from 'aws-sdk';

const UploadImageToS3WithNativeSdk = ({ childToParent }) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const fileInputRef = useRef(null); //this refers to hidden input

  const S3_BUCKET = 'mybucketlists123';
  const REGION = 'us-west-2';

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_API_KEY_PRIMARY,
    secretAccessKey: process.env.REACT_APP_API_KEY_SECRET
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setShowImage(true);

    //sends URL to parent!!!!
    childToParent(`https://mybucketlists123.s3.us-west-2.amazonaws.com/${file?.name}`);

    // uploads this to s3
    uploadFile(file);
  };

  const uploadFile = (file) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name
    };

    myBucket.putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  // this does the SVG handle event
  const handlePhotoIconClick = () => {
    fileInputRef.current.click(); 
  };

  return (
    <div>
 
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />

      {/* SVG icon does the function*/}
      <svg
        id="photo-icon"
        onClick={handlePhotoIconClick}
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        fill="currentColor"
        className="bi bi-image"
        viewBox="0 0 16 16"
        style={{ cursor: 'pointer' }} 
      >
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
      </svg>

    </div>
  );
};

export default UploadImageToS3WithNativeSdk;
