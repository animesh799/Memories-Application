import React, { useEffect, useRef, useState } from "react";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const imagePickerref = useRef();
  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState();
  const [fileIsvalid, setFileisValid] = useState();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImagePreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const imagePickHandler = () => {
    imagePickerref.current.click(); //method to open up the file picker
  };

  const imageFileChangeHandler = (event) => {
    let pickedFile;
    let isValid = fileIsvalid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      isValid = true;
      setFileisValid(true);
    } else {
      setFileisValid(false);
      isValid = false;
    }
    props.onInput(props.id, pickedFile, isValid);
  };

  return (
    <div className="form-control">
      <input
        type="file"
        accept=".jpeg,.jpg,.png"
        id={props.id}
        style={{ display: "none" }}
        ref={imagePickerref}
        onChange={imageFileChangeHandler}
      ></input>
      <div className={`image-upload ${props.center && "center"} `}>
        <div className="image-upload__preview">
          {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview"></img>}
          {!imagePreviewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={imagePickHandler}>
          Pick an Image
        </Button>
      </div>
      {!fileIsvalid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
