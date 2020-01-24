var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    
    /**
     * MAKE CREEPS
     * Handle creeps generation
     * 
     * */
    makeCreeps: function(creepRole, roomEnergy, minHarvesters, maxSpawningEnergy, isEmergencyState) {
        console.log("ENTREE MAKECREEPS ["+creepRole+"]");
        let creepName        = Memory.creepNamesRegister.shift();
        if (creepRole == "harvester" || creepRole == "upgrader") {
            // If things went wrong, repopulate first with harvesters lightly built
            if (isEmergencyState) {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role:"harvester" }});
            }
            // If energy full, create nicest creeps
            else if (roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK], creepName, { memory: { role:creepRole}});
            }
        }
        else if (creepRole == "builder") {
            if (roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK], creepName, { memory: { role:creepRole }});
            }
        }
        else if (creepRole == "fighter") {
            if (roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], creepName, { memory: { role:creepRole }});
            }
            else Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, ATTACK, MOVE], creepName, { memory: { role:creepRole }});
        }
    },
    
    /**
     * GO HARVEST
     * Handle harvesting operation
     * TODO --> 
     * TODO --> 
     **/
    goHarvest: function(creepName, sourceNb) {
        //console.log("ENTREE GOHARVEST"+Game.creeps[creepName]);
        let myharvester  = Game.creeps[creepName];
        const myRoomName = Object.keys(Game.rooms); 
        const myRoom     = Game.rooms[myRoomName];
        // harvester harvests until full capacity
        if (myharvester.store.getFreeCapacity() > 0) {
            let sources         = myharvester.room.find(FIND_SOURCES);
            let source1Position = { x:sources[0].pos.x, y:sources[0].pos.y };
            let source2Position = { x:sources[1].pos.x, y:sources[1].pos.y };
            if (myharvester.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                myharvester.moveTo(sources[0], { visualizePathStyle: {stroke: '#ffffe0' }});
            }
            //else console.log("Mining problem while moving to energy source, the error code is "+myharvester.moveTo(sources[sourceNb]));
        }
        else if (myharvester.store.getFreeCapacity() === 0) {
            if (myharvester.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    myharvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}});
            }
            //else console.log("Mining problem while coming back to spawn, the error code is "+myharvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}}));
        }
    },
    
    /**
     * DEFINE CREEP ROLES
     * @param Int minUpgraders
     * @param Int minHarvesters
     * return String creepRole
     **/
    defineCreepRoles: function(minUpgraders, maxUpgraders, minHarvesters, nbHarvesters, nbUpgraders, nbBuilders, nbFighters, nbRefillers) {
        //console.log("ENTREE DEFINE CREEP ROLES "+minUpgraders+" "+minHarvesters);
        let creepRole = "";
        // General rule is 1 upgrader then 1 harvester
        if      (Memory.nbCreeps%2 === 0)                       { creepRole = "harvester" }
        else if (Memory.nbCreeps%3 === 0)                       { creepRole = "builder"   }
        else if (Memory.nbCreeps == 5 || Memory.nbCreeps == 10) { creepRole = "fighter"   }
        else if (nbUpgraders < minUpgraders)                    { creepRole = "upgrader"  } // Ensuring a minimum of upgraders
        else if (nbUpgraders >= maxUpgraders)                   { creepRole = "builder"   }
        else if (nbHarvesters < minHarvesters)                  { creepRole = "harvester" } // Ensuring a minimum of harvesters, they have priority on other roles
        return creepRole;
    }
};
