import UserCard from "../Reusable/Components/UserCard";
import styles from "./MatchPage.module.css";
import HOC_ChessBoard from "../Reusable/Components/HOC_ChessBoard";
import { useSelector } from "react-redux";
import Stats from "./Stats";

const MatchPage = () => {

    const user = useSelector(state => state.userData);
    const opponent = useSelector(state => state.opponentData);
    const winner = useSelector(state => state.matchStats.winner);

    console.log(user);
    console.log(opponent);

    const MatchBoard = HOC_ChessBoard("active");
    
    return(
        <div className={styles.pageContainer}>
            <div className={styles.matchBoard}>
                <UserCard username={opponent.username} points={opponent.points} extra = {winner === "user" ? "WINNER" : undefined} /> 
                <MatchBoard />
                <UserCard username={user.username} points={user.points} extra = {winner === "opponent" ? "WINNER" : undefined} />
            </div>
            <div className={styles.stats}>
                <Stats />
            </div>
        </div>
    );
}

export default MatchPage;