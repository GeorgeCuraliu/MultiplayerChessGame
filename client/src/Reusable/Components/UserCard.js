import styles from "../Styles/usercard.module.css";
import ChessPlayer from "../../images/chess_player.png";

const UserCard = (props) => {
    console.log(props);
    const points = props.points ? `-${props.points}` : "";
    return(
        <div className={styles.container}>
            <img className={styles.chessPlayer} alt="chess_player" src={ChessPlayer}/>
            <p className={styles.username} >{props.username}</p>
            {points && <p className={styles?.points} >{points}</p>}
            {props?.extra && <p className={styles.username}>{props.extra}</p>}
        </div>
    )
}

export default UserCard