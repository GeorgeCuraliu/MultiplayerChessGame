import { useParams } from "react-router-dom";
import styles from './MatchHistory.module.css';
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import UserCard from "../Reusable/Components/UserCard";
import { useSelector } from "react-redux";
import HOC_ChessBoard from "../Reusable/Components/HOC_ChessBoard";

const MatchHistory = () => {

    const initialData = {localization: {
        "a1": "WR1",
        "h1": "WR2",
        "b1": "WK1",
        "g1": "WK2",
        "c1": "WB1",
        "f1": "WB2",
        "d1": "WQ",
        "e1": "WK",
        "a2": "WP1",
        "b2": "WP2",
        "c2": "WP3",
        "d2": "WP4",
        "e2": "WP5",
        "f2": "WP6",
        "g2": "WP7",
        "h2": "WP8",
        "a8": "BR1",
        "h8": "BR2",
        "b8": "BK1",
        "g8": "BK2",
        "c8": "BB1",
        "f8": "BB2",
        "d8": "BQ",
        "e8": "BK",
        "a7": "BP1",
        "b7": "BP2",
        "c7": "BP3",
        "d7": "BP4",
        "e7": "BP5",
        "f7": "BP6",
        "g7": "BP7",
        "h7": "BP8"
    },
        team: "white"
    };

    const username = useSelector(state => state.userData.username)
    const matchID = useParams().matchID;
    const MH = useRef();
    const [currentData, setCurrentData] = useState(initialData);
    const index = useRef(0);

    console.log(currentData);
    
    const MatchBoard = HOC_ChessBoard("passive", currentData);
    

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/getMatchHistory`, {matchID}, {withCredentials: true})
        .then(response => {
            setCurrentData(val => {
                let temp = response.data;
                temp.matchData.team = temp.matchData.username1 === username ? "white" : "black"; 
                console.log(temp);
                return {
                    ...initialData,
                    opponent: {
                        matchID: temp.matchData.id,
                        username: temp.matchData.username1 === username ? temp.matchData.username2: temp.matchData.username1
                    },
                    team: temp.matchData.team
                }
            });
            MH.current = response.data.matchHistory;
        }).catch(err => {
            console.log("critical error at /matchesLog -- Journey");
        });
        
    }, []);

    const moveBack = () => {
        console.log("move backward");
        if(index.current > 0){
            setCurrentData(data => {
                let temp = {...data};
                index.current--;
                const piece = temp.localization[MH.current[index.current].movedTo];
                if(MH.current[index.current].attackedPiece){
                    temp.localization[MH.current[index.current].movedTo] = MH.current[index.current].attackedPiece;
                }else{
                    delete temp.localization[MH.current[index.current].movedTo];
                }
                temp.localization[MH.current[index.current].movedFrom] = piece;
                return temp;
            })
        }
    }

    const moveForward = () => {
        console.log("move forward");
        console.log(MH.current)
        if(MH.current.length > index.current){
            setCurrentData(data => {
                let temp = {...data};
                const piece = temp.localization[MH.current[index.current].movedFrom];
                delete temp.localization[MH.current[index.current].movedFrom];
                temp.localization[MH.current[index.current].movedTo] = piece;
                index.current++;
                return temp;
            });
        }
    }


    

    return(
        <div className={styles.container} >
            <div className={styles.userCardContainer}>
                <UserCard username={username}/>
                {MatchBoard && <MatchBoard updatedData = {currentData}/>}
                <div className={styles.statsContainer}>
                    <button className={`${styles.move} ${styles.moveBack}`} onClick={moveBack}>&#8678;</button>
                    <p className={styles.index}>{index.current}</p>
                    <button className={`${styles.move} ${styles.moveForward}`} onClick={moveForward}>&#8680;</button>
                </div>
            </div>
        </div>
    )

}

export default MatchHistory;