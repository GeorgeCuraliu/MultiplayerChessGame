import { useEffect, useState } from "react";
import styles from "../Styles/chessboard.module.css"
import HOC_Square from "./HOC_Square";


Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if(array === this)
        return true;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}


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

                return <Square 
                    key={key} 
                    piece={props?.data?.localization ? props?.data?.localization[key] : 0} 
                    checkMove={props.data.checkMove} 
                    team={props.data.team}
                    possMove={possMove}
                    />
                })   
            }
        </div>
    );
}

export default ChessBoard;