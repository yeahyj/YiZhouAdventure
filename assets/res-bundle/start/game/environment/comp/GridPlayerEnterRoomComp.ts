import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { EnterRoomComp } from '../../role/comp/EnterRoomComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { StateEnterGirdState } from '../help/EnvironmentEnum';
import { DoorData } from '../help/EnvironmentInterface';
import { RoomEnvironmentModelComp } from './RoomEnvironmentModelComp';
import { StateEnterGirdComp } from './state/StateEnterGirdComp';

/**
 * 格子进入房间组件
 */
@ecs.register('GridPlayerEnterRoomComp')
export class GridPlayerEnterRoomComp extends ecs.Comp {
    reset(): void {}
}

/**格子进入房间系统 */
export class GridPlayerEnterRoomSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(GridPlayerEnterRoomComp, RoomEnvironmentModelComp, PositionComp, StateEnterGirdComp);
    }

    update(entity: ECSEntity): void {
        if (entity.get(StateEnterGirdComp).state == StateEnterGirdState.ENTER) {
            let player = ecs.getSingleton(GameModelComp).playerEntity;
            if (!player) {
                return;
            }

            let doorData = <DoorData>entity.get(RoomEnvironmentModelComp).initData;
            ecs.getSingleton(GameModelComp)
                .playerEntity.add(EnterRoomComp)
                .init({ roomId: doorData.data.nextRoomId, doorId: doorData.data.nextDoorId });
        }
    }
}
