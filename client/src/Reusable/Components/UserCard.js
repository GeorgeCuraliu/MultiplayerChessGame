import styles from "../Styles/usercard.module.css"

const UserCard = (props) => {
    console.log(props)
    return(
        <div className={styles.container}>
            <p>{props.username}</p>
        </div>
    )
}

export default UserCard