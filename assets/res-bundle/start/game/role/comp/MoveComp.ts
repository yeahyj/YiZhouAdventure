import { v3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { IsPlayerComp } from '../../common/comp/IsPlayerComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';
import BattleUtil from '../../common/help/util/BattleUtil';
import { RoleAnimationStateType } from '../help/RoleEnum';
import { DeathAfterComp } from './death/DeathAfterComp';
import { PositionComp } from './PositionComp';
import { SpeedComp } from './SpeedComp';
import { GridMoveType } from '../../room/help/RoomEnum';
import { LockMoveComp } from './LockMoveComp';
import { RoleAnimationStateMachineComp } from './state/RoleAnimationStateMachineComp';

/**
 * 移动组件 ，只有玩家才有
 */
@ecs.register('MoveComp')
export class MoveComp extends ecs.Comp {
    reset(): void {}
}

/**移动系统 */
export class MoveSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MoveComp, SpeedComp).excludeOf(DeathAfterComp, LockMoveComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity) {
        let speedComp = e.get(SpeedComp);
        let speed = speedComp.speed;
        if (speed.x != 0 || speed.y != 0) {
            let posCmp = e.get(PositionComp);
            let pos = posCmp.getPosition(true);
            let endPos = v3(pos.x + speed.x, pos.y + speed.y);
            //目标点是否可以移动
            let isPlayer = e.has(IsPlayerComp);
            let fromPos = pos;
            if (
                e.get(IsRoleComp) &&
                !BattleUtil.isMovableOnTiledByPos({ pos: endPos, isPlayer, fromPos, moveType: GridMoveType.FREE })
            ) {
                if (
                    BattleUtil.isMovableOnTiledByPos({
                        pos: v3(pos.x + speed.x, pos.y),
                        isPlayer,
                        fromPos,
                        moveType: GridMoveType.FREE,
                    })
                ) {
                    endPos = v3(pos.x + speed.x, pos.y);
                } else if (
                    BattleUtil.isMovableOnTiledByPos({
                        pos: v3(pos.x, pos.y + speed.y),
                        isPlayer,
                        fromPos,
                        moveType: GridMoveType.FREE,
                    })
                ) {
                    endPos = v3(pos.x, pos.y + speed.y);
                } else {
                    endPos = pos;
                }
            }
            posCmp.setPosition(endPos);
            if (e.get(IsRoleComp)) {
                e.get(RoleAnimationStateMachineComp)?.playAnimation({ name: RoleAnimationStateType.WALK });
            }
        } else {
            if (e.get(IsRoleComp)) {
                e.get(RoleAnimationStateMachineComp)?.playAnimation({ name: RoleAnimationStateType.IDLE });
            }
        }
    }

    private exit(e: ecs.Entity) {}
}
