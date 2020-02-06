const MiningMinistry        = require('MiningMinistry');
const EquipmentMinistry     = require('EquipmentMinistry');
const ExplorationMinistry   = require('ExplorationMinistry');
const DefenceMinistry       = require('DefenceMinistry');
module.exports.loop = function () {
    // MY CONSTANTS
    const mainRoomName      = "E7S16"; 
    const upRoomName        = "E7S15";
    const leftRoomName      = "E6S16";
    const myRoom            = Game.rooms[mainRoomName];
    const mainRoomEnergy    = Game.rooms[mainRoomName].energyAvailable;
    const upRoomEnergy      = Game.rooms[upRoomName].energyAvailable;
    const maxRoomEnergy     = Game.rooms[mainRoomName].energyCapacityAvailable;
    const maxRoomEnergy2    = Game.rooms[upRoomName].energyCapacityAvailable; 
    const extensionCapacity = 50;
    const maxExtensions     = 30;
    const nbExtensions      = ExplorationMinistry.getExtensionsNb(mainRoomName);
    const minSpawningEnergy = 300;
    const maxSpawningEnergy = (nbExtensions * extensionCapacity) + minSpawningEnergy;
    const mainSpawnPosition = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
    const RCLPosition       = { x:Game.rooms["E7S16"].controller.pos.x, y:Game.rooms["E7S16"].controller.pos.y };
    const RCLLevel          = Game.rooms[mainRoomName].controller.level;
    const minUpgraders      = 2;
    const minBuilders       = 1;
    const maxUpgraders      = 10;
    const minHarvesters     = 3;
    const mediumThresold    = 13;
    const maxBodyParts      = 4;
    let roomName            = Object.keys(Game.rooms)[0]; 
    var nbCreeps            = ExplorationMinistry.getCreepsCountInRole(mainRoomName, upRoomName);
    var nbUpgraders         = nbCreeps.Spawn1.upgrader;
    var nbBuilders          = nbCreeps.Spawn1.builder;
    var nbFighters          = nbCreeps.Spawn1.fighter;
    var nbRefillers         = nbCreeps.Spawn1.refiller;
    var nbHarvesters        = nbCreeps.Spawn1.harvester + nbRefillers;
    var nbUpgraders2        = nbCreeps.Spawn2.upgrader;
    var nbBuilders2         = nbCreeps.Spawn2.builder;
    var nbFighters2         = nbCreeps.Spawn2.fighter;
    var nbRefillers2        = nbCreeps.Spawn2.refiller;
    var nbHarvesters2       = nbCreeps.Spawn2.harvester + nbRefillers2;
    var nbCreepsInRoom1     = nbUpgraders  + nbHarvesters  + nbBuilders  + nbFighters;
    var nbCreepsInRoom2     = nbUpgraders2 + nbHarvesters2 + nbBuilders2 + nbFighters2;
    var towers              = myRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    Memory.maxExtensions    = maxExtensions; 
    Memory.nbCreeps         = Object.keys(Game.creeps).length;
    Memory.spawnEnergy      = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps        = 20;
    
    /////////////////////////////    DEBUGGING SPACE    ///////////////////////////////
    console.log("GAME TIME-->"+Game.time+" |TOTALCREEPS "+Memory.nbCreeps+"\nMAIN ROOM ==> NB HARVESTERS "+nbHarvesters+" + NBUPGRADERS "+nbUpgraders+" + NBBUILDERS "+nbBuilders+" + NBFIGHTERS "+nbFighters+" = "+nbCreepsInRoom1+
                                         "\nUP   ROOM ==> NB HARVESTERS "+nbHarvesters2+" + NBUPGRADERS "+nbUpgraders2+" + NBBUILDERS "+nbBuilders2+" + NBFIGHTERS "+nbFighters2+" = "+nbCreepsInRoom2);
    //let creep = Game.creeps["nabhay"];
    //creep.suicide();
    //console.log("DEBUGGING SPACE =====================================================================================>"+);
    
    

    


    
    ////////////////////////////     CREEPS HANDLING    //////////////////////////////
    
    // Deleting dead creeps from Memory
    for (let name in Memory.creeps) { if (Game.creeps[name] == undefined) { delete Memory.creeps[name] } }
    // CREEPS CREATION -- While less than maxCreeps, keep on generating creeps
    // loading names array
    if (!Memory.creepNamesRegister.length) {
        Memory.creepNamesRegister = ["aakash", "naamir", "naaron", "nabbas", "nabby", "nabdul", "nabdullah", "nabe", "nabel", "nabhay", "nabhijeet", "nabhijit", "nabhilash", "nabhinav", "nabhishek", "nabigail", "nabraham",
                                     "nabu", "nace", "nada", "nadam", "nadarsh", "nadeel", "nadel", "nadi", "nadil", "naditi", "naditya", "nadnan", "nadolfo", "nadrian", "nadriana", "nadriano", "nadrienne", "nagnes",
                                     "nagnieszka", "nahmad", "nahmed", "nahmet", "nahsan", "naida", "naidan", "naileen", "naimee", "naisha", "naj", "najay", "najit", "nakash", "nakhil"];
    }
    // DISTRIBUTING ROLES AND CREATING CREEPS
    if (Game.rooms[mainRoomName]) {
        if (nbCreepsInRoom1 <= Memory.maxCreeps && mainRoomEnergy >= minSpawningEnergy) {
            let colonyState = "";
            let spawnName   = "Spawn1";
            let creepRoom   = mainRoomName;
            let creepRole   = MiningMinistry.defineCreepRoles(creepRoom, mainRoomName, nbCreepsInRoom1, nbCreepsInRoom2);
            if      (nbCreepsInRoom1 <= 5)                       { colonyState = "low"    }
            else if (nbCreepsInRoom1 >5 && nbCreepsInRoom1 < 13) { colonyState = "medium" }
            else if (nbCreepsInRoom1 >=13)                       { colonyState = "high"   }
            MiningMinistry.makeCreeps(creepRole, mainRoomEnergy, minHarvesters, maxSpawningEnergy, spawnName, colonyState);
        }
    }
    if (Game.rooms[upRoomName]) {
        if (nbCreepsInRoom2 <= Memory.maxCreeps && upRoomEnergy >= minSpawningEnergy) {
            let colonyState = "";
            let spawnName   = "Spawn2";
            let creepRoom   = upRoomName;
            let creepRole   = MiningMinistry.defineCreepRoles(creepRoom, mainRoomName, nbCreepsInRoom1, nbCreepsInRoom2);
            if      (nbCreepsInRoom2 <= 5)                       { colonyState = "low"    }
            else if (nbCreepsInRoom2 >5 && nbCreepsInRoom2 < 13) { colonyState = "medium" }
            else if (nbCreepsInRoom2 >=13)                       { colonyState = "high"   }
            MiningMinistry.makeCreeps(creepRole, upRoomEnergy, minHarvesters, maxSpawningEnergy, spawnName, "low");
        }
    }
    
    // CREEPS MAIN LOOP
    for (var i = 0; i < Memory.nbCreeps; i++) {
        let creepName = Object.keys(Game.creeps)[i];
        let spawnName = "";
        let creep     = Game.creeps[creepName];
        ////////////////////////////    MAIN ROLES   /////////////////////////////
        
        // HARVESTERS (might become refillers)
        if (creep.memory.role == "harvester") {
            let sources = creep.room.find(FIND_SOURCES);
            if (creep.room.name == mainRoomName) { spawnName = "Spawn1" } else spawnName = "Spawn2";
            // Creep may become refiller if needed and if he has enough energy
            if (creep.store.getFreeCapacity() === 0) {
                // If spawn full of energy non used and at least one extension is empty, then make sure to refill it
                if (Memory.spawnEnergy.current == Memory.spawnEnergy.max && mainRoomEnergy < maxRoomEnergy) {
                    creep.memory.role = "refiller";
                    creep.memory.refilling = true;
                    EquipmentMinistry.refillExtensions(creepName, mainRoomEnergy, maxRoomEnergy);
                }
                else MiningMinistry.goHarvest(creepName, spawnName);
            }
            else MiningMinistry.goHarvest(creepName, spawnName);
        }
            
        // BUILDERS
        else if (creep.memory.role == "builder") {
            let droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, { filter: function(resource) { return resource.resourceType === RESOURCE_ENERGY	}});
            let bigStorage    = Game.getObjectById("5e2f6788f0d1bf9d60711eb9");
            if (creep.room.name == mainRoomName) {
                if (droppedEnergy) {
                    if (creep.harvest(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy);
                    }
                }
                else EquipmentMinistry.buildStructure(creepName);
            }
            else if (creep.room.name == upRoomName) {
                if (droppedEnergy) {
                    if (creep.store.getFreeCapacity() > 0) {
                        if (creep.harvest(droppedEnergy) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedEnergy);
                        }
                    }
                    else {
                        if (creep.transfer(bigStorage) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(bigStorage);
                        }
                    }
                }
                else EquipmentMinistry.buildStructure(creepName);
            }
        }
        
        // UPGRADERS
        else if (creep.memory.role == "upgrader") {
            EquipmentMinistry.goUpgradeController(creepName, mainRoomName);
        }
        
        // FIGHTERS
        else if (creep.memory.role == "fighter") {
            let closestEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            let linkOutside  = Game.getObjectById("5bbcad569099fc012e637248");
            let linkInTown   = Game.getObjectById("5e30a77515ad35f28ff3f22a");
            let upRoomName   = "E7S15";
            let leftRoomName = "E6S16";
            let targetRoom   = Game.rooms["E7S15"];
            let myRoom       = Game.rooms[mainRoomName];
            let forthExit    = Game.map.findExit(creep.room, upRoomName);
            let backExit     = Game.map.findExit(creep.room, mainRoomName);
            let leftExit     = Game.map.findExit(creep.room, leftRoomName);
            let forthWay     = creep.pos.findClosestByRange(forthExit);
            let backWay      = creep.pos.findClosestByRange(backExit);
            let leftWay      = creep.pos.findClosestByRange(leftExit);
            if (creep.room.name == mainRoomName) {
                if (closestEnemy) { creep.attack(closestEnemy) }
                else creep.moveTo(leftWay);
            }
            else if (creep.room.name == leftRoomName) {
                let closestEnemy = Game.getObjectById("5e3b15fd766f2be1b942c947"); //creep.pos.findClosestByRange(FIND_CREEPS);
                if (closestEnemy) {
                    if (creep.attack(closestEnemy) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(closestEnemy) ;
                    } 
                    else creep.moveTo(towers[1]);
                }
            }
        }
        
        
        //////////////////////////   TEMPORARY ROLES   ////////////////////////////
        // REFILLERS 
        else if (creep.memory.role == "refiller") {
            if (creep.store.getUsedCapacity() === 0) {
                creep.memory.role = "harvester";
            }
            else {
                // Refill towers in priority if invader
                let creepRoom = creep.room.name;
                let towers    = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                for (let i = 0, l = towers.length; i < l; i++) {
                    let emptyTower = towers[i].pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.energy < s.energyCapacity / 2 && (s.structureType==STRUCTURE_TOWER) });
                    if (emptyTower) {
                        let towerId        = towers[i].id;
                        let towerEnergy    = towers[i].energy;
                        let towerMaxEnergy = towers[i].energyCapacity;
                        let enemy          = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if (towerEnergy < towerMaxEnergy / 2) {
                            EquipmentMinistry.refillTowers(creepName, towerId);
                        }
                    }
                    // then refill extensions
                    else EquipmentMinistry.refillExtensions(creepName, creepRoom, mainRoomEnergy, maxRoomEnergy);
                }
            }
        }
        
         // CLAIMERS
        else if (creep.memory.role == "claimer") {
        }
    }
    
    //////////////////////////////  TOWERS HANDLING  /////////////////////////////
    
    // Towers attack whenever enemy spotted
    DefenceMinistry.towersAttack(towers);
    
    
    
};
