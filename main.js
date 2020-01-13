var MiningMinistry      = require('MiningMinistry');
var EquipmentMinistry   = require('EquipmentMinistry');
var ExplorationMinistry = require('ExplorationMinistry');

module.exports.loop = function () {
    // ENTITIES SELECTORS BY ID
    var tower           = Game.getObjectById('');
    
    // MY GLOBALS
    const myRoomName    = Object.keys(Game.rooms); 
    const myRoom        = Game.rooms[myRoomName];
    const roomEnergy    = Game.rooms[myRoomName].energyAvailable;
    const maxRoomEnergy = Game.rooms[myRoomName].energyCapacityAvailable;
    const RCLPosition   = { x:Game.rooms[Object.keys(Game.rooms)].controller.pos.x, y:Game.rooms[Object.keys(Game.rooms)].controller.pos.y };
    const maxBuilders   = 3;
    const minUpgraders  = 3;
    const minHarvesters = 5;
    const maxBodyParts  = 4;
    
     
    Memory.nbCreeps     = Object.keys(Game.creeps).length;
    Memory.spawnEnergy  = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps    = 20;
    
    
    //////////////////////////////  CREEPS HANDLING  //////////////////////////////
    
    // clear memory
    Object.values(Memory.creeps).forEach(((name) => {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }));
    
    // CREEPS CREATION -- While less than maxCreeps, keep on generating creeps
    // loading names array
    if (!Memory.creepNamesRegister.length) {
        Memory.creepNamesRegister = ["aakash", "naamir", "naaron", "nabbas", "nabby", "nabdul", "nabdullah", "nabe", "nabel", "nabhay", "nabhijeet", "nabhijit", "nabhilash", "nabhinav", "nabhishek", "nabigail", "nabraham",
                                     "nabu", "nace", "nada", "nadam", "nadarsh", "nadeel", "nadel", "nadi", "nadil", "naditi", "naditya", "nadnan", "nadolfo", "nadrian", "nadriana", "nadriano", "nadrienne", "nagnes",
                                     "nagnieszka", "nahmad", "nahmed", "nahmet", "nahsan", "naida", "naidan", "naileen", "naimee", "naisha", "naj", "najay", "najit", "nakash", "nakhil"];
    }
    // Role Distribution before generating new creep
    if (Memory.nbCreeps < Memory.maxCreeps && maxRoomEnergy >= 300) {
        let creepRole = "";
        Memory.nbCreeps%3 === 0 ? creepRole = "harvester" : creepRole = "upgrader";
        // Ensuring a minimum of harvesters
        if (Memory.nbCreeps < minHarvesters) {
            creepRole = "harvester";
        }
        MiningMinistry.makeCreeps(creepRole);
    }
    
    // ITERATING OVER CREEPS
    for (var i = 0; i < Memory.nbCreeps; i++) {
        let creepName = Object.keys(Game.creeps)[i];
        let creep     = Game.creeps[creepName];
        //creep.suicide();
        // Toggling the energy source to alleviate traffic front of sources
        i%2 === 0 ? sourceNb = 1 : sourceNb = 0;
        // UPGRADER
        if (creep.memory.role == "builder") {
            if (creep.store.getUsedCapacity() === 0) {
                creep.memory.building = false;
                creep.memory.role     = "harvester";
                MiningMinistry.goHarvest(creepName, sourceNb);
            }
            else {
                EquipmentMinistry.buildExtension(creepName);
            }
        }
        else if (creep.memory.role == "upgrader") {
            EquipmentMinistry.goUpgradeController(creepName);
        }
        // HARVESTERS
        else if (creep.memory.role == "harvester") {
            // If spawn full of energy non used then build a container, harvester must be full of energy
            if (Memory.nbCreeps >= 30 && creep.store.getFreeCapacity() === 0 && creep.memory.role != "upgrader") {
                //console.log("=======================================>>>> "+creepName+" has "+creep.store.getFreeCapacity()+"<<<<=======================================");
                creep.memory.role = "builder";
                creep.memory.building = true;
                EquipmentMinistry.buildExtension(creepName);
            }
            else {
                MiningMinistry.goHarvest(creepName, 0);
            }
        }
    }
    
    
    //////////////////////////////  DEFENSE HANDLING  /////////////////////////////
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
}
