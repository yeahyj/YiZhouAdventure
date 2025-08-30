import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { CollisionComp } from '../comp/CollisionComp';
import { DamageFlyTextComp } from '../comp/DamageFlyTextComp';
import { DirectionComp } from '../comp/DirectionComp';
import { EnabledComp } from '../comp/EnabledComp';
import { FactionTypeComp } from '../comp/FactionTypeComp';
import { HpComp } from '../comp/HpComp';
import { MoveComp } from '../comp/MoveComp';
import { PositionComp } from '../comp/PositionComp';
import { RoleViewLoadComp } from '../comp/RoleViewLoadComp';
import { SpeedComp } from '../comp/SpeedComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';
import { RoleBehaviorStateMachineComp } from '../comp/state/RoleBehaviorStateMachineComp';
import { DeathRoleComp } from '../comp/death/DeathRoleComp';

/** 角色实体 */
@ecs.register('RoleEntity')
export class RoleEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(
            EnabledComp,
            HpComp,
            MoveComp,
            PositionComp,
            CollisionComp,
            FactionTypeComp,
            SpeedComp,
            DamageFlyTextComp,
            RoleViewLoadComp,
            DirectionComp,
            IsRoleComp,
            RoleBehaviorStateMachineComp,
            DeathRoleComp,
        );
    }
}
