import { AttributeType, BagType, CorrectionSourceType, CorrectionType, ItemType } from './CommonEnum';

/**公共属性 */
export interface CommonAttributeData {
    /** 生命 */
    [AttributeType.hp]: number;
    /** 生命恢复 */
    [AttributeType.hpRecover]: number;
    /** 攻击 */
    [AttributeType.atk]: number;
    /** 速度 */
    [AttributeType.speed]: number;
    /** 反伤 */
    [AttributeType.reflectDamage]: number;
    /** 暴击 */
    [AttributeType.crit]: number;
    /** 暴击伤害 */
    [AttributeType.critDamage]: number;
}

export interface BagItemData {
    /** 类型 */
    type: BagType;
    /**id */
    id: number;
    /** 数量 */
    num: number;
}

export interface AnimationEventData {
    /**动画名称 */
    name: string;
    /**开始回调 */
    onStart?: () => void;
    /**动画单次播放完毕 */
    onComplete?: () => void;
}

/**技能数据 */
export interface SkillData {
    id: number;
    radius: number;
    cd: number;
}

export interface StateBase {
    enter(): void;
    update(dt: number): void;
    exit(): void;
}
/**
 * 属性修正数据
 */
export interface CorrectionAttributeData {
    /** 修正来源 */
    source: CorrectionSourceType;
    /** 修正值 */
    value: number;
    /** 修正类型 */
    type: CorrectionType;
    /** 优先级 */
    priority?: number;
}

/**
 * 数值装饰器基础接口
 */
export interface INumericDecorator {
    /** 属性类型 */
    readonly attribute: string;
    /** 属性数值 */
    readonly value: number;
    /** 是否是百分比 */
    readonly isPercentage?: boolean;
    /** 优先级 */
    readonly priority?: number;
    /** 修正来源 */
    readonly source?: CorrectionSourceType;
}
export interface ChangeHpData {
    /**是否暴击 */
    isCrit: boolean;
    /**数值 */
    value: number;
    /**是否展示 */
    isShow: boolean;
}

export interface ItemData {
    /** 物品类型 */
    type: ItemType;
    /** 物品ID */
    id: string;
    /** 物品数量 */
    count: number;
}
