
 var MiningMinistry      = require('MiningMinistry');
 var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    /**
     * GO UPGRADE CONTROLLER
     * Handles controller room upgrading
     * TODO ->
     * */
    goUpgradeController: function(creepName, mainRoomName) {
        //console.log("ENTREE GOUPGRADECONTROLLER "+creepName);
        let creep             = Game.creeps[creepName];
        let sources           = creep.room.find(FIND_SOURCES);
        if (creep.room.controller) {
            if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }
            if (creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else {
                if (creep.room.name == mainRoomName) {
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
                else {
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
        }
    },

    /**
     * REFILL EXTENSIONS
     **/
    refillExtensions: function(creepName, creepRoom, roomEnergy, maxRoomEnergy) {
        console.log("ENTREE REFILL EXTENSIONS ->"+creepName+" "+creepRoom);
        let creep                    = Game.creeps[creepName];
        let creepPosition            = { x:creep.pos.x, y:creep.pos.y };
        let extTemp                  = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        let extensionInfo            = {};
        var myExtension              = "";
        let extensions               = [];
        for (extension of extTemp) {
            extensions.push({x:extension.pos.x, y:extension.pos.y, id:extension.id, energy:extension.energy, energyMax:extension.energyCapacity});
        }
        extTemp = [];
        // Looking for an empty extension
        for (let i = 0, l = extensions.length; i < l; i++) {
            if (extensions[i].energy < extensions[i].energyMax) {
                extensionInfo = { id:extensions[i].id, x:extensions[i].x, y:extensions[i].y };
                myExtension   = Game.getObjectById(extensionInfo.id);  
            }
        }
      
        // Transferring energy to extension
        if (creep.transfer(myExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myExtension);
        }
        else {
            if (creep.store.getUsedCapacity() >= 50 && roomEnergy < maxRoomEnergy) {
                this.refillExtensions(creepName, creepRoom);
            }
        }
    },
    
    /**
     * REFILL TOWERS
     **/
    refillTowers: function(creepName, towerId) {
        //console.log("ENTREE REFILL TOWERS ->"+creepName);
        let creep                    = Game.creeps[creepName];
        let tower                    = Game.getObjectById(towerId);
        let towerEnergy              = tower.energy;
        let towerMaxEnergy           = 1000;
        // Transferring energy to extension
        if (creep.store.getUsedCapacity() > 0) {
            if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tower);
            }
        }
    },
    
    /**
     * BUILD STRUCTURE
     * Create construction site, then build structure on it
     * */
    buildStructure: function(creepName) {
        console.log("ENTREE BUILD STRUCTURE "+creepName);
        let creep           = Game.creeps[creepName];
        let target          = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                creep.memory.building = true;
            }
            
            if (creep.memory.building) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '##7CFC00'}});
                }
                console.log("CONSTRUCTION IN PROGRESS : "+target.progress+"/"+target.progressTotal);
                console.log("DEBUGGING---->"+creep.build(target));
            }
            else {
                let sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: {stroke: '#ffffe0' }});
                }
            }
        }
    },
    
    /**
     * REPAIR ROADS
     **/
    repairRoads: function(towers) {
        for (let i = 0, l = towers.length; i < l; i++) {
            let damagedStructure = towers[i].pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) && structure.hits < structure.hitsMax  });
            if (damagedStructure) {
                towers[i].repair(damagedStructure);
            }
        }
    }
};
