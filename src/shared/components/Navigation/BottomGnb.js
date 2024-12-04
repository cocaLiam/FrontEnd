import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";

import './BottomGnb.css'

const BottomGnb = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn ? (
        <li>
          <NavLink to='/' exact> Home</NavLink>
        </li>
      ) : (
        <li>
          <NavLink to='/auth' exact> Home</NavLink>
        </li>
      )}
      {auth.isLoggedIn ? (
        <li>
          <NavLink to={`/${auth.userId}/places`}> 개인루틴</NavLink>
        </li>
      ) : (
        <li>
          <NavLink to='/auth' exact> 개인루틴</NavLink>
        </li>
      )}
      {auth.isLoggedIn ? (
        <li>
          <NavLink to='/places/new'> My</NavLink>
        </li>
      ) : (
        <li>
          <NavLink to='/auth' exact> My</NavLink>
        </li>
      )}
      {auth.isLoggedIn ? (
        <li>
          <NavLink to='/auth'> Debug</NavLink>
        </li>
      ) : (
        <li>
          <NavLink to='/auth' exact> Debug</NavLink>
        </li>
      )}
    </ul>
  );
};

export default BottomGnb;
