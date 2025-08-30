import { Vec3, v3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { DirectionComp } from './DirectionComp';
import { CommonAttributeComp } from './CommonAttributeComp';
import { AttributeType } from '../../common/help/CommonEnum';

/**
 * 移动组件
 */
@ecs.register('SpeedComp')
export class SpeedComp extends ecs.Comp {
    /**1帧的速度，具有方向性 */
    private _speed: Vec3 = v3(0, 0, 0);

    public get speed(): Vec3 {
        return this._speed;
    }
    public set speed(value: Vec3) {
        this._speed.x = value.x;
        this._speed.y = value.y;
    }

    reset(): void {}
}

/**速度系统 */
export class SpeedSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(SpeedComp, DirectionComp, CommonAttributeComp);
    }

    update(e: ecs.Entity) {
        let speedValue = 0;
        speedValue = e.get(CommonAttributeComp).attributes.getValue(AttributeType.speed);
        let dir = e.get(DirectionComp).direction;
        let speed = dir.multiplyScalar(speedValue);
        e.get(SpeedComp).speed = speed.multiplyScalar(this.dt);
    }

    private exit(e: ecs.Entity) {}
}
