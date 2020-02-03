const MiningMinistry        = require('MiningMinistry');
const EquipmentMinistry     = require('EquipmentMinistry');
const ExplorationMinistry   = require('ExplorationMinistry');
const DefenceMinistry       = require('DefenceMinistry');
module.exports.loop = function () {
    // MY CONSTANTS
    const myRoomName        = "E7S16"; //Object.keys(Game.rooms); 
    const myRoom            = Game.rooms[myRoomName];
    const roomEnergy        = Game.rooms[myRoomName].energyAvailable;
    const maxRoomEnergy     = Game.rooms[myRoomName].energyCapacityAvailable;
    const extensionCapacity = 50;
    const maxExtensions     = 30;
    const nbExtensions      = ExplorationMinistry.getExtensionsNb();
    const minSpawningEnergy = 300;
    const maxSpawningEnergy = (nbExtensions * extensionCapacity) + minSpawningEnergy;
    const mainSpawnPosition = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
    const RCLPosition       = { x:Game.rooms["E7S16"].controller.pos.x, y:Game.rooms["E7S16"].controller.pos.y };
    const RCLLevel          = Game.rooms[myRoomName].controller.level;
    const minUpgraders      = 2;
    const minBuilders       = 1;
    const maxUpgraders      = 10;
    const minHarvesters     = 3;
    const mediumThresold    = 13;
    const maxBodyParts      = 4;
    var nbUpgraders         = ExplorationMinistry.getCreepsCountInRole("upgrader");
    var nbBuilders          = ExplorationMinistry.getCreepsCountInRole("builder");
    var nbFighters          = ExplorationMinistry.getCreepsCountInRole("fighter");
    var nbRefillers         = ExplorationMinistry.getCreepsCountInRole("refiller");
    var nbHarvesters        = ExplorationMinistry.getCreepsCountInRole("harvester") + nbRefillers;
    var towers              = myRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    Memory.maxExtensions    = maxExtensions; 
    Memory.nbCreeps         = Object.keys(Game.creeps).length;
    Memory.spawnEnergy      = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps        = 20;
    
    /////////////////////////////    DEBUGGING SPACE    ///////////////////////////////
    /*if (Game.time % 10 == 0) { */console.log("GAME TIME-->"+Game.time+"|NB HARVESTERS "+nbHarvesters+" |NBUPGRADERS "+nbUpgraders+" |NBBUILDERS "+nbBuilders+" |NBFIGHTERS "+nbFighters+" |TOTALCREEPS "+Memory.nbCreeps);
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
    if (Memory.nbCreeps <= Memory.maxCreeps && roomEnergy >= minSpawningEnergy) {
        let colonyState = "";
        let creepRole   = MiningMinistry.defineCreepRoles(minUpgraders, minHarvesters, nbHarvesters, nbUpgraders, nbBuilders, minBuilders, nbFighters, nbRefillers);
        if      (Memory.nbCreeps <= 5)                       { colonyState = "low"    }
        else if (Memory.nbCreeps >5 && Memory.nbCreeps < 13) { colonyState = "medium" }
        else if (Memory.nbCreeps >=13)                       { colonyState = "high"   }
        MiningMinistry.makeCreeps(creepRole, roomEnergy, minHarvesters, maxSpawningEnergy, colonyState);
    }
    
    // CREEPS MAIN LOOP
    for (var i = 0; i < Memory.nbCreeps; i++) {
        let creepName = Object.keys(Game.creeps)[i];
        let creep     = Game.creeps[creepName];
        ////////////////////////////    MAIN ROLES   /////////////////////////////
        
        // HARVESTERS (might become refillers)
        if (creep.memory.role == "harvester") {
            let sources = creep.room.find(FIND_SOURCES);
            // Creep may become refiller if needed and if he has enough energy
            if (creep.store.getFreeCapacity() === 0) {
                // If spawn full of energy non used and at least one extension is empty, then make sure to refill it
                if (Memory.spawnEnergy.current == Memory.spawnEnergy.max && roomEnergy < maxRoomEnergy) {
                    creep.memory.role = "refiller";
                    creep.memory.refilling = true;
                    EquipmentMinistry.refillExtensions(creepName, roomEnergy, maxRoomEnergy);
                }
                else MiningMinistry.goHarvest(creepName);
            }
            else MiningMinistry.goHarvest(creepName);
        }
            
        // BUILDERS
        else if (creep.memory.role == "builder") {
            let targetRoomName = Game.map.describeExits("E7S16")[1];
            
            //creep.memory.role = "upgrader";
            MiningMinistry.harvestNextRoom(creepName, targetRoomName, myRoomName);
            //EquipmentMinistry.buildStructure(creepName, STRUCTURE_ROAD, 8, 26);
        }
        
        // UPGRADERS
        else if (creep.memory.role == "upgrader") {
            //creep.memory.role = "harvester";
            EquipmentMinistry.goUpgradeController(creepName);
        }
        
        // FIGHTERS
        else if (creep.memory.role == "fighter") {
            let closestEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            let linkOutside  = Game.getObjectById("5bbcad569099fc012e637248");
            let linkInTown   = Game.getObjectById("5e30a77515ad35f28ff3f22a");
            let upRoomName   = "E7S15";
            let targetRoom   = Game.rooms["E7S15"];
            let myRoom       = Game.rooms[myRoomName];
            let forthExit    = Game.map.findExit(creep.room, upRoomName);
            let backExit     = Game.map.findExit(creep.room, myRoomName);
            let forthWay     = creep.pos.findClosestByRange(forthExit);
            let backWay      = creep.pos.findClosestByRange(backExit);
            //creep.move(up);
            if (creep.room.name == myRoomName) {
                console.log("DEBUG FIGHTER 1");
                if (closestEnemy) { creep.attack(closestEnemy); console.log("DEBUG FIGHTER 2");}
                else creep.moveTo(forthWay); console.log("DEBUG FIGHTER 3->"+creep.moveTo(forthWay));
            }
            else if (creep.room.name == upRoomName) {
                //creep.move(RIGHT);
                let closestEnemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                let stronghold= Game.getObjectById("5e355dd311a36779f4a610de");
                if (closestEnemy) { creep.attack(closestEnemy); }
                //else creep.moveTo(6,25);
                const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(stronghold) {
                    if(creep.attack(stronghold) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(stronghold);
                    }
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
                let tower1 = towers[0];
                let tower2 = towers[1];
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
                    else EquipmentMinistry.refillExtensions(creepName, roomEnergy, maxRoomEnergy);
                }
            }
        }
    }
    
    //////////////////////////////  TOWERS HANDLING  /////////////////////////////
    
    // Towers attack whenever enemy spotted
    DefenceMinistry.towersAttack(towers);
    
};
