import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';

/**
 * 寻找了敌人
 */
@ecs.register('MarkerFindEnemyComp')
export class MarkerFindEnemyComp extends ecs.Comp {
    //当前时间
    curTime: number = 5;
    reset(): void {
        this.curTime = 5;
    }
}

/**寻找了敌人系统 */
export class MarkerFindEnemySystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MarkerFindEnemyComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        e.remove(MarkerFindEnemyComp);
    }
}
