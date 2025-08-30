import { AttributeType } from '../../common/help/CommonEnum';

/**角色属性 */
export interface RoleAttributeData {
    /** 攻击速度 */
    [AttributeType.atkSpeed]: number;
    /** 冷却缩减 */
    [AttributeType.cdReduce]: number;
    /**避障最大速度 */
    [AttributeType.maxVelocity]: number;
    /**避障权重 */
    [AttributeType.agentWeight]: number;
    /**最多同时使用魔法杖个数 */
    [AttributeType.maxUseStaffNum]: number;
}
