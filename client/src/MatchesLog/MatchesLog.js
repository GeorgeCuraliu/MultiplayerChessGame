import { useEffect, useState } from "react";
import styles from "./MatchesLog.module.css";
import axios from "axios";
import MatchesTable from "../Reusable/Components/MatchesTable";

const MatchesLog = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/matchesLog`, {targetUser: false}, {withCredentials: true})
        .then(response => {
            console.log(response.data.data);
            setData(response.data.data);
        })
    }, []);

    return(
        <div className={styles.container}>
            <p className={styles.title} >Matches log</p>
            <MatchesTable data={data} />
        </div>
    )
}

export default MatchesLog;