import styles from "../Styles/chessboard.module.css";
import { useSelector } from "react-redux";

//pieces
import BB0 from "../../images/pieces/BB0.png";
import BK from "../../images/pieces/BK.png";
import BK0 from "../../images/pieces/BK0.png";
import BP0 from "../../images/pieces/BP0.png";
import BQ from "../../images/pieces/BQ.png";
import BR0 from "../../images/pieces/BR0.png";

import WB0 from "../../images/pieces/WB0.png";
import WK from "../../images/pieces/WK.png";
import WK0 from "../../images/pieces/WK0.png";
import WP0 from "../../images/pieces/WP0.png";
import WQ from "../../images/pieces/WQ.png";
import WR0 from "../../images/pieces/WR0.png";


const HOC_Square = (data) => {

    const images = {BB0, BK, BK0, BP0, BQ, BR0, WB0, WK, WK0, WP0, WQ, WR0};
    const location = `${String.fromCharCode(96+data.i)}${data.j}`

    return (props) => {
        let piece;
        
        if(props.piece){
            piece = <img className={styles.piece}
                    alt={props.piece}
                    src={props.piece.length === 3 ? 
                        images[props.piece.slice(0,2) + "0"] : 
                        images[props.piece]} 
                    />
        }

        const handleClick = () => {
            if(!(props.turn === props.team)){return}
            if(props?.piece?.slice(0,1).toLowerCase() === props?.team?.slice(0,1).toLowerCase()){
                props.checkMove(location);
            }else if(props.possMove || props.possAttack){
                console.log(location)
                props.move(location);
            }
        }
        console.log(props.team)
        return(
            <div onClick={handleClick} className={`${styles.square} ${(data.i+data.j)%2 !== 0 ? "": styles.odd} ${props.possMove ? styles.possMove : ""} ${props.possAttack ? styles.possAttack : ""}`}>
                {piece}
            </div>
        )
    }

}

export default HOC_Square;