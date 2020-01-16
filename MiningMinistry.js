var ExplorationMinistry = require('ExplorationMinistry');

module.exports = {
    
    /**
     * MAKE CREEPS
     * Handle creeps generation
     * TODO --> Implement role handling and role quotas between harvesters, carriers and fighters
     * TODO --> These roles could be organised in harvester/repairer, carrier/explorer, fighter/defender
     * */
    makeCreeps: function(creepRole, creepParts) {
        //console.log("ENTREE MAKECREEPS");
        let creepName = Memory.creepNamesRegister.shift();
        if (Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { role:creepRole }}) == OK) {
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { role:creepRole }});// TODO -> A terme remplacer par l'argument creepRole
        }
        else console.log("Creep creation problem, the error code is "+Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { role:creepRole }}));
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
    }
};
