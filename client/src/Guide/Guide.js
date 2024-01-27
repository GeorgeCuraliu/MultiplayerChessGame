import { useState } from "react";
import styles from "./guide.module.css";

const Guide = () => {

    const [showControl, setShowControl] = useState({
        pawn: false, 
        bishop: false, 
        rook: false, 
        king: false,
        queen: false,
        knight: false
    });

    return(
    <div className={styles.container}>
        <p className={styles.title}>Guide</p>
        <section className={styles.pawn}>
            <div></div>
        </section>
    </div>)
};

export default Guide;