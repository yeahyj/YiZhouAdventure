import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';

/**
 * 法杖丢弃组件
 */
@ecs.register('StaffDropComp')
export class StaffDropComp extends ecs.Comp {
    reset(): void {}
}

/**武器方向系统 */
export class StaffDropSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffDropComp);
    }

    entityEnter(e: ECSEntity): void {
        if (e.parent) {
            e.parent.removeChild(e);
        }
    }
    update(e: ecs.Entity): void {}
}
