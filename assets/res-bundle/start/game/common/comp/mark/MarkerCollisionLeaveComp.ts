import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';

/**
 * 碰撞离开标记
 */
@ecs.register('MarkerCollisionLeaveComp')
export class MarkerCollisionLeaveComp extends ecs.Comp {
    /**碰撞实体 */
    public leave: ECSEntity[] = [];

    pushLeave(ent: ECSEntity) {
        this.leave.push(ent);
    }

    removeLeave(ent: ECSEntity) {
        this.leave = this.leave.filter((e) => e !== ent);
    }

    reset(): void {
        this.leave = [];
    }
}

/**碰撞离开系统 */
export class MarkerCollisionLeaveSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(MarkerCollisionLeaveComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        e.remove(MarkerCollisionLeaveComp);
    }
}
