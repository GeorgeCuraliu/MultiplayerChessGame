import styles from "../Styles/matchesTable.module.css";
import vsicon from "../../images/vsicon.png";

const MatchesTable = (props) => {//props.data  props.onClick

    return(
        <div className={styles.table}>
            {props?.data?.map(matchData => {
                return(
                    <div className={styles.row} key={matchData.id} onClick={() => {props?.onClick(matchData.id)}}>
                        <p className={`${styles.username} ${matchData.winner === "white" ? styles.looser : undefined}`}>{matchData.username1}</p>
                        <img src={vsicon} />
                        <p className={`${styles.username} ${matchData.winner === "black" ? styles.looser : undefined}`}>{matchData.username2}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default MatchesTable;