import { StaffAttributeType } from './StaffEnum';

/**法杖属性描述 */
export const StaffAttributeDesc = {
    [StaffAttributeType.isDisorder]: '是否乱序',
    [StaffAttributeType.castNum]: '施法数',
    [StaffAttributeType.castDelay]: '施法延迟',
    [StaffAttributeType.chargeTime]: '充能时间',
    [StaffAttributeType.mpMax]: '法力最大值',
    [StaffAttributeType.mpChargeSpeed]: '法力充能速度',
    [StaffAttributeType.capacity]: '容量',
    [StaffAttributeType.scatter]: '散射',
    [StaffAttributeType.magicStones]: '魔法石',
    [StaffAttributeType.magicStoneMax]: '魔法石上限',
};
