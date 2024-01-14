import { useParams } from "react-router-dom";
import styles from './MatchHistory.module.css';
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "../Reusable/Components/UserCard";
import { useSelector } from "react-redux";
import HOC_ChessBoard from "../Reusable/Components/ChessBoard";

const MatchHistory = () => {

    const username = useSelector(state => state.userData.username)
    const matchID = useParams().matchID;
    const [data, setData] = useState({});
    
    const MatchBoard = HOC_ChessBoard("pasive", data);

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/getMatchHistory`, {matchID}, {withCredentials: true})
        .then(response => {
            setData(val => {
                let temp = response.data;
                temp.matchData.team = temp.matchData.username1 === username ? "white" : "black"; 
                console.log(temp);
                return {
                ...temp
                }
            });
        }).catch(err => {
            console.log("critical error at /matchesLog -- Journey");
        });
        
    }, []);

    return(
        <div className={styles.container} >
            <div className={styles.userCardContainer}>
                <UserCard username={data?.matchData?.username1 === username ? data?.matchData?.username2 : data?.matchData?.username1}/>
                {data && <MatchBoard />}
            </div>
        </div>
    )

}

export default MatchHistory;