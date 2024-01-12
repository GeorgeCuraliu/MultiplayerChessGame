import styles from "./homepage.module.css";
import UserCard from "../Reusable/Components/UserCard";
import { useState } from "react";
import { useSelector } from "react-redux";
import findMatchIcon from "../images/find_match.png";
import trophie from "../images/trophie0.png";
import traveler from "../images/traveler.png";
import logs from "../images/logs.png";
import guide from "../images/guide.png";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setOpponent } from "../store/features/opponentData";

const HomePage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const WebSocket = window.WebSocket;
    const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/matchQuene`);

    const username = useSelector(state => state.userData.username);
    const points = useSelector(state => state.userData.points);
    const inMatch = useSelector(state => state.userData.inMatch);

    const [searchStyle, setSearchStyle] = useState();

    const findMatch = () => {
        setSearchStyle(val => {
            websocket.send(!!!val);
            return val ? undefined : {filter: 'brightness(50%)'}
        });
    };

    websocket.onmessage = (event) => {
        if(typeof(event.data) === "string"){
            console.log(JSON.parse(event.data)); 
            const data = JSON.parse(event.data);
            if(data.username){
                dispatch(setOpponent(data));
                navigate("/match");
            }
        }
    }

    return(
        <div className={styles.container}>
            <div className={styles.usercard}>
                <UserCard username={username} points={points}/>
            </div>
            <section style={searchStyle} className={styles.container1} onClick={findMatch}>
                <img className={styles.findMatchIcon} alt="findMatchIcon" src={findMatchIcon} />
                <p className={styles.findMatchText} >{inMatch ? "CONTINUE MATCH" : "FIND AN OPPONENT"}</p>
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
                <div className={styles.buttonContainer} onClick={() => {navigate("/matchesLog")}} >
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