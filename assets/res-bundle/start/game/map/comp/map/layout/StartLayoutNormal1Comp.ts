import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import {
    DirectionType,
    EnvironmentId,
    MapTransferStateType,
    MapTransferType,
} from '../../../../environment/help/EnvironmentEnum';
import { MapTransferData } from '../../../../environment/help/EnvironmentInterface';
/**
 * 普通房间布局
 */
@ecs.register('StartLayoutNormal1Comp')
export class StartLayoutNormal1Comp extends ecs.Comp {
    reset(): void {}
}

/**普通房间布局系统 */
export class StartLayoutNormal1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(StartLayoutNormal1Comp, RoomModelComp);
    }

    entityEnter(e: ECSEntity): void {
        let roomData = e.get(RoomModelComp).roomData;
        // 添加地图传送门到elements
        let mapTransferData1: MapTransferData = {
            id: EnvironmentId.DUNGEON_MAP_TRANSFER,
            data: {
                resType: '100',
                state: MapTransferStateType.OPEN,
                dir: DirectionType.TOP,
                name: '冒险',
                mapId: 100101,
            },
            posIndex: 2,
            type: MapTransferType.NORMAL,
        };
        roomData.layoutEnvironment.push(mapTransferData1);

        let mapTransferData2: MapTransferData = {
            id: EnvironmentId.DUNGEON_MAP_TRANSFER,
            data: {
                resType: '101',
                state: MapTransferStateType.CLOSE,
                dir: DirectionType.TOP,
                name: '敬请期待',
                mapId: 1,
            },
            posIndex: 4,
            type: MapTransferType.NORMAL,
        };
        roomData.layoutEnvironment.push(mapTransferData2);
    }
}
