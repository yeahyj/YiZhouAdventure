import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { UnitComp } from '../UnitComp';
import { DeathAfterComp } from './DeathAfterComp';

/**
 * 死亡前
 * 用来处理死亡时的其他逻辑
 */
@ecs.register('DeathBeforeComp')
export class DeathBeforeComp extends ecs.Comp {
    /**结束事件个数 */
    endEventCount: number = 0;

    addEndEventCount(): void {
        this.endEventCount++;
    }

    reset(): void {
        this.endEventCount = 0;
    }
}

/**死亡前系统 */
export class DeathBeforeSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.ISystemUpdate, ecs.IEntityEnterSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathBeforeComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        if (!e.get(UnitComp) || !e.get(UnitComp).unit) {
            console.error('DeathBeforeSystem entityEnter error', e);
        }
        e.get(UnitComp)?.unit?.removeCollision();
    }

    update(e: ECSEntity): void {
        let comp = e.get(DeathBeforeComp);
        if (comp.endEventCount == 0) {
            e.add(DeathAfterComp);
            e.remove(DeathBeforeComp);
        }
    }
}
