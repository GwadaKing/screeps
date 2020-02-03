const EquipmentMinistry = require('EquipmentMinistry');
module.exports = {
    
    /**
     * TOWERS ATTACK
     **/
    towersAttack: function(towers) {
        let closestEnemy = null;
        for (let i = 0, l = towers.length; i < l; i++) {
            closestEnemy = towers[i].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestEnemy) {
                towers[i].attack(closestEnemy);
            }
        }
        if (!closestEnemy) {
            // Towers take care of road maintenance
            EquipmentMinistry.repairRoads(towers);
        }
    }
};
