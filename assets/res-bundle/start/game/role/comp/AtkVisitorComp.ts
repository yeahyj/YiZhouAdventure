import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType } from '../../common/help/CommonEnum';
import { MagicModelComp } from '../../magic/comp/MagicModelComp';
import { AttackType } from '../../magic/help/MagicEnum';
import { EffectData, AttackVisitorData } from '../../magic/help/MagicInterface';
import { CommonAttributeComp } from './CommonAttributeComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';

/**攻击访问者 */
@ecs.register('AtkVisitorComp')
export class AtkVisitorComp extends ecs.Comp {
    /**攻击类型 */
    atkType: AttackType = null!;
    /**攻击效果 */
    atkEffect: EffectData[] = [];
    /**是否展示 */
    isShow: boolean = false;
    getAttackVisitor(): AttackVisitorData {
        let damageData: { damage: number; isCrit: boolean };
        if (this.ent.get(IsMagicComp)) {
            //技能伤害
            damageData = this.ent.get(MagicModelComp).getDamage();
        } else {
            //角色反伤
            damageData = {
                damage: this.ent.get(CommonAttributeComp).attributes.getValue(AttributeType.reflectDamage),
                isCrit: false,
            };
        }
        return {
            value: damageData.damage,
            isCrit: damageData.isCrit,
            atkType: this.atkType,
            isShow: this.isShow,
            atkEffect: this.atkEffect,
            atkEntity: this.ent,
        };
    }

    reset(): void {}
}
