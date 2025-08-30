/**属性类型 */
export enum AttributeType {
    /** 生命 */
    hp = 'hp',
    /** 生命恢复 */
    hpRecover = 'hpRecover',
    /** 攻击 */
    atk = 'atk',
    /** 攻击速度 */
    atkSpeed = 'atkSpeed',
    /** 速度 */
    speed = 'speed',
    /** 暴击几率 */
    crit = 'crit',
    /** 暴击伤害 */
    critDamage = 'critDamage',
    /** 冷却缩减 */
    cdReduce = 'cdReduce',
    /** 反伤 */
    reflectDamage = 'reflectDamage',
    /** 避障最大速度 */
    maxVelocity = 'maxVelocity',
    /**避障权重 */
    agentWeight = 'agentWeight',
    /**最多同时使用魔法杖个数 */
    maxUseStaffNum = 'maxUseStaffNum',

    /**生存时间 */
    lifeTime = 'lifeTime',
    /**攻击倍数 */
    atkMultiple = 'atkMultiple',
}

/**背包类型 */
export enum BagType {
    /** 材料 */
    material,
    /** 魔法石 */
    magicStone,
    /** 道具 */
    prop,
}
/**技能类型 */
export enum SkillType {
    /** 普通攻击 */
    default = 1,
    /**近战 */
    melee,
    /**远程 */
    remote,
}

/**技能位置类型 */
export enum SkillPositionType {
    /**普通攻击 */
    normal = 1,
    /**技能 */
    skill,
}
//属性修正来源
export enum CorrectionSourceType {
    //技能
    SKILL,
    //正面 效果
    POSITIVE_EFFECT,
    //负面 效果
    NEGATIVE_EFFECT,
    //武器
    WEAPON,
    //装备
    EQUIP,
    //other
    OTHER,
}

//属性修正类型
export enum CorrectionType {
    //固定值
    FIXED,
    //修饰器
    MODIFIER,
    //成长
    GROWTH,
    //百分比
    PERCENTAGE,
}

export enum ItemType {
    // 武器
    STAFF = 'STAFF',
    // 道具
    PROP = 'PROP',
    // 魔法石
    MAGIC_STONE = 'MAGIC_STONE',
    // 材料
    MATERIAL = 'MATERIAL',
}

//方向权重
export enum DirectionWeight {
    /**无 */
    none = 0,
    /**自主移动 */
    move,
    /**施法静止不动 */
    castImmobility,
    /**黑洞 */
    blackHole,
    /**摇杆 */
    rocker,
    /**技能方向 */
    skill,
    /**限制移动 */
    restrictMove,
}

/**角色动画优先级 */
export enum RoleAnimationPriorityType {
    idle = 1,
    walk,
    attack01,
    skill01,
    death,
}

export enum FactionType {
    /**友方 */
    ALLY = 'ALLY',
    /**敌方 */
    ENEMY = 'ENEMY',
    /**中立 */
    NEUTRAL = 'NEUTRAL',
}
