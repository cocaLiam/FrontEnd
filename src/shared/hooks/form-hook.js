import { useCallback, useReducer } from "react";
/**
 * 커스텀 훅
 * 중복된 로직의 경우 useXXXXX 타입으로 명명해 사용
 * 해당 커스텀 로직의 경우, UpdatePlace, NewPlace 에서 사용됨
 */

const formReducer = (state, action) => {
  // console.log(state)
  switch (action.type) {
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue; // inputId 가 undefined 인 경우의 for문 패턴은 Skip 한다.
        }
        if (inputId === action.inputId) {
          // dispatch 한 ID 를 업데이트 한다
          formIsValid = formIsValid && action.isValid;
        } else {
          // dispatch 한 ID 를 업데이트 하지 않고
          // 기존의 있는 id 를 가져온다
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        },
        isValid: formIsValid
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    })
  }, []);

  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      inputId: id,
      value: value,
      isValid: isValid,
    })
  }, []);

  /*
   * 밑에 두 함수는 기본적으로 기능이 동일하다.
   * const exam = (a) => { return 1; }
   * const exam = useCallback((a) => { return 1; })
  */
  // userCallback 함수를 쓰지 않으면 NewPlace 내부에 있는 함수들은 호출될떄마다 새로운 함수 인스턴스가 생성된다.
  // 이를 방지 하기 위해 쓰는게 userCallback
  // userCallback(함수,[의존성]) "의존성" 배열이 바뀌지 않는 이상 동일한 함수 인스턴스를 사용한다.
  // [const descriptionInputHandler = useCallback((id, value, isValid) => { }, []);]
  //  -> 빈 배열의 의미 >> 초기 렌더링 시 한 번만 생성 한다는 의미와 동일함. or 상태(props)변화에 의존하지 않음

  return [formState, InputHandler, setFormData];
};