import { ecs } from '../../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../../base/extensions/cc-ecs/ECSEntity';
import { BaseRoleStateComp } from '../../base/BaseRoleStateComp';
import { CollisionAtkDetectorComp } from '../../CollisionAtkDetectorComp';
import { EnabledComp } from '../../EnabledComp';
import { ViewComp } from '../../ViewComp';

/**空闲状态 */
@ecs.register('IdleStateNormalComp')
export class IdleStateNormalComp extends BaseRoleStateComp {
    reset(): void {}
}

/**空闲状态系统 */
export class IdleStateNormalSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(IdleStateNormalComp, CollisionAtkDetectorComp, ViewComp);
    }

    entityEnter(entity: ECSEntity): void {
        entity.get(CollisionAtkDetectorComp).addCollision();
    }

    entityRemove(entity: ECSEntity): void {
        if (entity.get(EnabledComp)) {
            entity.get(CollisionAtkDetectorComp).removeCollision();
        }
    }
}
