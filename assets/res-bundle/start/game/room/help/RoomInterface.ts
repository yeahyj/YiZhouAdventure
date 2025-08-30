import { Vec3 } from 'cc';
import { RoomType, RoomSizeType, GridMoveType } from './RoomEnum';
import { FactionType } from '../../common/help/CommonEnum';
import { CompCtor } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSModel';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { Vec2 } from 'cc';
import { DoorData, FloorData, WallData } from '../../environment/help/EnvironmentInterface';

export interface RoomData {
    /**房间id */
    id: number;
    /**房间层级 */
    layers: LayerData[];
    /**行数 */
    height: number;
    /**列数 */
    width: number;
    /**地图块高度 */
    tileHeight: number;
    /**地图块宽度 */
    tileWidth: number;
    /**房间类型 */
    type: RoomType;
    /**房间大小类型 */
    sizeType: RoomSizeType;
    /**房间大小 */
    size: Vec2;
    /**房间角色数据 */
    role: IRoomRole[];
    /**房间在地图上的位置 */
    pos: Vec3;
    /**基础环境 */
    baseEnvironment: { floor: FloorData[]; wall: WallData[]; door: DoorData[] };
    /**布局环境 */
    layoutEnvironment: RoomEnvironment[];
}

export interface LayerData {
    data: number[];
    id: number;
    name: string;
}

export interface RoomEnvironment {
    /**环境id */
    id: number;
    /**环境数据 */
    data?: any;
    /**环境位置，是位置索引 */
    posIndex: number;
    /**类型 */
    type: number;
}

export interface IRoomRole {
    /**角色id */
    id: number;
    /**位置 */
    pos: Vec3;
    /**阵营 */
    faction: FactionType;
    /**额外组件 */
    extraComp: { comp: CompCtor<ecs.IComp>; data?: any }[];
}

/**
 * 格子移动数据接口
 */
export interface IGridMoveData {
    /** 移动类型 */
    type: GridMoveType;
    /** 是否为强制覆盖类型 */
    isOverride: boolean;
}
