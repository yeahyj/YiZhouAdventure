import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { DirectionWeight } from '../../../../common/help/CommonEnum';
import { RoleBehaviorStateType } from '../../../help/RoleEnum';
import { BaseRoleStateComp } from '../../base/BaseRoleStateComp';
import { DirectionComp } from '../../DirectionComp';
import { EnabledComp } from '../../EnabledComp';
import { PositionComp } from '../../PositionComp';
import { RoleBehaviorStateMachineComp } from '../RoleBehaviorStateMachineComp';

/**追击状态 */
@ecs.register('ChaseStateNormalComp')
export class ChaseStateNormalComp extends BaseRoleStateComp {
    chaseEntity: ecs.Entity = null!;
    atkRadius: number = 100;

    initState(fixData: number, data: { chaseEntity: ecs.Entity; chaseRadius?: number }): void {
        this.chaseEntity = data.chaseEntity;
        this.atkRadius = fixData || this.atkRadius;
    }

    reset(): void {}
}

/**追击状态系统 */
export class ChaseStateNormalSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(ChaseStateNormalComp);
    }

    constructor() {
        super();
    }
    update(entity: ECSEntity): void {
        let chaseComp = entity.get(ChaseStateNormalComp);
        let pursueEntity = chaseComp.chaseEntity;
        let atkRadius = chaseComp.atkRadius;
        if (pursueEntity && pursueEntity.get(EnabledComp)) {
            let pursuePos = pursueEntity.get(PositionComp).getPosition(true);
            let pos = entity.get(PositionComp).getPosition();
            //方向
            let dir = pursuePos.clone().subtract(entity.get(PositionComp).getPosition()).normalize();
            //计算我和敌人的距离
            let distance = pos.clone().subtract(pursuePos).length();
            if (distance <= atkRadius) {
                //进入攻击范围,攻击
                entity
                    .get(RoleBehaviorStateMachineComp)
                    .changeState({ state: RoleBehaviorStateType.Attack, data: { atkEntity: pursueEntity, dir: dir } });
            } else {
                //追击,设置方向
                entity.get(DirectionComp).setDirection({ dir: dir, weight: DirectionWeight.move });
            }
        } else {
            //敌人不存在了
            entity.get(RoleBehaviorStateMachineComp).changeState({ state: RoleBehaviorStateType.Idle, data: null });
        }
    }
}
