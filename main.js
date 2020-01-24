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
    const maxExtensions     = 30;
    const nbExtensions      = ExplorationMinistry.getExtensionsNb();
    const minSpawningEnergy = 300;
    const maxSpawningEnergy = (nbExtensions * extensionCapacity) + minSpawningEnergy;
    const mainSpawnPosition = { x:Game.spawns["Spawn1"].pos.x, y:(Game.spawns["Spawn1"].pos.y) };
    const RCLPosition       = { x:Game.rooms[Object.keys(Game.rooms)].controller.pos.x, y:Game.rooms[Object.keys(Game.rooms)].controller.pos.y };
    const RCLLevel          = Game.rooms[myRoomName].controller.level;
    const minBuilders       = 1;
    const minUpgraders      = 2;
    const maxUpgraders      = 2;
    const minHarvesters     = 4;
    const maxBodyParts      = 4;
    var nbUpgraders         = ExplorationMinistry.getCreepsCountInRole("upgrader");
    var nbBuilders          = ExplorationMinistry.getCreepsCountInRole("builder");
    var nbFighters          = ExplorationMinistry.getCreepsCountInRole("fighter");
    var nbRefillers         = ExplorationMinistry.getCreepsCountInRole("refiller");
    var nbHarvesters        = ExplorationMinistry.getCreepsCountInRole("harvester") + nbRefillers;
    var tower1              = Game.getObjectById("5e2774b3101cfe04b2d570f4");
    Memory.maxExtensions    = maxExtensions; 
    Memory.nbCreeps         = Object.keys(Game.creeps).length;
    Memory.spawnEnergy      = {"current":Game.spawns['Spawn1'].store[RESOURCE_ENERGY], "max":SPAWN_ENERGY_CAPACITY};
    Memory.maxCreeps        = 15;
    
    /////////////////////////////    DEBUGGING SPACE    ///////////////////////////////
   if (Game.time % 10 == 0) { console.log("GAME TIME-->"+Game.time+"|NB HARVESTERS "+nbHarvesters+" |NBUPGRADERS "+nbUpgraders+" |NBBUILDERS "+nbBuilders+" |NBFIGHTERS"+nbFighters+" |TOTALCREEPS "+Memory.nbCreeps) }
    //let creepy = Game.creeps["nadriano"];
    //creepy.suicide();
    //console.log("DEBUGGING SPACE =====================================================================================>"+);
    //Memory.extensionsCells = [];
    
    
    
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
    if (Memory.nbCreeps < Memory.maxCreeps && roomEnergy >= minSpawningEnergy) {
        let creepRole        = MiningMinistry.defineCreepRoles(minUpgraders, minHarvesters, nbHarvesters, nbUpgraders, nbBuilders, nbFighters, nbRefillers);
        let isEmergencyState = false;
        // Generate light harvesters whenever there is no more creeps left (emergency state)
        if (nbHarvesters < minHarvesters && Memory.nbCreeps < minHarvesters + 1) {
            isEmergencyState = true;
            if (roomEnergy >= minSpawningEnergy) {
                MiningMinistry.makeCreeps(creepRole, roomEnergy, minHarvesters, maxSpawningEnergy, isEmergencyState);
            }
        }
        // If everything OK then generate max power creeps
        else if (roomEnergy >= maxSpawningEnergy) {
            MiningMinistry.makeCreeps(creepRole, roomEnergy, minHarvesters, maxSpawningEnergy, isEmergencyState);
        }  
    }
    
    // CREEPS MAIN LOOP
    for (var i = 0; i < Memory.nbCreeps; i++) {
        let creepName = Object.keys(Game.creeps)[i];
        let creep     = Game.creeps[creepName];
        // Toggling the energy source to alleviate traffic front of sources
        i%2 === 0 ? sourceNb = 1 : sourceNb = 0;
        ////////////////////////////    MAIN ROLES   /////////////////////////////
        
        // HARVESTERS (might become refillers)
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
            
        // BUILDERS
        else if (creep.memory.role == "builder") {
            // roads maintenance
            //let damagedRoad  = tower.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && (s.structureType==STRUCTURE_ROAD)  });
            //if (damagedRoad)  { if (creep.repair(damagedRoad)  == ERR_NOT_IN_RANGE) { creep.moveTo(damagedRoad)  }}
            
            // Structures building
            let RCL = [ [{containers:5, spawnCenter:0, extensions:0,  walls:false, towers:0, _storage:false, links:0, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],            
                        [{containers:5, spawnCenter:1, extensions:0,  walls:true,  towers:0, _storage:false, links:0, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:1, extensions:5,  walls:true,  towers:0, _storage:false, links:0, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:1, extensions:10, walls:true,  towers:1, _storage:false, links:0, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:1, extensions:20, walls:true,  towers:1, _storage:true,  links:0, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:1, extensions:30, walls:true,  towers:2, _storage:true,  links:2, extractor:false, labs:0,  _terminal:false, observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:1, extensions:40, walls:true,  towers:2, _storage:true,  links:3, extractor:true,  labs:3,  _terminal:true,  observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:2, extensions:50, walls:true,  towers:3, _storage:true,  links:4, extractor:true,  labs:6,  _terminal:true,  observer:false, powerSpawn:false}],
                        [{containers:5, spawnCenter:3, extensions:60, walls:true,  towers:6, _storage:true,  links:6, extractor:true,  labs:10, _terminal:true,  observer:true,  powerSpawn:true}]];
            let structureType  = STRUCTURE_TOWER; // hardcoded TODO-> Ilement a queue based on previous RCL table
            let spotX          = ExplorationMinistry.findFreeCells(mainSpawnPosition.x, mainSpawnPosition.y).x;
            let spotY          = ExplorationMinistry.findFreeCells(mainSpawnPosition.x, mainSpawnPosition.y).y;
            EquipmentMinistry.buildStructure(creepName, structureType, 26, 33);
        }
        
        // UPGRADERS
        else if (creep.memory.role == "upgrader") {
            EquipmentMinistry.goUpgradeController(creepName);
        }
        
        // FIGHTERS
        else if (creep.memory.role == "fighter") {
            let closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) { creep.attack(closestHostile); }
            else creep.moveTo(6,25);
        }
        
        
        //////////////////////////   TEMPORARY ROLES   ////////////////////////////
        // REFILLERS 
        else if (creep.memory.role == "refiller") {
            if (creep.store.getUsedCapacity() < 50) {
                creep.memory.role = "harvester";
            }
            else {
                // Refill towers in priority
                let emptyTower = tower1.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => s.energy < s.energyCapacity && (s.structureType==STRUCTURE_TOWER) });
                if (emptyTower) {
                    let towerId = tower1.id;
                    EquipmentMinistry.refillTowers(creepName, towerId);
                }
                else EquipmentMinistry.refillExtensions(creepName, roomEnergy, maxRoomEnergy);
            }
        }
    }
    
    
    //////////////////////////////  DEFENSE HANDLING  /////////////////////////////
    
    if(tower1) {
        var closestDamagedStructure = tower1.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax  });
        if(closestDamagedStructure) {
            tower1.repair(closestDamagedStructure);
        }
        var closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            console.log("ENTREE ATTAQUE");
            tower1.attack(closestHostile);
        }
    }
};
