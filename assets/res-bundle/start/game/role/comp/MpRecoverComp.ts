import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { RoleModelComp } from './RoleModelComp';

/**
 * 法力恢复
 */
@ecs.register('MpRecoverComp')
export class MpRecoverComp extends ecs.Comp {
    reset(): void { }
}

/**生命检测系统 */
export class MpRecoverSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MpRecoverComp, RoleModelComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        // let mpRecover = this.dt * e.get(RoleModelComp).getAttribute(AttributeType.mpRecover);
        // e.get(MpComp).addChangeMp({ value: mpRecover, isShow: false });
    }

    private exit(e: ecs.Entity) { }
}
