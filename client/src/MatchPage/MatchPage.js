import UserCard from "../Reusable/Components/UserCard";
import styles from "./MatchPage.module.css";

const MatchPage = () => {

    return(
        <div>
            <div className={styles.usercard}>
                <UserCard /> 
            </div>
        </div>
    )
}

export default MatchPage;