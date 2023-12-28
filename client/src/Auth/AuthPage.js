import { useState } from "react";
import styles from "./auth.module.css";
import AuthIcon from "../images/auth_icon.png";
import LoginContainer from "./LoginContainer";
import axios from "axios";
import CreateAcc from "./CreateAcc";
import ErrorContainer from "../ErrorContainer/ErrorContainer";
import { createPortal } from "react-dom";

const AuthPage = () => {

    const [authType, setAuthType] = useState(true);//will decide which of LoginContainer or CreateAccountContainer is displayed
    const [error, setError] = useState();

    const changeAuthMethod = () => {
        setAuthType(val => !val);
        console.log("chnaged auth type");
    }

    const login = (username, password) => {
        console.log(`login with ${username} ${password} to adress ${process.env.REACT_APP_API_BASE_URL}`);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {username, password}, {withCredentials: true})
        .then(res => {
            console.log(res);
        })
    }

    const createAcc = (username, password) => {
        console.log(`creating acc with ${username} ${password} to adress ${process.env.REACT_APP_API_BASE_URL}`);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/createAcc`, {username, password}, {withCredentials: true})
        .then(res => {
            console.log(res);
        }).catch(res => {
            console.log("err");
                setError(res.response?.data.data ? res.response.data.data : "Internal server error");
        })
    }

    const closeErrorPopup = () => {
        setError();
    }

    return (
        <div className={styles.pageContainer}>
            <img alt="" src={AuthIcon} className={styles.authIcon} />
            <div className={styles.inputContainer}>
                {authType ? 
                    <LoginContainer 
                        changeAuthMethod={changeAuthMethod} 
                        login={login}/> : 
                    <CreateAcc 
                    changeAuthMethod={changeAuthMethod} 
                    createAcc={createAcc} />}
                {error && createPortal(<ErrorContainer error={error} close={closeErrorPopup}/>, document.body)}
            </div> 
        </div>
    )
}

export default AuthPage;