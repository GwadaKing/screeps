/**
 * TODO --> road system
 * TODO --> defense handling
 * 
 **/
const MiningMinistry      = require('MiningMinistry');
const EquipmentMinistry   = require('EquipmentMinistry');
const ExplorationMinistry = require('ExplorationMinistry');

module.exports.loop = function () {
    // MY CONSTANTS
    const myRoomName        = Object.keys(Game.rooms); 
    const myRoom            = Game.rooms[myRoomName];
    const roomEnergy        = Game.rooms[myRoomName].energyAvailable;
    const maxRoomEnergy     = Game.rooms[myRoomName].energyCapacityAvailable;
    const extensionCapacity = 50;
    const maxExtensions     = 15;
    const nbExtensions      = ExplorationMinistry.getExtensionsNb();
    const minSpawningEnergy = 350;
    const maxSpawningEnergy = maxExtensions * extensionCapacity;
    const RCLPosition       = { x:Game.rooms[Object.keys(Game.rooms)].controller.pos.x, y:Game.rooms[Object.keys(Game.rooms)].controller.pos.y };
    const maxBuilders       = 3;
    const minUpgraders      = 4;
    const minHarvesters     = 5;
    const maxBodyParts      = 4;
    Memory.maxExtensions    = 15; 
    Memory.nbCreeps         = Object.keys(Game.creeps).length;
    Memory.spawnEnergy      = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps        = 15;
    
    //////////////////////////////  CREEPS HANDLING  //////////////////////////////
    
    // clear memory
    Object.values(Memory.creeps).forEach(((name) => { if (!Game.creeps[name]) { delete Game.creeps[name]; } }));
    
    // CREEPS CREATION -- While less than maxCreeps, keep on generating creeps
    // loading names array
    if (!Memory.creepNamesRegister.length) {
        Memory.creepNamesRegister = ["aakash", "naamir", "naaron", "nabbas", "nabby", "nabdul", "nabdullah", "nabe", "nabel", "nabhay", "nabhijeet", "nabhijit", "nabhilash", "nabhinav", "nabhishek", "nabigail", "nabraham",
                                     "nabu", "nace", "nada", "nadam", "nadarsh", "nadeel", "nadel", "nadi", "nadil", "naditi", "naditya", "nadnan", "nadolfo", "nadrian", "nadriana", "nadriano", "nadrienne", "nagnes",
                                     "nagnieszka", "nahmad", "nahmed", "nahmet", "nahsan", "naida", "naidan", "naileen", "naimee", "naisha", "naj", "najay", "najit", "nakash", "nakhil"];
    }
    // Role Distribution before generating new creep
    if (Memory.nbCreeps < Memory.maxCreeps) {
        let creepRole = MiningMinistry.defineCreepRoles(minUpgraders, minHarvesters);
        MiningMinistry.makeCreeps(creepRole, roomEnergy, minHarvesters, minSpawningEnergy, maxSpawningEnergy);
    }
    
    // ITERATING OVER CREEPS
    for (var i = 0; i < Memory.nbCreeps; i++) {
        let creepName = Object.keys(Game.creeps)[i];
        let creep     = Game.creeps[creepName];
        // Toggling the energy source to alleviate traffic front of sources
        i%2 === 0 ? sourceNb = 1 : sourceNb = 0;
        ////////////////////////////    MAIN ROLES   /////////////////////////////
        // HARVESTERS (might become builders or refillers sometimes)
        if (creep.memory.role == "harvester") {
            // Creep may become refiller if needed and if he has enough energy
            if (creep.store.getFreeCapacity() === 0) {
                if (Memory.nbCreeps < Memory.maxCreeps) {
                    // If spawn full of energy non used and at least one extension is empty, then make sure to refill it
                    if (Memory.spawnEnergy.current == Memory.spawnEnergy.max && roomEnergy < maxRoomEnergy) {
                        creep.memory.role = "refiller";
                        creep.memory.refilling = true;
                        EquipmentMinistry.refillExtensions(creepName);
                    }
                    else MiningMinistry.goHarvest(creepName);
                }
                // If maxCreeps reached, then make sure extensions are refilled and assign building and repairing tasks
                else if (Memory.nbCreeps >= Memory.maxCreeps) {
                    if (ExplorationMinistry.getExtensionsNb() < Memory.maxExtensions) {
                        creep.memory.role = "builder";
                        EquipmentMinistry.buildExtension(creepName);
                    }
                    else {
                        if (roomEnergy == maxRoomEnergy) {
                            creep.memory.role = "builder";
                            creep.memory.refilling = false;
                            creep.memory.building  = false;
                            MiningMinistry.goHarvest(creepName);
                        }
                        else {
                            creep.memory.role = "harvester";
                            creep.memory.refilling = false;
                            creep.memory.building  = false;
                            MiningMinistry.goHarvest(creepName);
                        }
                    }
                }
            }
            else MiningMinistry.goHarvest(creepName);
        }
        // BUILDERS (once they're out of energy, they get back to harvesters)
        else if (creep.memory.role == "builder") {
            if (creep.store.getUsedCapacity() === 0) {
                creep.memory.building = false;
                creep.memory.role     = "harvester";
                MiningMinistry.goHarvest(creepName, sourceNb);
            }
            else  EquipmentMinistry.buildStructure(creepName, STRUCTURE_TOWER, 26, 25);
        }
        // UPGRADERS
        else if (creep.memory.role == "upgrader") {
            EquipmentMinistry.goUpgradeController(creepName);
        }
        //////////////////////////   TEMPORARY ROLES   ////////////////////////////
        // REFILLERS 
        else if (creep.memory.role == "refiller") {
            if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                creep.memory.role = "harvester";
            }
            else EquipmentMinistry.refillExtensions(creepName);
        }
    }
    
    
    //////////////////////////////  DEFENSE HANDLING  /////////////////////////////
    /*
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    */
};
