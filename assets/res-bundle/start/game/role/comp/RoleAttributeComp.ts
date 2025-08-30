import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType } from '../../common/help/CommonEnum';
import { CorrectionAttributeData, ChangeHpData } from '../../common/help/CommonInterface';
import { RoleNumericMap } from '../help/numeric/RoleNumericMap';
import { RoleAttributeData } from '../help/RoleInterface';
import { HpComp } from './HpComp';

const { ccclass, property, menu } = _decorator;

/**
 *  角色属性
 */
@ecs.register('RoleAttributeComp')
export class RoleAttributeComp extends ecs.Comp {
    /** 角色属性 */
    attributes: RoleNumericMap = null!;

    init(data: RoleAttributeData) {
        this.attributes = new RoleNumericMap();
        this.attributes.init(data as Partial<Record<AttributeType, number>>);
    }

    /**
     * 添加修正属性
     * @param type 属性类型
     * @param data 修正属性数据
     */
    addCorrection(type: AttributeType, data: CorrectionAttributeData) {
        this.attributes.addCorrection(type, data);
        if (type == AttributeType.hp) {
            let hpData: ChangeHpData = { isCrit: false, isShow: false, value: data.value };
            this.ent.get(HpComp).addHp(hpData);
        }
    }

    /**
     * 移除修正属性
     * @param type 属性类型
     * @param data 修正属性数据
     */
    removeCorrection(type: AttributeType, data: CorrectionAttributeData) {
        this.attributes.removeCorrection(type, data);
        if (type == AttributeType.hp) {
            let hpData: ChangeHpData = { isCrit: false, isShow: false, value: data.value };
            this.ent.get(HpComp).addHp(hpData);
        }
    }

    reset(): void {}
}
