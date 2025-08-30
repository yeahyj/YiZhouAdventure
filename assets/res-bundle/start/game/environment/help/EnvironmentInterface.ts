import { Vec2 } from 'cc';
import { RoomEnvironment } from '../../room/help/RoomInterface';
import {
    FloorType,
    WallType,
    DirectionType,
    BoxType,
    DoorType,
    TreasureChestType,
    DoorAnimationStateType,
    MapTransferType,
    MapTransferStateType,
} from './EnvironmentEnum';

/**地板 */
export interface FloorData extends RoomEnvironment {
    type: FloorType;
    data: { resType: string };
}

/**墙 */
export interface WallData extends RoomEnvironment {
    type: WallType;
    data: { resType: string; dir: DirectionType };
}

/**box */
export interface BoxData extends RoomEnvironment {
    type: BoxType;
}

/**地图传送门 */
export interface MapTransferData extends RoomEnvironment {
    type: MapTransferType;
    data: {
        /**状态 */
        state: MapTransferStateType;
        /**资源类型 */
        resType: string;
        /**方向 */
        dir: DirectionType;
        /**名称 */
        name: string;
        /**地图id */
        mapId: number;
    };
}

export interface DoorData extends RoomEnvironment {
    id: number;
    data: {
        /**door id */
        doorId: number;
        /**状态 */
        state: DoorAnimationStateType;
        /**下一个房间id */
        nextRoomId: number;
        /**下一个房间连接的门id */
        nextDoorId: number;
        /**下一个房间的偏移坐标 */
        nextRoomOffset: Vec2;
        /**门的偏移坐标 */
        offset: Vec2;
        /**资源类型 */
        resType: string;
        /**方向 */
        dir: DirectionType;
    };
    type: DoorType;
}

/**宝箱 */
export interface TreasureChestData extends RoomEnvironment {
    type: TreasureChestType;
    data: {
        /**宝箱等级 */
        lv: string;
        /**宝箱类型 */
        resType: string;
    };
}
