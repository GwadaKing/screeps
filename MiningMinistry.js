var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    
    /**
     * MAKE CREEPS
     * Handle creeps generation
     * 
     * */
    makeCreeps: function(creepRole, roomEnergy, minHarvesters, minSpawningEnergy, maxSpawningEnergy) {
        console.log("ENTREE MAKECREEPS ["+creepRole+" "+roomEnergy+"]");
        let creepName        = Memory.creepNamesRegister.shift();
        if (creepRole == "harvester") {
            // If things went wrong, repopulate first with harvesters lightly built
            if (Memory.nbCreeps < minHarvesters) {
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role:creepRole }});
            }
            // If energy full, create nicest creeps
            if (roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK], creepName, { memory: { role:creepRole }});
            }
        }
        else if (creepRole == "upgrader") {
            if (Memory.nbCreeps > minHarvesters && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK], creepName, { memory: { role:creepRole }});
            }
        }
        else if (creepRole == "builder") {
            if (Memory.nbCreeps > minHarvesters && roomEnergy >= maxSpawningEnergy) {
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK], creepName, { memory: { role:creepRole }});
            }
        }
    },
    
    /**
     * GO HARVEST
     * Handle harvesting operation
     * TODO --> 
     * TODO --> 
     **/
    goHarvest: function(creepName, sourceNb) {
        console.log("ENTREE GOHARVEST"+Game.creeps[creepName]);
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
            else console.log("Mining problem while moving to energy source, the error code is "+myharvester.moveTo(sources[sourceNb]));
        }
        else if (myharvester.store.getFreeCapacity() === 0) {
            if (myharvester.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    myharvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}});
            }
            else console.log("Mining problem while coming back to spawn, the error code is "+myharvester.moveTo(Game.spawns["Spawn1"], {visualizePathStyle: {stroke: '#ffffe0'}}));
        }
    },
    
    /**
     * DEFINE CREEP ROLES
     * @param Int minUpgraders
     * @param Int minHarvesters
     * return String creepRole
     **/
    defineCreepRoles: function(minUpgraders, minHarvesters) {
        console.log("ENTREE DEFINE CREEP ROLES "+minUpgraders+" "+minHarvesters);
        let creepRole = "";
        Memory.nbCreeps%2 === 0 ? creepRole = "upgrader" : creepRole = "harvester";
        // Ensuring a minimum of harvesters, they have priority on other roles
        if (ExplorationMinistry.getHarvestersNb() < minHarvesters) {
            creepRole = "harvester";
        }
        // Once enough harvesters and upgraders, there must be at least 1 permanent builder
        else if (ExplorationMinistry.getBuildersNb() === 0 && Memory.nbCreeps >= (minHarvesters + minUpgraders)) {
            creepRole = "builder";
        }
        // Else the general rule applies (1upgrader then 1 harvester)
        return creepRole;
    }
};
