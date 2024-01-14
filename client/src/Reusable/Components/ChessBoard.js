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
    }, [props?.data?.team]);

    console.log(squares);
    console.log("fin props");
    console.log(props.data);
    console.log("fin props");

    return(
        <div className={styles.chessBoard}> 
            {squares && Object.entries(squares).map(([key, Square]) => {

                let possMove = false;
                if(props.data.moves){
                    props.data.moves.forEach(arr => {
                        if(arr[0] === Number(key.slice(1,2))-1 && arr[1] === key.charCodeAt(0,1)-96-1){
                            console.log("nice");
                            possMove = true;
                        }
                    });
                }

                let possAttack = false;
                if(props.data.attacks){
                    props.data.attacks.forEach(arr => {
                        if(arr[0] === Number(key.slice(1,2))-1 && arr[1] === key.charCodeAt(0,1)-96-1){
                            console.log("nice");
                            possAttack = true;
                        }
                    });
                }

                return <Square 
                    key={key} 
                    piece={props?.data?.localization ? props?.data?.localization[key] : 0} 
                    checkMove={props.data.checkMove} 
                    move={props.data.move}
                    team={props.data.team}
                    turn={props.data.turn}
                    possMove={possMove}
                    possAttack={possAttack}
                    />
                })   
            }
        </div>
    );
}

export default ChessBoard;