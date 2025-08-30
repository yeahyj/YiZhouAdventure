import { AttributeType } from '../../common/help/CommonEnum';
import { BaseNumeric } from '../../common/help/numeric/base/BaseNumeric';

/**
 * 魔法属性类
 * 用于管理魔法的具体属性值和修正
 */
export class MagicNumeric extends BaseNumeric {
    constructor(type: AttributeType) {
        super(type);
    }

    /**
     * 获取属性类型
     */
    override getType(): AttributeType {
        return super.getType() as AttributeType;
    }

    /**
     * 计算当前值
     * 可以在这里添加角色特有的计算逻辑
     */
    protected override calculateValue(): number {
        return super.calculateValue();
    }

    /**
     * 计算最大值
     * 可以在这里添加角色特有的计算逻辑
     */
    protected override calculateMaxValue(): number {
        return super.calculateMaxValue();
    }
}
