import styles from "../Styles/matchesTable.module.css";

const MatchesTable = (props) => {

    return(
        <div className={styles.table}>
            {props.data && props.data.map(matchData => {
                return(
                    <div className={styles.row}>
                        <p>{matchData.player1}</p>
                        <p>{matchData.player2}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default MatchesTable;