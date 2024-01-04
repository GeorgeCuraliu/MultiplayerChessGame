import ChessBoard from "./ChessBoard";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events
//the class will look like: {constructor:{map(pieces location), selectedPiece}, ?onClick(for a piece), ?onMove()}

const WebSocket = window.WebSocket;
const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/match`);

const HOC_ChessBoard = (mode) => {

    if(mode === "active"){//for active matchmaking and logic processing
        
        websocket.addEventListener('open', () => {
            websocket.send(JSON.stringify({ type: 'auth' }));
        });
        websocket.onmessage = message => {
            const data = JSON.parse(message.data);
            if(data.type = "set"){//will set the initial value for the pieces location

            }
        };

    }

    return () => {
        return(<ChessBoard />)
    }
};

export default HOC_ChessBoard;