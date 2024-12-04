import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import './Input.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:

      return state;
  }
};

const Input = props => {
  // const [enteredValue, setEnteredValue] = useState('');
  // const [isValue, sesValid] = useState(false); <-- 이렇게 해도 되지만
  // 상태가 더 복잡하거나 상호 연관된 상태 일 때 useReducer 을 쓰면 코드가 더 간단해진다.

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',  // props.value 이 Empty면 ''
    isTouched: false,
    isValid: props.initialValid || false // props.value 이 Empty면 false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput])

  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  }

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  
  return (
    <div className={`form-control ${!inputState.isValid &&
      inputState.isTouched &&
      'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {
        !inputState.isValid &&
        inputState.isTouched &&
        <p>{props.errorText}</p>
      }
    </div >
  );
}

export default Input;


// // useReducer 간단 예시
// /** useReducer( dispatch때 호출할 함수, 호출할 함수의 첫번째 인자(accumulateState)의 초기 값 )
//  * 
//  * 1. dispatch 로 reducer 함수를 호출 하고 
//  * 2. dispatch 에 들어가는 인자값은 reducer 의 action 에 으로 전달된다.
//  * 3. reducer 의 첫번째 인자인 accumulateState 에는 초기값이 들어 있고, 함수가 호출됨에 따라 값이 누적된다.
//  * 4. reducer 함수가 return 하는 값들은 useReducer 함수에서 return 됬던 stateResult에 업데이트된다.
//  * 5. useReducer 에서 return 됬던 stateResult 값이 이전 값과 다르면 리렌더링 한다.
//  */

// import React, { useReducer } from 'react';

// const initialState = { count: 0 };

// function reducer(accumulateState, action) {
//   switch (action.type) {
//     case 'increment':
//       return { count: accumulateState.count + 1 };
//     case 'decrement':
//       return { count: accumulateState.count - 1 };
//     default:
//       throw new Error();
//   }
// }

// const Counter = () => {
//   const [stateResult, dispatch] = useReducer(reducer, initialState);

//   return (
//     <div>
//       <p>Count: {stateResult.count}</p>
//       <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
//       <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
//     </div>
//   );
// };

// export default Counter;







// // useEffect 간단 예시
// // /** useEffect( 의존성변수가 바뀔 떄마다 호출할 함수, 의존성 변수 )
// //  *  동작 : 버튼을 누를 떄마다 "로딩 중..." 을 띄우고 count를 up 시키면서 'https://jsonplaceholder.typicode.com/posts/1' 링크 data를 읽어온다.
// //  * 
// //  * 1. useEffect함수의 의존성변수로 count 를 지정
// //  * 2. "로딩 중..." 출력
// //  * 3. 버튼 클릭스 count 하나씩 Up 시킴
// //  * 4. count 가 의존 변수이므로 useEffect에 등록한 함수 호출
// //  * 5. 'https://jsonplaceholder.typicode.com/posts/1' 읽어서 화면에 출력 + Up된 count 출력
// //  */

// import React, { useState, useEffect } from 'react';

// const DataFetcher = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [count, setCount] = useState(0); // 버튼 클릭 시 변경되는 상태 변수

//   useEffect(() => {
//     // JSONPlaceholder API에서 데이터를 가져옵니다.
//     setLoading(true); // 새로운 요청을 시작할 때 로딩 상태로 설정
//     fetch('https://jsonplaceholder.typicode.com/posts/1')
//       .then(response => response.json())
//       .then(data => {
//         setData(data);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
//         setLoading(false);
//       });
//   }, [count]); // count가 변경될 때마다 실행

//   if (loading) {
//     return <p>로딩 중...</p>;
//   }

//   return (
//     <div>
//       <h1>데이터 가져오기 예제</h1>
//       {data ? <pre>{JSON.stringify(data, 2)}</pre> : <p>데이터가 없습니다.</p>}
//       <button onClick={() => setCount(count + 1)}>데이터 다시 가져오기</button>
//       <p1> Count : {count}</p1>
//     </div>
//   );
// };

// export default DataFetcher;
