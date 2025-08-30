/**Shader动画名字 */
export enum ShaderAnimationNameType {
    /** 白色状态 */
    white = 'white',
    /** 黑色状态 */
    black = 'black',
    /** 时光状态 */
    time = 'time',
    /** 石化状态 */
    stone = 'stone',
    /** 风沙状态 */
    sand = 'sand',
    /** 中毒状态 */
    poison = 'poison',
    /** 镜像状态 */
    mirror = 'mirror',
    /** 狂暴状态 */
    mad = 'mad',
    /** 金身状态 */
    invincible = 'invincible',
    /** 冰雪状态 */
    ice = 'ice',
    /** 冰封状态 */
    frozen = 'frozen',
    /** 着火状态 */
    fire = 'fire',
}
/**动画名字 */
export enum RoleAnimationStateType {
    // 角色动画
    IDLE = 'idle', //待机
    WALK = 'walk', // 跑动
    ATTACK01 = 'attack01', // 普通攻击1
    SKILL01 = 'skill01', // 技能攻击1
    DEATH = 'death', // 死亡
}

/**角色动画名字 */
export enum MovieNameType {
    /** 默认 */
    default = 1,
    /** 待机 */
    idle,
    /** 跑动 */
    walk,
    /** 近战攻击 */
    meleeAttack,
    /** 技能攻击 */
    skillAttack,
    /** 受伤 */
    hurt,
    /** 死亡 */
    death,
}

/**角色行为状态 */
export enum RoleBehaviorStateType {
    /**巡逻 */
    Patrol = 1,
    /**追击 */
    Chase,
    /**攻击 */
    Attack,
    /**空闲 */
    Idle,
    /**逃跑 */
    Flee,
}

//角色类型对应的id
export enum DungeonRoleId {
    /**逛街女孩 */
    DUNGEON_GIRL = 11001,
    /**苍蝇 */
    DUNGEON_FLY = 20001,
    /**boss苍蝇 */
    DUNGEON_FLY_BOSS = 30001,
}
