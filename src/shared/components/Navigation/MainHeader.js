import React from "react";

import './MainHeader.css';

const MainHeader = props => {
    return (<header className="main-header">
        {props.children}  {/* 부모 컴포넌트로부터 전달된 children을 렌더링 */}
    </header>);
};

export default MainHeader;