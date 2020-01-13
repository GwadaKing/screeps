module.exports = {
    /**
     * CALCULATE DISTANCE
     * 
     * */
    calculateDistance: function(x1, x2, y1, y2) {
        return Math.round( Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) ) );
    },
     
    /**
     * FIND FREE CELLS
     * 
     * */
    findFreeCells: function(x, y) {
        let extensionCells = [{x:x-2, y:y+2}, {x:x-1, y:y+2}, {x:x, y:y+2}, {x:x+1, y:y+2}, {x:x+2, y:y+2}];
        
    }

};
