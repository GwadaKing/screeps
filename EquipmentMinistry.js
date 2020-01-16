/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('EquipmentMinistry');
 * mod.thing == 'a thing'; // true
 */
 var MiningMinistry      = require('MiningMinistry');
 var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    /**
     * GO UPGRADE CONTROLLER
     * Handles controller room upgrading
     * TODO ->
     * */
    goUpgradeController: function(creepName) {
        //console.log("ENTREE GOUPGRADECONTROLLER");
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
    buildExtension: function(creepName, buildingType) {
        console.log("ENTREE BUILD EXTENSION "+creepName);
        let creep                    = Game.creeps[creepName];
        let extTemp                  = Game.rooms[Object.keys(Game.rooms)].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        let mySpawnPosition          = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
        let constructionSitePosition = ExplorationMinistry.findFreeCells(mySpawnPosition.x, mySpawnPosition.y);
        console.log("DEBUGGING CONSTRUCTION SITE =====================================================================> "+ExplorationMinistry.getCellType(constructionSitePosition.x, constructionSitePosition.y));
        // First checking if the cell is occupied by a construction site or a structure
        if (ExplorationMinistry.getCellContent == "") {
            
        }
        
        // Then creating the construction site
        if (creep.room.createConstructionSite(constructionSitePosition.x, constructionSitePosition.y, STRUCTURE_EXTENSION ) == 0) {
            creep.room.createConstructionSite(constructionSitePosition.x, constructionSitePosition.y, STRUCTURE_EXTENSION);
        }
        else console.log("Equipment problem while creating construction site for extension, the error code is "+creep.room.createConstructionSite(constructionSitePosition.x, constructionSitePosition.y, STRUCTURE_EXTENSION ));
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        // then building phase
        if (target !== null) {
            if(target) {
                if (creep.build(target) == OK) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff9900'}});
                    }
                    console.log("CONSTRUCTION IN PROGRESS : "+target.progress+"/"+target.progressTotal);
                }
            }
        }
        else {
            creep.memory.role     = "harvester";
            creep.memory.building = false;
        }
    },


    /**
     * REFILL EXTENSIONS
     **/
    refillExtensions: function(creepName) {
        console.log("ENTREE REFILL EXTENSIONS ->"+creepName);
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
            creep.memory.role = "harvester";
            MiningMinistry.goHarvest(creepName);
        }
    }
};
