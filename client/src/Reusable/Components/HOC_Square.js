import styles from "../Styles/chessboard.module.css";

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
                        images[{...props.piece}[0] + {...props.piece}[1] + "0"] : 
                        images[props.piece]} 
                    />
        }

        const handleClick = () => {

            //check to see if a its a piece from this player`s set
            //will check just the first letter to be the same(w===w)(b===b)

            console.log({...props.piece}[0])
            console.log({...props.team}[0])
            console.log(props.checkMove)
            console.log({...props.piece}[0].toLowerCase() === {...props.team}[0].toLowerCase())
            if({...props.piece}[0].toLowerCase() === {...props.team}[0].toLowerCase()){
                props.checkMove(location);
            }
        }

        return(
            <div onClick={handleClick} className={`${styles.square} ${(data.i+data.j)%2 !== 0 ? "": styles.odd}`}>
                {piece}
            </div>
        )
    }

}

export default HOC_Square;