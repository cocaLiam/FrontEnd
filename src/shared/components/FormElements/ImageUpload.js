import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
  const [filePath, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!filePath) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(filePath);
  }, [filePath])

  const pickedHandler = (event) => {
    // console.log(event.target.files);
    // console.log(Object.keys(event.target)); // 이벤트 객체의 프로퍼티 이름들을 배열로 출력
    console.dir(event.target.files);
    // console.dir(event.target); // 이벤트 객체를 트리 구조로 출력
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      /**
       * setState 함수(예: setIsValid)는 상태를 즉시 업데이트하는 것이 아니라, 
       * 상태 업데이트를 예약하는 역할을 하기 때문에, 상태가 즉시 변경되지 않고 
       * 다음 렌더링 사이클에서 변경되므로 "fileIsValid = true;" 이렇게 정의해서 넘김
       */
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`} >
        <div className="image-upload__preview">
        {/* <React.Fragment> */}
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        {/* </React.Fragment> */}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  )
};

export default ImageUpload;

