import { StaffAttributeType, MagicStoneItemType } from './StaffEnum';

/**法杖属性 */
export interface StaffAttributeData {
    [StaffAttributeType.isDisorder]: boolean;
    [StaffAttributeType.castNum]: number;
    [StaffAttributeType.castDelay]: number;
    [StaffAttributeType.chargeTime]: number;
    [StaffAttributeType.mpMax]: number;
    [StaffAttributeType.mpChargeSpeed]: number;
    [StaffAttributeType.capacity]: number;
    [StaffAttributeType.scatter]: number;
    [StaffAttributeType.magicStones]: (MagicStoneItemData | null)[];
    [StaffAttributeType.magicStoneMax]: number;
}

/**魔法石数据 */
export interface MagicStoneItemData {
    [MagicStoneItemType.id]: number;
    [MagicStoneItemType.capacity]: number;
}
