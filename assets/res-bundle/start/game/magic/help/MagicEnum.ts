/**效果类型 */
export enum EffectType {
    /**增益 */
    buff = 'buff',
    /**减益 */
    debuff = 'debuff',
    /**动画 */
    animation = 'animation',
}

export enum AttackType {
    /**物理 */
    physical = 'physical',
    /**魔法 */
    magic = 'magic',
    /**中毒 */
    poison = 'poison',
    /**燃烧 */
    burn = 'burn',
    /**冰冻 */
    freeze = 'freeze',
    /**电击 */
    shock = 'shock',
    /**真实 */
    true = 'true',
    /**爆炸 */
    explosion = 'explosion',
}

/**技能插件类型 */
export enum SkillPluginType {
    /**运动轨迹 */
    skill = 'skill',
    /**修正   */
    modify = 'modify',
}

/** 技能插件影响 */
export enum SkillPluginInfluence {
    /**渲染 */
    render = 'render',
    /**移动 */
    move = 'move',
    /**多重施法 */
    multipleCast = 'multipleCast',
    /**触发 */
    trigger = 'trigger',
}
