import { Vec3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { MagicNumericMap } from '../help/MagicNumericMap';
import { CommonAttributeComp } from '../../role/comp/CommonAttributeComp';
import { getProjectileConfig } from 'db://assets/res-bundle/base/config/ProjectileConfig';
import { AttributeType } from '../../common/help/CommonEnum';
import { CommonAttributeData, CorrectionAttributeData, ChangeHpData } from '../../common/help/CommonInterface';
import { HpComp } from '../../role/comp/HpComp';

/**
 * 魔法数据,一个魔法实体，就只有一个投射物
 */
@ecs.register('MagicModelComp')
export class MagicModelComp extends ecs.Comp {
    /**投射物id */
    projectileId: number = 0;
    /**公共属性 */
    commonAttributes: CommonAttributeComp = null!;
    /** 魔法属性 */
    attributes: MagicNumericMap = null!;
    /**方向 */
    direction: Vec3 = new Vec3();
    /**散射角度 */
    scatteringAngle: number = 0;
    /**加成伤害 */
    atk: number = 0;
    /**额外暴击几率 */
    crit: number = 0;
    /**额外暴击伤害 */
    critDamage: number = 0;

    /**
     * 初始化魔法
     * @param data 魔法数据
     */
    init(data: { scatteringAngle: number; direction: Vec3; atk: number; crit: number; critDamage: number }) {
        this.direction = data.direction.clone();
        this.scatteringAngle = data.scatteringAngle;
        this.atk = data.atk;
        this.crit = data.crit;
        this.critDamage = data.critDamage;
    }

    /**
     * 初始化属性，在投射物创建时调用
     * @param projectileId 投射物id
     */
    initAttribute(projectileId: number) {
        this.projectileId = projectileId;
        let config = getProjectileConfig(projectileId)!;
        this.attributes = new MagicNumericMap();

        let commonAttributeData: CommonAttributeData = {
            [AttributeType.hp]: config.hp,
            [AttributeType.atk]: config.damage + this.atk,
            [AttributeType.speed]: config.speed,
            [AttributeType.crit]: config.crit + this.crit,
            [AttributeType.critDamage]: config.critDamage + this.critDamage,
            [AttributeType.reflectDamage]: 0,
            [AttributeType.hpRecover]: 0,
        };
        this.ent.add(CommonAttributeComp).init(commonAttributeData);
        this.commonAttributes = this.ent.get(CommonAttributeComp);

        let attributesData = {
            [AttributeType.lifeTime]: config.lifeTime,
            [AttributeType.atkMultiple]: config.atkMultiple,
        };
        this.attributes.init(attributesData);
        this.ent.get(HpComp).init(this.commonAttributes.attributes.getValue(AttributeType.hp));
    }

    addCorrection(type: AttributeType, data: CorrectionAttributeData) {
        this.attributes.addCorrection(type, data);
        if (type == AttributeType.hp) {
            let hpData: ChangeHpData = { isCrit: false, isShow: false, value: data.value };
            this.ent.get(HpComp).addHp(hpData);
        }
    }

    /**
     * 获取魔法属性
     * @param type SkillAttributeType 属性类型
     * @returns number
     */
    getAttribute(type: AttributeType): number {
        return this.attributes.get(type).getValue();
    }

    /**获取造成伤害 */
    getDamage(): { damage: number; isCrit: boolean } {
        let atk = this.commonAttributes.attributes.getValue(AttributeType.atk);
        //是否暴击
        let isCrit = Math.random() < this.commonAttributes.attributes.getValue(AttributeType.crit);
        let damage = atk * (isCrit ? this.commonAttributes.attributes.getValue(AttributeType.critDamage) : 1);
        return { damage: damage, isCrit: isCrit };
    }

    reset(): void {
        this.attributes.reset();
        this.direction.set(0, 0, 0);
        this.scatteringAngle = 0;
        this.atk = 0;
        this.crit = 0;
        this.critDamage = 0;
        this.projectileId = 0;
    }
}
