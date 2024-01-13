import styles from "../Styles/matchesTable.module.css";
import vsicon from "../../images/vsicon.png";

const MatchesTable = (props) => {//props.data  props.onClick

    return(
        <div className={styles.table}>
            {props.data && props.data.map(matchData => {
                return(
                    <div className={styles.row} key={matchData.id}>
                        <p className={styles.username1}>{matchData.username1}</p>
                        <img src={vsicon} />
                        <p className={styles.username2}>{matchData.username2}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default MatchesTable;