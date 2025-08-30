export enum DoorAnimationStateType {
    OPEN = 'open',
    CLOSE = 'close',
}

//地图传送门状态
export enum MapTransferStateType {
    OPEN = 'open',
    CLOSE = 'close',
}

//环境实体对应的id
export enum EnvironmentId {
    /**墙 */
    DUNGEON_WALL = 100101,
    /**门 */
    DUNGEON_DOOR = 100201,
    /**地板 */
    DUNGEON_FLOOR = 100301,
    /**箱子 */
    DUNGEON_BOX = 100401,
    /**宝箱 */
    DUNGEON_TREASURE_CHEST = 100501,
    /**地图传送门 */
    DUNGEON_MAP_TRANSFER = 100601,
}

//宝箱类型
export enum TreasureChestType {
    //战利品
    LOOT = 500101,
}

//门类型
export enum DoorType {
    NORMAL = 200101,
}

//地板类型
export enum FloorType {
    NORMAL = 300101,
    START = 300201,
}

//墙类型
export enum WallType {
    NORMAL = 100101,
}

//箱子类型
export enum BoxType {
    NORMAL = 400101,
}

//地图传送门类型
export enum MapTransferType {
    NORMAL = 600101,
}

//方向类型
export enum DirectionType {
    NONE = '0',
    RIGHT = '1',
    RIGHT_TOP = '2',
    TOP = '3',
    LEFT_TOP = '4',
    LEFT = '5',
    LEFT_BOTTOM = '6',
    BOTTOM = '7',
    RIGHT_BOTTOM = '8',
}

//宝箱类型
export enum TreasureChestAnimationStateType {
    OPEN = 'open',
    CLOSE = 'close',
}

//进入格子状态
export enum StateEnterGirdState {
    /**进入 */
    ENTER = 'enter',
    /**持续 */
    CONTINUE = 'continue',
}
