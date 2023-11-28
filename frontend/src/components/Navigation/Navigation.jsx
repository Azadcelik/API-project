import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

import { useState,useRef } from 'react';
// import ListOfSpots from '../ListOfSpots/ListOfSpots';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user); //that is how you are getting updated data from combineReducer key
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
    // if (!showMenu) setShowMenu(true);
    setShowMenu(!showMenu);
  };

  const ulClassName = `profile-dropdown ${showMenu ? 'show-menu' : 'hidden'}`;

  
  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
         <ProfileButton 
          user={sessionUser} 
          showMenu={showMenu} 
          setShowMenu={setShowMenu} 
        />
      </li>
    );
  } else {
    sessionLinks = (
<>    
    <div className='login-page'>
     <button onClick={toggleMenu} className='button-navigation'>
        <i className="fa-sharp fa-solid fa-bars"  id='bar'/>
        <i className="fas fa-user-circle" />
        
      </button>
       <ul className={ulClassName} ref={ulRef}>
        <div className='logino'>
          <li> 
            <OpenModalButton 
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
          </div>
        </ul>
    </div>
 </>

    );
  }
  return (
  <div className="nav-container">
    <ul>
      <li>
        <NavLink to="/" className="logo-link">
        <i className="fa-solid fa-house-user" id='peace-logo'></i>
          <span className="logo-text">Peaceful Hommy</span>
        </NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  </div>
  );
}

export default Navigation;