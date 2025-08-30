import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoomEntity } from '../../room/entity/RoomEntity';

/**
 * 所在的房间组件
 */
@ecs.register('InRoomComp')
export class InRoomComp extends ecs.Comp {
    room: RoomEntity = null!;
    reset(): void {}
}
