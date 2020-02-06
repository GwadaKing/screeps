module.exports = {
    /**
     * CALCULATE DISTANCE
     * Euclidian based
     * */
    calculateDistance: function(x1, x2, y1, y2) {
        return Math.round( Math.sqrt( Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) ) );
    },
     
  
    
    /**
     * GET CELL CONTENT
     * returns structure, creep or terrain
     * */
    getCellContent: function(x, y, roomName) {
        return Game.rooms[roomName].lookAt(x, y)[0].type;
    },
    
    /**
     * GET CELL TYPE       
     * returns wall, swamp or plain
     * */
    getCellType: function(x, y, roomName) {
        const terrain = new Room.Terrain(roomName);
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
    getCreepsCountInRole: function (mainRoomName, upRoomName) {
        let nbCreepsInRole = 0;
        let creepsCount    = { "Spawn1": { "harvester":0, "upgrader":0, "builder":0, "fighter":0, "refiller":0 }, "Spawn2": { "harvester":0, "upgrader":0, "builder":0, "fighter":0, "refiller":0 } }
        for (let i = 0; i < Memory.nbCreeps; i++) {
            let creepName = Object.keys(Game.creeps)[i];
            if (creepName !== undefined) {
                let creep = Game.creeps[creepName];
                let role  = creep.memory.role;
                creep.room.name == mainRoomName ? creepsCount.Spawn1[role]++ : creepsCount.Spawn2[role]++; 
            }
        }
        return creepsCount;
    },
    
    /**
     * GET EXTENSIONS NUMBER
     **/
    getExtensionsNb: function(roomName) {
        return Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
    }
};
