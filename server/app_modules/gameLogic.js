const gameLogic = {
    checkMove: (data, targetLocation) => {

        let target = [targetLocation.charCodeAt(0,1) - 96, targetLocation.substring(1)];//[x,y]

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

            }
        });
        console.log(matrix);

        

    }
}

module.exports = gameLogic;