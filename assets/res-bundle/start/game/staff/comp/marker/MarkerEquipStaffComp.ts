import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';

/**
 * 法杖装备标记组件
 */
@ecs.register('MarkerEquipStaffComp')
export class MarkerEquipStaffComp extends ecs.Comp {
    reset(): void {}
}

export class MarkerEquipStaffSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MarkerEquipStaffComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        e.remove(MarkerEquipStaffComp);
    }
}
