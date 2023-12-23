import React from "react";
import style from "./auth.module.css";

const LoginContainer = (props) => {
    
    const handleLogin = (e) => {
        e.preventDefault();
        props.login("dwa", "wda");
    }

    return(
        <form onSubmit={e => handleLogin(e)} className={style.form}>
            <input 
                className={style.input} 
                placeholder="username"/>
            <input 
                className={`${style.input} ${style.password0}`} 
                placeholder="password"/>
            <button 
                type="confirm" 
                className={style.authButton}>CONFIRM</button>
            <button 
                className={`${style.changeAuth} ${style.authButton}`} 
                onClick={props.changeAuthMethod}>CREATE AN ACCOUNT</button>
        </form>
    )
}

export default LoginContainer;