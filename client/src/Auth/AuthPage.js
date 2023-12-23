import { useState } from "react";
import styles from "./auth.module.css";
import AuthIcon from "../images/auth_icon.png";
import LoginContainer from "./LoginContainer";


const AuthPage = () => {

    const [authType, setAuthType] = useState(true);//will decide which of LoginContainer or CreateAccountContainer is displayed

    const changeAuthMethod = () => {
        setAuthType(val => !val);
        console.log("chnaged auth type");
    }

    const login = (username, password) => {
        console.log(`login with ${username} ${password}`)
    }

    return (
        <div className={styles.pageContainer}>
            <img src={AuthIcon} className={styles.authIcon} />
            <div className={styles.inputContainer}>
                {authType ? 
                    <LoginContainer 
                    changeAuthMethod={changeAuthMethod} 
                    login={login}/> : 
                    undefined}
            </div> 
        </div>
    )
}

export default AuthPage;