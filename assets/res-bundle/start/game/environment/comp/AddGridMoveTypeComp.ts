import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import BattleUtil from '../../common/help/util/BattleUtil';
import { PositionComp } from '../../role/comp/PositionComp';
import { RoomGridMoveTypeComp } from '../../room/comp/RoomGridMoveTypeComp';
import { RoomEntity } from '../../room/entity/RoomEntity';
import { GridMoveType } from '../../room/help/RoomEnum';
import { IGridMoveData } from '../../room/help/RoomInterface';
import { RoomEnvironmentModelComp } from './RoomEnvironmentModelComp';

/**
 * 增加格子移动类型组件
 */
@ecs.register('AddGridMoveTypeComp')
export class AddGridMoveTypeComp extends ecs.Comp {
    moveType: IGridMoveData = {
        type: GridMoveType.FREE,
        isOverride: false,
    };

    init(type: GridMoveType, isOverride: boolean = false): void {
        this.moveType.type = type;
        this.moveType.isOverride = isOverride;
    }

    reset(): void {}
}

/**增加格子移动类型系统 */
export class AddGridMoveTypeSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AddGridMoveTypeComp, RoomEnvironmentModelComp, PositionComp);
    }

    entityEnter(e: ECSEntity): void {
        let room = <RoomEntity>e.parent!;
        let pos = e.get(PositionComp).getPosition(true);
        let gridIndex = BattleUtil.getGridIndexByNodePos(pos, room);
        room.get(RoomGridMoveTypeComp).addGridMoveType(gridIndex, e.get(AddGridMoveTypeComp).moveType);

        //TODO：后续应判断这个格子是否有角色在，在就把它挤出去
    }
}
