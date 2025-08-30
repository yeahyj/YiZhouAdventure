import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { SpeedComp } from './SpeedComp';
import { CollisionFootComp } from './CollisionFootComp';

/**
 * 速度避障修正
 */
@ecs.register('SpeedObstacleAvoidanceComp')
export class SpeedObstacleAvoidanceComp extends ecs.Comp {
    /**避障时间间隔 */
    avoidTime: number = 0.2;
    /**当前避障时间 */
    curAvoidTime: number = 0;

    reset(): void {}
}

/**速度避障修正系统 */
export class SpeedObstacleAvoidanceSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(SpeedObstacleAvoidanceComp, CollisionFootComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity) {
        let oAComp = e.get(SpeedObstacleAvoidanceComp);
        let speedComp = e.get(SpeedComp);
        let foot = e.get(CollisionFootComp);
        if (oAComp.curAvoidTime > oAComp.avoidTime) {
            foot.tryVelocity = speedComp.speed;
            foot.velocity = speedComp.speed;
            foot.body.maxVelocity = foot.maxVelocityBySecond * this.dt;
            oAComp.curAvoidTime = 0;
        }
        oAComp.curAvoidTime += this.dt;
    }

    private exit(e: ecs.Entity) {}
}
