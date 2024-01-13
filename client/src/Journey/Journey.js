import { useEffect } from "react";
import MatchesTable from "../Reusable/Components/MatchesTable";
import styles from "./Journery.module.css";
import axios from "axios";
import { useState } from "react";

const Journey = props => {

    const [data, setData] = useState();

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/matchesLog`, {targetUser: true}, {withCredentials: true})
        .then(response => {
            console.log(response);
            setData(response);
        }).catch(err => {
            console.log("critical error at /matchesLog -- Journey");
        });
    }, []);

    const handleClick = (matchID) => {
        console.log(`requesting data for ${matchID}`);
    }

    return(
        <div className={styles.container}>
            <div className={styles.title}>
                <MatchesTable data={data}  onCick = {handleClick} />
            </div>
        </div>
    );

}

export default Journey;