
import { useEffect, useState } from "react";
import styles from "../Styles/chessboard.module.css"

const ChessBoard = (props) => {

    const [squares, setSquares] = useState([]);

    useEffect(() => {
        let temp = [];
        for(let i = 0; i < 64; i++){
            temp.push(<div className={styles.square}></div>);
        };
        setSquares([...temp]);
    }, []);

    console.log(!!squares);

    return(
        <div className={styles.chessBoard}>
            {squares.map(square => square)}
        </div>
    )
}

export default ChessBoard;