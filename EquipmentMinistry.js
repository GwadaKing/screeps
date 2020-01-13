var MiningMinistry      = require('MiningMinistry');
 var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    /**
     * GO UPGRADE CONTROLLER
     * Handles controller room upgrading
     * TODO ->
     * */
    goUpgradeController: function(creepName) {
        console.log("ENTREE GOUPGRADECONTROLLER");
        let creep             = Game.creeps[creepName];
        let myRoom            = Game.rooms[Object.keys(Game.rooms)];
        let creepPosition     = { x:creep.pos.x, y:creep.pos.y };
        let sources           = creep.room.find(FIND_SOURCES);
        let source1Position   = { x:sources[0].pos.x, y:sources[0].pos.y };
        let source2Position   = { x:sources[1].pos.x, y:sources[1].pos.y };
        let RCLPosition       = { x:myRoom.controller.pos.x, y:myRoom.controller.pos.y };
        let distCreep2RCL     = ExplorationMinistry.calculateDistance(RCLPosition.x, creepPosition.x, RCLPosition.y, creepPosition.y);
        let distRCL2Source    = { s1:ExplorationMinistry.calculateDistance(RCLPosition.x, source1Position.x, RCLPosition.y, source1Position.y), 
                                  s2:ExplorationMinistry.calculateDistance(RCLPosition.x, source2Position.x, RCLPosition.y, source2Position.y) };
        let closestSource2RCL = 0;
        // Defining closest energy source from controller  
        distRCL2Source.s1 >= distRCL2Source.s2 ? closestSource2RCL = 1 : closestSource2RCL = 0; 
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
                if(creep.harvest(sources[closestSource2RCL]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[closestSource2RCL], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    },
    
    /**
     * BUILD EXTENSION
     * Create construction site, then build extension on it
     * TODO -> Rendre la fonction dynamique pour qu'elle serve à n'importe quelle construction
     * */
    buildExtension: function(creepName) {
         console.log("ENTREE BUILDCONTAINER "+creepName);
        let creep                     = Game.creeps[creepName];
        let mySpawnPosition           = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
        let constructionsSitePosition = ExplorationMinistry.findFreeCells(mySpawnPosition.x, mySpawnPosition.y);
        
        // First the construction site...
        if (creep.room.createConstructionSite(mySpawnPosition.x, mySpawnPosition.y, STRUCTURE_EXTENSION ) == 0) {
            creep.room.createConstructionSite(mySpawnPosition.x, mySpawnPosition.y, STRUCTURE_EXTENSION);
        }
        else console.log("Equipment problem while creating construction site for extension, the error code is "+creep.room.createConstructionSite(mySpawnPosition.x, mySpawnPosition.y, STRUCTURE_EXTENSION ));
        let target       = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // then building phase
        if (target !== null) {
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#155926'}});
                }
                console.log("CONSTRUCTION IN PROGRESS : "+target.progress+"/"+target.progressTotal);
            }
        }
        else {
            creep.memory.role     = "harvester";
            creep.memory.building = false;
        }
    }
};
