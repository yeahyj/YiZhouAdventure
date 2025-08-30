/**房间类型 */
export enum RoomType {
    /**开始房间 */
    Start = 'start',
    /**正常房间 */
    Normal = 'normal',
    /**魔法对战房间 */
    Battle = 'battle',
    /**boss房间 */
    Boss = 'boss',
}

/**房间大小类型 */
export enum RoomSizeType {
    /**开始 */
    Start = 'start',
    /**正常 */
    Normal = 'normal',
}

/**格子移动类型 */
export enum GridMoveType {
    /**可以随意移动 */
    FREE = 1,
    /**只可以飞行移动 */
    FLY,
    /**禁止移动 */
    BLOCK,
}
