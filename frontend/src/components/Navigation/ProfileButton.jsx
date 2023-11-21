// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { NavLink } from 'react-router-dom';

import './Navigation.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (

   <div className='main-container'>    
   <div>
    <NavLink to='/spots/new'>
    Create a New Spot
    </NavLink>

    </div>
    <div className='profile-container'>
      <button onClick={toggleMenu} className='profile-button'>
        <i className="fa-sharp fa-solid fa-bars"  id='bar'/>
        <i className="fas fa-user-circle" />
        
      </button>
   
      <ul className={ulClassName} ref={ulRef}>
        <li>Hello, {user.username}</li>
        <li><hr /></li>
        <li>manage Spots</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout} className='logout-button'>Log Out</button>
        </li>
      </ul>
    </div>
  
    </div>

  );
}

export default ProfileButton;