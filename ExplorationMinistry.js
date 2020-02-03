module.exports = {
    /**
     * CALCULATE DISTANCE
     * Euclidian based
     * */
    calculateDistance: function(x1, x2, y1, y2) {
        return Math.round( Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) ) );
    },
     
    /**
     * FIND FREE CELLS
     * 
     * */
    findFreeCells: function(x1, y1) {
        //console.log("ENREE FIND FREE CELLS ->"+x1+" "+y1);
        /*Memory.extensionCells = [ {x:x1-2, y:y1+2}, {x:x1-1, y:y1+2}, {x:x1, y:y1+2}, {x:x1+1, y:y1+2}, {x:x1+2, y:y1+2},
                                      {x:x1-2, y:y1+4}, {x:x1-1, y:y1+4}, {x:x1, y:y1+4}, {x:x1+1, y:y1+4}, {x:x1+2, y:y1+4},
                                      {x:x1-2, y:y1+6}, {x:x1-1, y:y1+6}, {x:x1, y:y1+6}, {x:x1+1, y:y1+6}, {x:x1+2, y:y1+6},
                                      {x:x1-2, y:y1+8}, {x:x1-1, y:y1+8}, {x:x1, y:y1+8}, {x:x1+1, y:y1+8}, {x:x1+2, y:y1+8},
                                      {x:x1+3, y:y1+2}, {x:x1+3, y:y1+4}, {x:x1+3, y:y1+6}, {x:x1+3, y:y1+8}, {x:x1+4, y:y1+2},
                                      {x:x1+4, y:y1+4}, {x:x1+4, y:y1+6}, {x:x1+4, y:y1+8}, {x:x1+5, y:y1+2}, {x:x1+5, y:y1+4} ];*/
        // This list controls the extensions location choice, relative to spawn location
        let extensionCells = [{x:x1-2, y:y1+2}, {x:x1-1, y:y1+2}, {x:x1, y:y1+2}, {x:x1+1, y:y1+2}, {x:x1+2, y:y1+2},
                              {x:x1-2, y:y1+4}, {x:x1-1, y:y1+4}, {x:x1, y:y1+4}, {x:x1+1, y:y1+4}, {x:x1+2, y:y1+4},
                              {x:x1-2, y:y1+6}, {x:x1-1, y:y1+6}, {x:x1, y:y1+6}, {x:x1+1, y:y1+6}, {x:x1+2, y:y1+6},
                              {x:x1-2, y:y1+8}, {x:x1-1, y:y1+8}, {x:x1, y:y1+8}, {x:x1+1, y:y1+8}, {x:x1+2, y:y1+8},
                              {x:x1+3, y:y1+2}, {x:x1+3, y:y1+4}, {x:x1+3, y:y1+6}, {x:x1+3, y:y1+8}, {x:x1+4, y:y1+2},
                              {x:x1+4, y:y1+4}, {x:x1+4, y:y1+6}, {x:x1+4, y:y1+8}, {x:x1+5, y:y1+2}, {x:x1+5, y:y1+4} ];
        for (let i = 0, l = extensionCells.length; i < l; i++) {
            let cellType   = this.getCellType(extensionCells[i].x, extensionCells[i].y );
            let cellContent = this.getCellContent(extensionCells[i].x, extensionCells[i].y );
            if (cellContent == "constructionSite") {
                let result = { x:extensionCells[i].x, y:extensionCells[i].y };
                return result;
            }
        }
        return false;
    },
    
    /**
     * GET CELL CONTENT
     * returns structure, creep or terrain
     * */
    getCellContent: function(x, y) {
        return Game.rooms["E7S16"].lookAt(x, y)[0].type;
    },
    
    /**
     * GET CELL TYPE       
     * returns wall, swamp or plain
     * */
    getCellType: function(x, y) {
        const terrain = new Room.Terrain("E7S16");
        let cellType = terrain.get(x, y);
        switch (cellType) {
            case 1: return "wall"; break;
            case 2: return "swamp"; break;
            default: return "plain"
        }
    },
    
    /**
     * GET CREEPS COUNT IN A ROLE
     * */
    getCreepsCountInRole: function (creepRole) {
        let nbCreepsInRole = 0;
        for (let i = 0; i < Memory.nbCreeps; i++) {
            let creepName = Object.keys(Game.creeps)[i];
            if (creepName !== undefined) {
                let creep     = Game.creeps[creepName];
                if (creep.memory.role == creepRole) {
                    nbCreepsInRole++;
                }
            }
        }
        return nbCreepsInRole;
    },
    
    /**
     * GET EXTENSIONS NUMBER
     **/
    getExtensionsNb: function() {
        return Game.rooms["E7S16"].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
    }
};
