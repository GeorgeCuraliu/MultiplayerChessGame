import ChessBoard from "./ChessBoard";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events
//the class will look like: {constructor:{map(pieces location), selectedPiece}, ?onClick(for a piece), ?onMove()}

const HOC_ChessBoard = (mode) => {//

    if(mode === "active"){
        const WebSocket = window.WebSocket;
        const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/match`);
        
    }

    return () => {
        return(<ChessBoard />)
    }
};

export default HOC_ChessBoard;