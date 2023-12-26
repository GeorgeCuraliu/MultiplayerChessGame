import style from "./error.module.css"

const ErrorContainer =(props) => {
    return(
        <div className={style.container}>
            <p className={style.exclamation}>!</p>
            <p className={style.error}>{props.error}</p>
            <p onClick={props.close} className={style.close}>X</p>
        </div>
    )
}

export default ErrorContainer;