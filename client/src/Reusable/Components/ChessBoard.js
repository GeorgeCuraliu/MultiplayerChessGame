import { useEffect, useState } from "react";
import styles from "../Styles/chessboard.module.css"
import HOC_Square from "./HOC_Square";

const ChessBoard = (props) => {

    const [squares, setSquares] = useState({});//used to generate the table(no data about the pieces)

    useEffect(() => {
        let temp = {};

        if(props.data.team === "white"){
                for(let j = 8; j >= 1; j--){
                    for(let i = 1; i <= 8; i++){
                        temp[`${String.fromCharCode(96+i)}${j}`] = HOC_Square({i, j});
                    }; 
                };        
        }else if(props.data.team === "black"){
                for(let j = 1; j <= 8; j++){
                    for(let i = 1; i <= 8; i++){
                        temp[`${String.fromCharCode(96+i)}${j}`] = HOC_Square({i, j});
                    }; 
                };
        }
        setSquares({...temp});
    }, [props.data.team]);

    console.log(squares);
    console.log(props.data.checkMove);

    return(
        <div className={styles.chessBoard}>
            {squares && Object.entries(squares).map(([key, Square]) => <Square key={key} piece={props?.data?.localization ? props?.data?.localization[key] : 0} checkMove={props.data.checkMove} team={props.data.team}/>)}
        </div>
    );
}

export default ChessBoard;