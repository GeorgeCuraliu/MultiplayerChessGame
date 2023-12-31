import styles from "./homepage.module.css";
import UserCard from "../Reusable/Components/UserCard";
import { useSelector } from "react-redux";

const HomePage = () => {

    const username = useSelector(state => state.userData.username);
    const points = useSelector(state => state.userData.points);

    return(
        <div className={styles.container}>
            <div className={styles.usercard}>
                <UserCard username={username} points={points}/>
            </div>
        </div>
    )
}

export default HomePage;