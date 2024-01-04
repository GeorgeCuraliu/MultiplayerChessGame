import ChessBoard from "./ChessBoard";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events
//the class will look like: {constructor:{map(pieces location), selectedPiece}, ?onClick(for a piece), ?onMove()}

const HOC_ChessBoard = (mode) => {
    return () => {
        return(<ChessBoard />)
    }
};

export default HOC_ChessBoard;