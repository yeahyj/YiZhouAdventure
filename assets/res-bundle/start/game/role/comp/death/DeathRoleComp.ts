import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { IsPlayerComp } from '../../../common/comp/IsPlayerComp';
import { RoomModelComp } from '../../../room/comp/RoomModelComp';
import { RoleEntity } from '../../entity/RoleEntity';
import { DeathComp } from './DeathComp';

/**死亡角色 */
@ecs.register('DeathRoleComp')
export class DeathRoleComp extends ecs.Comp {
    reset(): void {}
}

/**死亡角色系统 */
export class DeathRoleSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathRoleComp, DeathComp).excludeOf(IsPlayerComp);
    }

    entityEnter(e: RoleEntity): void {
        e.parent!.get(RoomModelComp).removeEntity(e);
    }
}
