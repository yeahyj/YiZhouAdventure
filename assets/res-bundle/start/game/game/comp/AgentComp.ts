import { cCollider } from '../../../../base/extensions/cc-collision/Collider';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';

@ecs.register('AgentComp')
export class AgentComp extends ecs.Comp {
    reset(): void {}
}

/**碰撞检测系统 */
export class AgentSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(AgentComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        cCollider.inst.updateAgent(this.dt);
    }

    private exit(e: ecs.Entity) {}
}
