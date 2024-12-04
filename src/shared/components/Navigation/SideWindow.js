import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import './SideWindow.css'

const SideWindow = props => {
    const auth = useContext(AuthContext);

    return (
      <ul className="nav-Side-links">
          <li>
              <NavLink to='/' exact> Home</NavLink>
          </li>
          {auth.isLoggedIn && (
                <li>
                    <NavLink to='/' exact> 모든 유저들</NavLink>
                </li>
            )}
      </ul>
  );

    // return (
    //     <ul className="nav-Side-links">
    //         <li>
    //             <NavLink to='/' exact> 모든 유저들</NavLink>
    //         </li>
    //         {auth.isLoggedIn && (
    //             <li>
    //                 <NavLink to={`/${auth.userId}/places`}> 내장소</NavLink>
    //             </li>
    //         )}
    //         {auth.isLoggedIn && (
    //             <li>
    //                 <NavLink to='/places/new'> 장소 추가</NavLink>
    //             </li>
    //         )}
    //         {!auth.isLoggedIn && (
    //             <li>
    //                 <NavLink to='/auth'> 권한</NavLink>
    //             </li>
    //         )}
    //         {auth.isLoggedIn &&
    //             <li>
    //                 <button onClick={auth.logout}>
    //                     Logout
    //                 </button>
    //             </li>}
    //     </ul>
    // );
};

export default SideWindow;