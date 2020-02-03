var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    
    /**
     * MAKE CREEPS
     * Handle creeps generation
     * 
     * */
    makeCreeps: function(creepRole, roomEnergy, minHarvesters, maxSpawningEnergy, colonyState) {
        console.log("ENTREE MAKECREEPS ["+creepRole+"]");
        let creepName = Memory.creepNamesRegister.shift();
        let mediumLvl = 900;
        let sourceNb  = null;
        // Toggling the energy source to alleviate traffic front of sources
        Memory.nbCreeps%2 === 0 ? sourceNb = 1 : sourceNb = 0;
        if (creepRole == "harvester") {
            // If things went wrong, repopulate first with harvesters lightly built
            if (colonyState == "low") {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            else if (colonyState == "medium" && roomEnergy >= mediumLvl) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            // If energy full, create nicest creeps
            else if (colonyState == "high" && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
        }
        else if (creepRole == "upgrader") {
             if (colonyState == "low") {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            else if (colonyState == "medium" && roomEnergy >= mediumLvl) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            // If energy full, create nicest creeps
            else if (colonyState == "high" && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
        }
        else if (creepRole == "builder") {
            if (colonyState == "low") {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            else if (colonyState == "medium" && roomEnergy >= mediumLvl) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            // If energy full, create nicest creeps
            else if (colonyState == "high" && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
        }
        else if (creepRole == "fighter") {
            if (colonyState == "low") {
                Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, ATTACK, TOUGH, MOVE], creepName, { memory: { role:creepRole }});
            }
            else if (colonyState == "medium" && roomEnergy >= mediumLvl) {
                Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE], creepName, { memory: { role:creepRole }});
            }
            // If energy full, create nicest creeps
            else if (colonyState == "high" && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, CLAIM, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole }});
            }
        }
        else if (creepRole == "claimer") {
            if (colonyState == "medium" && roomEnergy >= mediumLvl) {
                Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
            // If energy full, create nicest creeps
            else if (colonyState == "high" && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole, energySource:sourceNb }});
            }
        }
    },
    
    /**
     * GO HARVEST
     * Handle harvesting operation
     * TODO --> 
     * TODO --> 
     **/
    goHarvest: function(creepName) {
        //console.log("ENTREE GOHARVEST"+Game.creeps[creepName]);
        let myHarvester  = Game.creeps[creepName];
        const myRoomName = "E7S16"; 
        const myRoom     = Game.rooms[myRoomName];
        let sourceNb     = myHarvester.memory.energySource;
        // harvester harvests until full capacity
        if (myHarvester.store.getFreeCapacity() > 0) {
            let sources         = myHarvester.room.find(FIND_SOURCES);
            let source1Position = { x:sources[0].pos.x, y:sources[0].pos.y };
            //let source2Position = { x:sources[1].pos.x, y:sources[1].pos.y };
            if (sources[sourceNb].energy === 0) { 
                if (sourceNb === 0) { sourceNb = 1 }
                else if (sourceNb === 1) { sourceNb = 0 }
            }
            if (myHarvester.harvest(sources[sourceNb]) == ERR_NOT_IN_RANGE) {
                myHarvester.moveTo(sources[sourceNb], { visualizePathStyle: {stroke: '#ffffe0' }});
            }
            //else console.log("Mining problem while moving to energy source, the error code is "+myHarvester.moveTo(sources[sourceNb]));
        }
        else if (myHarvester.store.getFreeCapacity() === 0) {
            if (myHarvester.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    myHarvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}});
            }
            //else console.log("Mining problem while coming back to spawn, the error code is "+myHarvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}}));
        }
    },
    
    /**
     * DEFINE CREEP ROLES
     * @param Int minUpgraders
     * @param Int minHarvesters
     * return String creepRole
     **/
    defineCreepRoles: function(minUpgraders, minHarvesters, nbHarvesters, nbUpgraders, nbBuilders, minBuilders, nbFighters, nbRefillers) {
        //console.log("ENTREE DEFINE CREEP ROLES "+minUpgraders+" "+minHarvesters);
        let creepRole = "";
        if (Memory.nbCreeps <= 8) { creepRole  = "harvester" }
        else {
            Memory.nbCreeps%2 === 0 ? creepRole = "harvester" : creepRole = "upgrader";
        }
        if (Memory.nbCreeps == 10 || Memory.nbCreeps == 15) {
            creepRole = "fighter";
        }
        return creepRole;
    },
    
    /**
     * HARVEST NEXT ROOM
     **/
    harvestNextRoom: function(creepName, targetRoomName, myRoomName) {
        console.log("ENTREE HARVEST OTHER ROOM"+creepName+" "+targetRoomName+" "+myRoomName);
        let linkOutside = Game.getObjectById("5bbcad569099fc012e637248");
        let linkInTown  = Game.getObjectById("5e30a77515ad35f28ff3f22a");
        let creep       = Game.creeps[creepName];
        let targetRoom  = Game.rooms[targetRoomName];
        let myRoom      = Game.rooms[myRoomName];
        let forthExit   = Game.map.findExit(creep.room, targetRoomName);
        let backExit    = Game.map.findExit(creep.room, myRoomName);
        let forthWay    = creep.pos.findClosestByRange(forthExit);
        let backWay     = creep.pos.findClosestByRange(backExit);
        
        if (creep.memory.transferring && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transferring = false;
        }
        if (!creep.memory.transferring && creep.store.getFreeCapacity() == 0) {
            creep.memory.transferring = true;
        }
        if (creep.memory.transferring) {
            console.log("ENTREE HARVEST OTHER ROOM 2");
            if (creep.room.name == myRoomName) {
                console.log("ENTREE HARVEST OTHER ROOM 3");
                if (creep.transfer(linkOutside, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(linkOutside, {visualizePathStyle: {stroke: '#ffffe0'}});
                }
            }
            else if (creep.room.name == targetRoomName) {
                console.log("ENTREE HARVEST OTHER ROOM 4");
                creep.moveTo(backWay);
            }
        }
        else {
            if (creep.room.name == targetRoomName) {
                console.log("ENTREE HARVEST OTHER ROOM 5");
                let sources = creep.room.find(FIND_SOURCES);
                if (creep.store.getFreeCapacity() > 0) {
                    console.log("ENTREE HARVEST OTHER ROOM 6");
                    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0]);
                    }
                    else console.log(creep.harvest(sources[0]));
                }    
            }
            else if (creep.room.name == myRoomName) {
                console.log("ENTREE HARVEST OTHER ROOM 7");
                creep.moveTo(forthWay);
            }
        }
    }
};
