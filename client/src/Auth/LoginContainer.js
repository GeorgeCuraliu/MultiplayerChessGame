import React from "react";
import { useRef, useState } from "react";
import style from "./auth.module.css";

const LoginContainer = (props) => {

    const [usernameError, setUsernameError] = useState();
    const [passwordError, setPasswordError] = useState();
    const username = useRef();
    const password = useRef();
    
    const handleLogin = (e) => {
        e.preventDefault();
        if(!username.current.value){
            setUsernameError("Invalid username");
        }else if(!password.current.value){
            setUsernameError();
            setPasswordError("Invalid password");
        }else{
            setPasswordError();
            setUsernameError();
            props.login(username.current.value, password.current.value);
        }
        
    }

    return(
        <form onSubmit={e => handleLogin(e)} className={style.form}>
            <label className={style.label}>
                <input 
                    className={style.input} 
                    type="text" 
                    placeholder="&nbsp;" 
                    ref={username}/>
                <span className={style.placeholder}>Enter username</span>
                {usernameError && <span className={style.error_message}>{usernameError}</span>}
            </label>
            <label className={style.label}>
                <input 
                    className={style.input} 
                    type="text" 
                    placeholder="&nbsp;" 
                    ref={password}/>
                <span className={style.placeholder}>Enter passwrod</span>
                {passwordError && <span className={style.error_message}>{passwordError}</span>}
            </label>
            <button 
                type="confirm" 
                className={style.authButton}>CONFIRM</button>
            <button 
                className={`${style.changeAuth} ${style.authButton}`} 
                onClick={props.changeAuthMethod}>OR CREATE AN ACCOUNT</button>
        </form>
    )
}

export default LoginContainer;