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
    const minHarvesters     = 4;
    const maxBodyParts      = 4;
    var nbHarvesters        = ExplorationMinistry.getCreepsCountInRole("harvester");
    var nbUpgraders         = ExplorationMinistry.getCreepsCountInRole("upgrader");
    var nbBuilders          = ExplorationMinistry.getCreepsCountInRole("builder");
    var nbFighters          = ExplorationMinistry.getCreepsCountInRole("fighter");
    Memory.maxExtensions    = 15; 
    Memory.nbCreeps         = Object.keys(Game.creeps).length;
    Memory.spawnEnergy      = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps        = 15;
    
    //////////////////////////////  CREEPS HANDLING  //////////////////////////////
    
    console.log("TOUR N°"+Game.time);
    console.log("NB HARVESTERS NBUPGRADERS NBBUILDERS"+Game.time);
    // clear memory
    Object.values(Memory.creeps).forEach(((name) => { if (!Game.creeps[name]) { delete Game.creeps[name]; } }));
    
    // CREEPS CREATION -- While less than maxCreeps, keep on generating creeps
    // loading names array
    if (!Memory.creepNamesRegister.length) {
        Memory.creepNamesRegister = ["aakash", "naamir", "naaron", "nabbas", "nabby", "nabdul", "nabdullah", "nabe", "nabel", "nabhay", "nabhijeet", "nabhijit", "nabhilash", "nabhinav", "nabhishek", "nabigail", "nabraham",
                                     "nabu", "nace", "nada", "nadam", "nadarsh", "nadeel", "nadel", "nadi", "nadil", "naditi", "naditya", "nadnan", "nadolfo", "nadrian", "nadriana", "nadriano", "nadrienne", "nagnes",
                                     "nagnieszka", "nahmad", "nahmed", "nahmet", "nahsan", "naida", "naidan", "naileen", "naimee", "naisha", "naj", "najay", "najit", "nakash", "nakhil"];
    }
    // DISTRIBUTING ROLES AND CREATING CREEPS
    if (Memory.nbCreeps < Memory.maxCreeps) {
        let creepRole = MiningMinistry.defineCreepRoles(minUpgraders, minHarvesters, nbHarvesters, nbUpgraders, nbBuilders, nbFighters);
        MiningMinistry.makeCreeps(creepRole, roomEnergy, minHarvesters, minSpawningEnergy, maxSpawningEnergy);
        //MiningMinistry.makeCreeps("fighter", roomEnergy, minHarvesters, minSpawningEnergy, maxSpawningEnergy);
    }
    
    // CREEPS MAIN LOOP
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
                        EquipmentMinistry.refillExtensions(creepName, roomEnergy, maxRoomEnergy);
                    }
                    else MiningMinistry.goHarvest(creepName);
                }
            }
            else MiningMinistry.goHarvest(creepName);
        }
        // BUILDERS (once they're out of energy, they get back to harvesters)
        else if (creep.memory.role == "builder") {
            EquipmentMinistry.buildStructure(creepName, STRUCTURE_TOWER, 26, 25); // TODO-> Créer une queue pour les structures à construire
        }
        // UPGRADERS
        else if (creep.memory.role == "upgrader") {
            EquipmentMinistry.goUpgradeController(creepName);
        }
        // FIGHTERS
        else if (creep.memory.role == "fighter") {
            //EquipmentMinistry.goUpgradeController(creepName);
        }
        //////////////////////////   TEMPORARY ROLES   ////////////////////////////
        // REFILLERS 
        else if (creep.memory.role == "refiller") {
            if (creep.store.getUsedCapacity() < 50) {
                creep.memory.role = "harvester";
            }
            else EquipmentMinistry.refillExtensions(creepName, roomEnergy, maxRoomEnergy);
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
