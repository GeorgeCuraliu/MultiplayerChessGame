import { useEffect } from "react";
import MatchesTable from "../Reusable/Components/MatchesTable";
import styles from "./Journery.module.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Journey = props => {

    const navigate = useNavigate();

    const [data, setData] = useState();

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/matchesLog`, {targetUser: true}, {withCredentials: true})
        .then(response => {
            console.log(response.data.data);
            setData(response.data.data);
        }).catch(err => {
            console.log("critical error at /matchesLog -- Journey");
        });
    }, []);

    const handleClick = (matchID) => {
        if(!matchID){return}
        console.log(`requesting data for ${matchID}`);
        navigate(`/mh/${matchID}`);
    }

    return(
        <div className={styles.container}>
            <p className={styles.title}>Journey</p>
            <MatchesTable data={data} onClick = {handleClick} />
        </div>
    );

}

export default Journey;