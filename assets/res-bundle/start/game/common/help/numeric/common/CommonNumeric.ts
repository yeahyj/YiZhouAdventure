import { BaseNumeric } from '../base/BaseNumeric';
import { AttributeType } from '../../CommonInterface';

/**
 * 通用属性类
 * 用于管理HP、MP等通用属性
 */
export class CommonNumeric extends BaseNumeric {
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
     * 可以在这里添加通用属性特有的计算逻辑
     */
    protected override calculateValue(): number {
        return super.calculateValue();
    }

    /**
     * 计算最大值
     * 可以在这里添加通用属性特有的计算逻辑
     */
    protected override calculateMaxValue(): number {
        return super.calculateMaxValue();
    }
}
