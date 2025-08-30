import { AttributeType } from '../../CommonEnum';
import { CorrectionAttributeData } from '../../CommonInterface';
import { BaseNumericMap } from '../base/BaseNumericMap';
import { CommonNumeric } from './CommonNumeric';

/**
 * 通用属性管理器
 * 用于管理通用属性，如HP、MP等
 */
export class CommonNumericMap extends BaseNumericMap<CommonNumeric> {
    /**
     * 创建通用属性实例
     */
    createNumeric(type: AttributeType): CommonNumeric {
        return new CommonNumeric(type);
    }

    /**
     * 获取属性
     */
    override get(type: AttributeType): CommonNumeric {
        return super.get(type);
    }

    /**
     * 添加属性修正
     */
    override addCorrection(type: AttributeType, data: CorrectionAttributeData): void {
        super.addCorrection(type, data);
    }

    /**
     * 移除属性修正
     */
    override removeCorrection(type: AttributeType, data: CorrectionAttributeData): void {
        super.removeCorrection(type, data);
    }

    /**
     * 获取属性当前值
     */
    override getValue(type: AttributeType): number {
        return super.getValue(type);
    }

    /**
     * 获取属性最大值
     */
    override getMaxValue(type: AttributeType): number {
        return super.getMaxValue(type);
    }

    /**
     * 获取属性基础值
     */
    override getBaseValue(type: AttributeType): number {
        return super.getBaseValue(type);
    }
}
