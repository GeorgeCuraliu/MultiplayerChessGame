import { useState } from "react";
import styles from "./auth.module.css";
import AuthIcon from "../images/auth_icon.png";
import LoginContainer from "./LoginContainer";


const AuthPage = () => {

    const [authType, setAuthType] = useState(true);//will decide which of LoginContainer or CreateAccountContainer is displayed

    return (
        <div className={styles.pageContainer}>
            <img src={AuthIcon} className={styles.authIcon} />
            <div className={styles.inputContainer}>
                {authType ? <LoginContainer /> : undefined}
            </div> 
        </div>
    )
}

export default AuthPage;