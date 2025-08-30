/**法杖属性 */
export enum StaffAttributeType {
    /**是否乱序 */
    isDisorder = 'isDisorder',
    /**施法数 */
    castNum = 'castNum',
    /**释放延迟 */
    castDelay = 'castDelay',
    /**充能时间 */
    chargeTime = 'chargeTime',
    /**法力最大值 */
    mpMax = 'mpMax',
    /**法力充能速度 */
    mpChargeSpeed = 'mpChargeSpeed',
    /**容量 */
    capacity = 'capacity',
    /**散射 */
    scatter = 'scatter',
    /**魔法石 */
    magicStones = 'magicStone',
    /**魔法石上限 */
    magicStoneMax = 'magicStoneMax',
}

/**魔法石类型 */
export enum MagicStoneType {
    /** 投射物 */
    projectile = 'projectile',
    /** 修正 */
    correction = 'correction',
}

/**魔法石数据类型 */
export enum MagicStoneItemType {
    /** id */
    id = 'id',
    /** 容量 */
    capacity = 'capacity',
}

export enum StoneId {
    // 碰撞触发
    TriggerCollisionComp = 200301,
    // 定时触发
    TriggerTimingComp = 200302,
    // 死亡触发
    TriggerDeathComp = 200303,
    //爆炸
    BombExplosionComp = 100251,
}
