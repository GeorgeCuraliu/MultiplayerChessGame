const movesSim = {//location will reprezent the target piece
    pawn : (matrix, location, color) => {

    }
}

const gameLogic = {
    checkMove: (data, targetLocation) => {

        let matrix=[];
        for(let i = 0; i < 8; i++){
            matrix[i] = new Array(8);
            for(let j = 0; j < 8; j++){
                matrix[i][j] = false;
            }
        }

        Object.entries(data.dataValues).forEach(([piece, location]) => {
            if(piece.length <= 3 && piece !== "id" && location){

                const x = location.charCodeAt(0,1) - 96;
                const y = location.substring(1);
                matrix[y-1][x-1] = piece;

            };
        });
        console.log(matrix);

        const target = [targetLocation.charCodeAt(0,1) - 96, targetLocation.substring(1)];//[x,y] -- location
        const targetPiece = matrix[target[0]][target[1]]; 
        console.log(targetPiece);
        
        if(targetPiece.length === 2){
            const color = targetPiece.slice(0, 1) === "B" ? "black" : "white";
            const type = target.slice(1, 2) === "Q" ? "queen" : "king";

            movesSim[type](matrix, target);

        }


    }
}

module.exports = gameLogic;