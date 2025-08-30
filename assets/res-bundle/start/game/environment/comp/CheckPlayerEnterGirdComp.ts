import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import BattleUtil from '../../common/help/util/BattleUtil';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { StateEnterGirdState } from '../help/EnvironmentEnum';
import { StateEnterGirdComp } from './state/StateEnterGirdComp';

/**
 * 检查玩家进入格子组件
 */
@ecs.register('CheckPlayerEnterGirdComp')
export class CheckPlayerEnterGirdComp extends ecs.Comp {
    reset(): void {}
}

/**检查玩家进入格子系统 */
export class CheckPlayerEnterGirdSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(CheckPlayerEnterGirdComp);
    }

    update(entity: ECSEntity): void {
        let player = ecs.getSingleton(GameModelComp).playerEntity;
        if (!player) {
            return;
        }
        let pos = entity.get(PositionComp).getPosition(true);
        let gridPos = BattleUtil.getGridPosByNodePos(pos);

        let playerGridPos = BattleUtil.getGridPosByNodePos(player.get(PositionComp).getPosition(true));

        if (playerGridPos.x == gridPos.x && playerGridPos.y == gridPos.y) {
            if (entity.has(StateEnterGirdComp)) {
                entity.get(StateEnterGirdComp).state = StateEnterGirdState.CONTINUE;
            } else {
                entity.add(StateEnterGirdComp);
                entity.get(StateEnterGirdComp).state = StateEnterGirdState.ENTER;
            }
        } else {
            if (entity.has(StateEnterGirdComp)) {
                entity.remove(StateEnterGirdComp);
            }
        }
    }
}
