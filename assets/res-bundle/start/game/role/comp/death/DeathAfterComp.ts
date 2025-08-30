import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { DeathComp } from './DeathComp';

/**
 * 死亡后
 * 用来死亡逻辑
 */
@ecs.register('DeathAfterComp')
export class DeathAfterComp extends ecs.Comp {
    /**结束事件个数 */
    endEventCount: number = 0;

    addEndEventCount(): void {
        this.endEventCount++;
    }

    reset(): void {
        this.endEventCount = 0;
    }
}

/**死亡后系统 */
export class DeathAfterSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(DeathAfterComp);
    }

    constructor() {
        super();
    }

    update(e: ECSEntity): void {
        let comp = e.get(DeathAfterComp);
        if (comp.endEventCount == 0) {
            e.add(DeathComp);
            e.remove(DeathAfterComp);
        }
    }
}
