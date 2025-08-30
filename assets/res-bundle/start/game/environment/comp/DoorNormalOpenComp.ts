import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import BattleUtil from '../../common/help/util/BattleUtil';
import { PositionComp } from '../../role/comp/PositionComp';
import { ViewComp } from '../../role/comp/ViewComp';
import { RoomModelComp } from '../../room/comp/RoomModelComp';
import { AddGridMoveTypeComp } from './AddGridMoveTypeComp';
import { DoorAnimationStateType } from '../help/EnvironmentEnum';
import { StateRoomNoEnemyComp } from '../../room/comp/StateRoomNoEnemyComp';
import { GridMoveType } from '../../room/help/RoomEnum';

/**
 * 普通门打开组件
 */
@ecs.register('DoorNormalOpenComp')
export class DoorNormalOpenComp extends ecs.Comp {
    reset(): void {}
}

/**普通门打开系统 */
export class DoorNormalOpenSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(DoorNormalOpenComp, StateRoomNoEnemyComp, PositionComp, ViewComp);
    }

    entityEnter(e: ECSEntity): void {
        e.get(ViewComp).view.playAnimation({
            name: DoorAnimationStateType.OPEN,
        });
        e.get(AddGridMoveTypeComp).init(GridMoveType.FREE, true);
        let pos = e.get(PositionComp).getPosition(true);
        let gridIndex = BattleUtil.getGridIndexByNodePos(pos);
        e.parent!.get(RoomModelComp).openDoorPos.set(gridIndex, true);
    }

    entityRemove(e: ECSEntity): void {
        e.get(ViewComp).view.playAnimation({
            name: DoorAnimationStateType.CLOSE,
        });
        e.get(AddGridMoveTypeComp).init(GridMoveType.BLOCK, true);
        let pos = e.get(PositionComp).getPosition(true);
        let gridIndex = BattleUtil.getGridIndexByNodePos(pos);
        e.parent!.get(RoomModelComp).openDoorPos.delete(gridIndex);
    }
}
