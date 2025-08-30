import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { AttributeType } from '../../common/help/CommonEnum';
import { ChangeHpData } from '../../common/help/CommonInterface';
import { VFXHitFlashComp } from '../../magic/comp/vfx/VFXHitFlashComp';
import { CommonAttributeComp } from './CommonAttributeComp';
import { DamageFlyTextComp } from './DamageFlyTextComp';
import { DeathBeforeComp } from './death/DeathBeforeComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';

/**
 * HP变化数据
 */
export interface HpChangeData extends ChangeHpData {
    /**伤害来源 */
    source?: ecs.Entity;
    /**是否已处理 */
    handled?: boolean;
}

/**
 * 生命值组件 - 纯数据
 */
@ecs.register('HpComp')
export class HpComp extends ecs.Comp {
    /**当前生命值 */
    public currentHp: number = 0;
    /**HP变化队列 */
    public hpChanges: HpChangeData[] = [];

    init(maxHp: number) {
        this.currentHp = maxHp;
    }

    addHp(data: ChangeHpData, source?: ecs.Entity) {
        this.hpChanges.push({
            ...data,
            source,
            handled: false,
        });
    }

    reset(): void {
        this.currentHp = 0;
        this.hpChanges = [];
    }
}

/**
 * HP系统 - 处理生命值变化
 */
@ecs.register('HpSystem')
export class HpSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(HpComp, CommonAttributeComp);
    }

    update(entity: ecs.Entity): void {
        const hpComp = entity.get(HpComp);

        // 处理所有未处理的HP变化
        for (const change of hpComp.hpChanges) {
            if (change.handled) continue;

            // 应用HP变化
            let maxHp = entity.get(CommonAttributeComp).attributes.getMaxValue(AttributeType.hp);
            hpComp.currentHp = Math.min(maxHp, Math.max(0, hpComp.currentHp + change.value));

            // 处理伤害飘字
            if (change.isShow && entity.has(DamageFlyTextComp)) {
                entity.get(DamageFlyTextComp).addText(change.value);
            }

            // 处理受击特效
            if (change.value < 0 && entity.get(IsRoleComp)) {
                entity.add(VFXHitFlashComp);
            }

            // 处理死亡
            if (hpComp.currentHp <= 0) {
                entity.add(DeathBeforeComp);
            }

            change.handled = true;
        }

        // 清理已处理的HP变化
        hpComp.hpChanges = hpComp.hpChanges.filter((change) => !change.handled);
    }
}
