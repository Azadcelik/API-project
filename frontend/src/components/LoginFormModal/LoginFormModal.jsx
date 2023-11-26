// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal} from '../../context/Modal';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

function LoginFormModal() {

  const {closeModal} = useModal()
  
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  
  const isButtonDisabled = credential.length < 4 || password.length < 6;

  


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then( () => {
        closeModal()
        navigate('/')
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };


  // this is not working ask 
  // if (Object.values(errors).length > 0) {    //this help to show multiple errors but did not understand hundred percent why
  //   return; 
  // }


  const demoUserFunction = () => { 

    const credential = 'demo@user.io'
    const password = 'password'
    setErrors({}); 
    dispatch(sessionActions.login({ credential, password }))
    .then(() => {
      closeModal();
      navigate('/')
    })
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
};


  
  
  return (
    <div className='login-container' >
      
      <h1>Log In</h1>
      {errors.credential && (
          <p className='login-err'>* {errors.credential}</p>
        )}
      <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        </div>

        <div className="input-group">
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        </div>
      
         <div className="input-group">
        <button type="submit" disabled={isButtonDisabled} className='button-login'>Log In</button>
        </div>
        <button className='demo-user' onClick={demoUserFunction}>Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;