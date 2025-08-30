import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';

/**
 * 法杖卸下标记组件
 */
@ecs.register('MarkerDisarmStaffComp')
export class MarkerDisarmStaffComp extends ecs.Comp {
    reset(): void {}
}

export class MarkerDisarmStaffSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MarkerDisarmStaffComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        e.remove(MarkerDisarmStaffComp);
    }
}
