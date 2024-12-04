import React, { useRef, useEffect } from "react";

import './Map.css'

const Map = props => {
  const mapRef = useRef();

  const { center, zoom } = props;
  // const [center, zoom] = [props.center, props.zoom];
  // const { center, zoom } = { center: props.center, zoom: props.zoom };


  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker(
      {
        position: center,
        map: map
      }
    );
  }, [center, zoom])

  return (
    <div ref={mapRef}
      className={`map 
      ${props.className} 
      style={props.style}`}
    ></div>
  );
}
export default Map;




// /**
//  * 설명:
//  * 1. useRef()함수로 참조변수(inputRef) 생성
//  * 2. 참조변수(inputRef)를 input 태그의 ref 속성에 대입하여 input 태그의 DOM 요소에 직접 접근을 가능하게 함
//  * 3. [입력 필드에 포커스] 버튼 Click 시, focusInput 함수 실행
//  * 4. inputRef.current.focus(); 함수로 input 태그에 포커싱
//  * 
//  * 동작 : [입력 필드에 포커스]라는 버튼을 눌렀는데, 
//  * [여기에 입력] 이라는 text 필드에 커서(포커스)가 생기도록함
//  */

// import React, { useRef } from 'react';

// const FocusInput = () => {
//   // useRef를 사용하여 inputRef라는 변수를 생성합니다.
//   const inputRef = useRef();

//   const focusInput = () => {
//     // inputRef.current는 해당 input 요소를 참조합니다.
//     // focus() 메서드를 호출하여 입력 필드에 포커스를 줍니다.
//     inputRef.current.focus();
//   };

//   return (
//     <div>
//       {/* input 요소에 ref 속성을 설정하여 inputRef와 연결합니다. */}
//       <input ref={inputRef} type="text" placeholder="여기에 입력" />
//       <button onClick={focusInput}>입력 필드에 포커스</button>
//     </div>
//   );
// };

// export default FocusInput;
