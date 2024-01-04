import UserCard from "../Reusable/Components/UserCard";
import styles from "./MatchPage.module.css";
import HOC_ChessBoard from "../Reusable/Components/HOC_ChessBoard";

const MatchPage = () => {

    const MatchBoard = HOC_ChessBoard(false);

    return(
        <div>
            <div className={styles.usercard}>
                <UserCard /> 
                <MatchBoard />
                <UserCard />
            </div>
        </div>
    )
}

export default MatchPage;