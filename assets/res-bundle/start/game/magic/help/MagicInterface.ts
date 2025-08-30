import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType } from '../../common/help/CommonEnum';
import { AttackType, EffectType } from './MagicEnum';

/**魔法属性 */
export interface MagicAttributeData {
    /** 攻击倍数 */
    [AttributeType.atkMultiple]: number;
    /** 生存时间 */
    [AttributeType.lifeTime]: number;
}

export interface AttackVisitorData {
    /**攻击者 */
    atkEntity: ecs.Entity;
    /**数值 */
    value: number;
    /**是否暴击 */
    isCrit: boolean;
    /**伤害类型 */
    atkType: AttackType;
    /**是否展示 */
    isShow: boolean;
    /**传递效果 */
    atkEffect: EffectData[];
}

/**效果数据 */
export interface EffectData {
    /**效果类型 */
    type: EffectType;
    /**组件id */
    compId: number;
    /**效果数据 */
    data: any;
}
