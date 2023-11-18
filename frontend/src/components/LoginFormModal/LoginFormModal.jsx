// frontend/src/components/LoginFormModal/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal} from '../../context/Modal';
import './LoginForm.css';



function LoginFormModal() {

  const {closeModal} = useModal()
  
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  

  
  const isButtonDisabled = credential.length < 4 || password.length < 6;

  


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then( () => closeModal())
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
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
         <div className="input-group">
        <button type="submit" disabled={isButtonDisabled}>Log In</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;