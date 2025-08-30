import { AttributeType } from '../../../common/help/CommonEnum';
import { CorrectionAttributeData } from '../../../common/help/CommonInterface';
import { BaseNumericMap } from '../../../common/help/numeric/base/BaseNumericMap';
import { RoleNumeric } from './RoleNumeric';

/**
 * 角色数值管理器
 * 用于管理角色特有属性，如攻击力、防御力等
 */
export class RoleNumericMap extends BaseNumericMap<RoleNumeric> {
    /**
     * 创建角色属性实例
     */
    createNumeric(type: AttributeType): RoleNumeric {
        return new RoleNumeric(type);
    }

    /**
     * 获取属性
     */
    override get(type: AttributeType): RoleNumeric {
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
