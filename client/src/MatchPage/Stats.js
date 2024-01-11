import React, { useEffect, useState } from "react";
import styles from "./MatchPage.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateTime } from "../store/features/matchStats";

const Stats = () => {

    const dispatch = useDispatch();

    const time = useSelector(state => state.matchStats.time);
    const turn = useSelector(state => state.matchStats.turn);

    const hours = Math.floor((time / 1000) / 60 / 60);
    const minutes = Math.floor((time / 1000) / 60) % 60;

    useEffect(() => {
        setInterval(() => {
            dispatch(updateTime());
        }, 60000);
    }, [])

    console.log(time, turn);

    return(
        <React.Fragment>
            <div className={styles.stat}>TURN : {turn?.toUpperCase()}</div>
            <div className={styles.stat}>{-hours < 10 ? "0" : undefined}{-hours-1}:{-minutes < 10 ? "0" : undefined}{-minutes}</div>
        </React.Fragment>
    )
}

export default Stats;