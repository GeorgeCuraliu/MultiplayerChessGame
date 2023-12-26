import React from "react";
import { useRef, useState } from "react";
import style from "./auth.module.css";

const CreateAcc = (props) => {

    const [usernameError, setUsernameError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [password1Error, setPassword1Error] = useState();
    const username = useRef();
    const password = useRef();
    const password1 = useRef();
    
    const handleLogin = (e) => {
        e.preventDefault();
        if(!username.current.value){
            setUsernameError("Invalid username");
        }else if(!password.current.value){
            setUsernameError();
            setPasswordError("Invalid password");
        }else if(password.current.value !== password1.current.value){
            setPasswordError();
            setUsernameError();
            setPassword1Error("Passwords do not match");
        }else{
            setPasswordError();
            setUsernameError();
            setPassword1Error();
            props.createAcc(username.current.value, password.current.value);
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
            <label className={style.label}>
                <input 
                    className={style.input} 
                    type="text" 
                    placeholder="&nbsp;" 
                    ref={password1}/>
                <span className={style.placeholder}>Repeat passwrod</span>
                {password1Error && <span className={style.error_message}>{password1Error}</span>}
            </label>
            <button 
                type="confirm" 
                className={style.authButton}>CONFIRM</button>
            <button 
                className={`${style.changeAuth} ${style.authButton}`} 
                onClick={props.changeAuthMethod}>OR LOGIN</button>
        </form>
    )
}

export default CreateAcc;