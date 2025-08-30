import { _decorator } from 'cc';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { NegativeEffectComp } from '../base/NegativeEffectComp';
import { PositionComp } from '../../../role/comp/PositionComp';
import { RoleModelComp } from '../../../role/comp/RoleModelComp';
import { DirectionComp } from '../../../role/comp/DirectionComp';
import { HpComp } from '../../../role/comp/HpComp';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { Vec3 } from 'cc';
import { CorrectionSourceType, CorrectionType, AttributeType, DirectionWeight } from '../../../common/help/CommonEnum';
import { CorrectionAttributeData } from '../../../common/help/CommonInterface';
import { CommonAttributeComp } from '../../../role/comp/CommonAttributeComp';

const { ccclass, property } = _decorator;

/**
 * 黑洞负效果,就是将这个实体拉扯到黑洞中心,而且距离中心越近，伤害越高
 */
@ccclass('BlackHoleNegativeEffectComp')
@ecs.register('BlackHoleNegativeEffectComp')
export class BlackHoleNegativeEffectComp extends NegativeEffectComp {
    //黑洞实体
    blackHoleEntity: ECSEntity[] = [];
    //修正属性
    correction: CorrectionAttributeData = {
        source: CorrectionSourceType.NEGATIVE_EFFECT,
        value: -100,
        type: CorrectionType.MODIFIER,
    };

    pushBlackHoleEntity(e: ECSEntity) {
        this.blackHoleEntity.push(e);
    }

    removeBlackHoleEntity(e: ECSEntity) {
        this.blackHoleEntity.splice(this.blackHoleEntity.indexOf(e), 1);
    }

    reset(): void {
        this.blackHoleEntity = [];
    }
}

/**黑洞负效果系统 */
export class BlackHoleNegativeEffectSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(BlackHoleNegativeEffectComp, RoleModelComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        let comp = e.get(BlackHoleNegativeEffectComp);
        //限制速度
        e.get(CommonAttributeComp).attributes.addCorrection(AttributeType.speed, comp.correction);
    }
    update(e: ECSEntity): void {
        let comp = e.get(BlackHoleNegativeEffectComp);
        for (let i = 0; i < comp.blackHoleEntity.length; i++) {
            let blackHoleEntity = comp.blackHoleEntity[i];
            if (!blackHoleEntity || !blackHoleEntity.get(EnabledComp) || blackHoleEntity.get(HpComp).currentHp <= 0) {
                comp.blackHoleEntity.splice(i, 1);
                i--;
            }
        }

        if (comp.affectNum <= 0) {
            this.removeComp(e);
            return;
        } else if (comp.blackHoleEntity.length <= 0) {
            this.removeComp(e);
            return;
        } else {
            let blackHoleEntity = comp.blackHoleEntity[0];
            //获取方向
            let direction = blackHoleEntity
                .get(PositionComp)
                .getPosition(true)
                .subtract(e.get(PositionComp).getPosition(true));
            //设置方向
            //如果距离过小，则不设置方向
            if (direction.length() < 2) {
                e.get(DirectionComp).setDirection({ dir: Vec3.ZERO, weight: DirectionWeight.blackHole });
            } else {
                e.get(DirectionComp).setDirection({ dir: direction.normalize(), weight: DirectionWeight.blackHole });
            }
        }
    }

    removeComp(e: ECSEntity): void {
        let comp = e.get(BlackHoleNegativeEffectComp);
        e.get(CommonAttributeComp).attributes.removeCorrection(AttributeType.speed, comp.correction);
        e.remove(BlackHoleNegativeEffectComp);
    }
}
