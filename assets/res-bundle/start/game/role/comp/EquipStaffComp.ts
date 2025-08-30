import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { StaffBagComp } from './StaffBagComp';
import { UnitComp } from './UnitComp';

/**
 * 装备法杖
 */
@ecs.register('EquipStaffComp')
export class EquipStaffComp extends ecs.Comp {
    /**准备装备的索引 */
    useIndex: number = 0;

    reset(): void {}
}

/**装备法杖系统 */
export class EquipStaffSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(EquipStaffComp, StaffBagComp, UnitComp);
    }

    entityEnter(entity: ECSEntity): void {
        let staffBagComp = entity.get(StaffBagComp);
        let equipStaffComp = entity.get(EquipStaffComp);
        staffBagComp.equipStaff(equipStaffComp.useIndex);
        entity.remove(EquipStaffComp);
    }
}
