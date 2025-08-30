import { Node } from 'cc';
import { MapLayersType } from '../../../../../app-builtin/app-model/export.type';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { RoomModelComp } from '../../room/comp/RoomModelComp';
import { RoomEntity } from '../../room/entity/RoomEntity';
import { UnitComp } from '../../role/comp/UnitComp';

/**地图数据 */
@ecs.register('MapModelComp')
export class MapModelComp extends ecs.Comp {
    roomEntity: Map<number, RoomEntity> = new Map();
    lastRoomId: number | null = null;
    nowRoomId: number = null!;
    reset(): void {}

    enterRoom(roomId: number) {
        this.lastRoomId = this.nowRoomId;
        this.nowRoomId = roomId;
        //隐藏其他节点
        for (const room of this.roomEntity.values()) {
            let isShow = room.get(RoomModelComp).roomData.id == roomId;
            room.get(UnitComp).unit!.node.active = isShow;
            room.isActive = isShow;
        }
    }

    addNodeToRoom(node: Node, layer: MapLayersType, roomId: number = this.nowRoomId) {
        let roomModel = this.getRoom(roomId)!.get(RoomModelComp);
        roomModel.addNode(node, layer);
    }

    addRoom(roomEntity: RoomEntity) {
        let id = this.roomEntity.size + 1;
        roomEntity.get(RoomModelComp).roomData.id = id;
        this.roomEntity.set(id, roomEntity);
        this.ent.addChild(roomEntity);
    }

    getRoom(roomId: number = this.nowRoomId) {
        return this.roomEntity.get(roomId);
    }

    getRoomData(roomId: number = this.nowRoomId) {
        return this.getRoom(roomId)!.get(RoomModelComp).roomData;
    }
}
