import { useEffect, useState } from "react";
import styles from "../Styles/chessboard.module.css"

const ChessBoard = (props) => {

    const [squares, setSquares] = useState({});//used to generate the table(no data about the pieces)
    const [sqData, setSqData] = useState({});

    useEffect(() => {
        let temp = {};
        for(let i = 1; i <= 8; i++){
            for(let j = 1; j <= 8; j++){
                temp[`${String.fromCharCode(96+i)}${j}`] = <div className={`${styles.square} ${(i+j)%2 !== 0 ? "": styles.odd}`}></div>;
            }  
        };
        setSquares({...temp});
    }, []);

    console.log(squares);

    return(
        <div className={styles.chessBoard}>
            {Object.values(squares).map(square => square)}
        </div>
    );
}

export default ChessBoard;