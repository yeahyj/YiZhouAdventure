import { AttributeType } from './CommonEnum';

/**属性对应的描述 */
export const AttributeDesc = {
    [AttributeType.hp]: '生命',
    [AttributeType.hpRecover]: '生命恢复',
    [AttributeType.atk]: '攻击',
    [AttributeType.atkSpeed]: '攻击速度',
    [AttributeType.speed]: '速度',
    [AttributeType.crit]: '暴击',
    [AttributeType.critDamage]: '暴击伤害',
    [AttributeType.cdReduce]: '冷却缩减',
    [AttributeType.reflectDamage]: '反伤',
    [AttributeType.maxVelocity]: '避障最大速度',
    [AttributeType.agentWeight]: '避障权重',
    [AttributeType.maxUseStaffNum]: '最多同时使用魔法杖个数',
    [AttributeType.lifeTime]: '生存时间',
    [AttributeType.atkMultiple]: '攻击倍数',
};
