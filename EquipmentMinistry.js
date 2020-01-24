
 var MiningMinistry      = require('MiningMinistry');
 var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    /**
     * GO UPGRADE CONTROLLER
     * Handles controller room upgrading
     * TODO ->
     * */
    goUpgradeController: function(creepName) {
        //console.log("ENTREE GOUPGRADECONTROLLER "+creepName);
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
     * REFILL EXTENSIONS
     **/
    refillExtensions: function(creepName, roomEnergy, maxRoomEnergy) {
        //console.log("ENTREE REFILL EXTENSIONS ->"+creepName);
        let creep                    = Game.creeps[creepName];
        let creepPosition            = { x:creep.pos.x, y:creep.pos.y };
        let mySpawnPosition          = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
        let distCreep2Spawn          = ExplorationMinistry.calculateDistance(mySpawnPosition.x, creepPosition.x, mySpawnPosition.y, creepPosition.y);
        let extTemp                  = Game.rooms[Object.keys(Game.rooms)].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
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
            creep.moveTo(extensionInfo.x, extensionInfo.y);
        }
        else {
            if (creep.store.getUsedCapacity() >= 50 && roomEnergy < maxRoomEnergy) {
                this.refillExtensions(creepName);
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
        let towerPosition            = { x:tower.pos.x, y:tower.pos.y };
        let creepPosition            = { x:creep.pos.x, y:creep.pos.y };
        let mySpawnPosition          = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
        // Transferring energy to extension
        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(towerPosition.x, towerPosition.y);
        }
        else {
            if (creep.store.getUsedCapacity() >= 50 && towerEnergy < maxTowerEnergy) {
                this.refillTowers(creepName, towerId);
            }
        }
    },
    
    /**
     * BUILD STRUCTURE
     * Create construction site, then build structure on it
     * */
    buildStructure: function(creepName, buildingType, x, y) {
        console.log("ENTREE BUILD STRUCTURE "+creepName+" "+buildingType+" "+x+" "+y);
        let creep           = Game.creeps[creepName];
        let target          = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (!target) {
            console.log("ENTREE BUILD STRUCTURE 1");
            // Then creating the construction site
            if (creep.room.createConstructionSite(x, y, buildingType ) === 0) {
                creep.room.createConstructionSite(x, y, buildingType);
            }
            else console.log("Equipment problem with constructionSite creation, the error is "+creep.room.createConstructionSite(x, y, buildingType));
        }
                // then building phase
        else if (target) {
            console.log("ENTREE BUILD STRUCTURE 2");
            if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                creep.memory.building = true;
            }
            
            if (creep.memory.building) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(x, y, {visualizePathStyle: {stroke: '##7CFC00'}});
                }
                console.log("CONSTRUCTION IN PROGRESS : "+target.progress+"/"+target.progressTotal);
            }
            else {
                console.log("ENTREE BUILD STRUCTURE 3");
                let sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    console.log("ENTREE BUILD STRUCTURE 4");
                    creep.moveTo(sources[0], { visualizePathStyle: {stroke: '#ffffe0' }});
                }
            }
        }
    }
};
