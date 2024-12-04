import React from "react";
import ReactDOM from 'react-dom';
import { CSSTransition } from "react-transition-group";

import Backdrop from './Backdrop'
import './Modal.css'

const ModalOverlay = props => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : (event) => { event.preventDefault() }
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = props => {
  return (
    <React.Fragment>
      {props.show ? <Backdrop onClick={props.onCancel} /> : null}
      {/* {props.show && <Backdrop onClick={props.onCancel} />} <-- 어두운 배경 클릭시 Cancel 핸들러 동작*/}

      <CSSTransition
        in={props.show} // CSSTransition 의 in props 가 true 면 mount 하고 false면 unmount 함
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

/*
{drawerIsOpen ? <Backdrop onClick={closeDrawer} /> : null}
둘의 형상은 동일함 // if drawerIsOpen is True : <Backdrop onClick={closeDrawer} /> 이므로
{drawerIsOpen && <Backdrop onClick={closeDrawer} />}
*/
export default Modal;