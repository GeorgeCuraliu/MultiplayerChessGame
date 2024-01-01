import styles from "./homepage.module.css";
import UserCard from "../Reusable/Components/UserCard";
import { useSelector } from "react-redux";
import findMatchIcon from "../images/find_match.png";
import trophie from "../images/trophie0.png";
import traveler from "../images/traveler.png";
import logs from "../images/logs.png";
import guide from "../images/guide.png";

const HomePage = () => {

    const username = useSelector(state => state.userData.username);
    const points = useSelector(state => state.userData.points);

    return(
        <div className={styles.container}>
            <div className={styles.usercard}>
                <UserCard username={username} points={points}/>
            </div>
            <section className={styles.container1} >
                <img alt="findMatchIcon" src={findMatchIcon} />
                <p className={styles.findMatchText} >FIND AN OPPONENT</p>
            </section>
            <section className={styles.container2}>
                <div className={styles.buttonContainer}>
                    <img className={styles.buttonImage} src={trophie} alt="trophie"/>
                    <p className={styles.buttonText}>Trophies</p>
                </div>
                <div className={styles.buttonContainer}>
                    <img className={styles.buttonImage} src={traveler} alt="trophie"/>
                    <p className={styles.buttonText}>Journey</p>
                </div>
                <div className={styles.buttonContainer}>
                    <img className={styles.buttonImage} src={logs} alt="trophie"/>
                    <p className={styles.buttonText}>Matches log</p>
                </div>
                <div className={styles.buttonContainer}>
                    <img className={styles.buttonImage} src={guide} alt="trophie"/>
                    <p className={styles.buttonText}>Guide</p>
                </div>
            </section>
        </div>
    )
}

export default HomePage;