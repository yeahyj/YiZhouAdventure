import { Vec3, v3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { DirectionWeight } from '../../common/help/CommonEnum';

/**
 * 方向组件
 */
@ecs.register('DirectionComp')
export class DirectionComp extends ecs.Comp {
    /**方向 */
    _direction: Vec3 = v3(0, 0, 0);
    /** 权重 */
    weight: DirectionWeight = DirectionWeight.none;

    public get direction(): Vec3 {
        return Vec3.clone(this._direction);
    }
    public set direction(value: Vec3) {
        this._direction.x = value.x;
        this._direction.y = value.y;
    }

    /**
     *
     * @param data.dir 方向
     * @param data.weight 权重
     */
    setDirection(data: { dir: Vec3; weight: DirectionWeight }) {
        if (this.weight <= data.weight) {
            this._direction.x = data.dir.x;
            this._direction.y = data.dir.y;
            this.weight = data.weight;
            // if (this.ent.get(PlayerComp)) {
            //     console.log('setDirection', this.direction, this.weight);
            // }
        }
    }

    reset(): void {}
}

/**方向系统 */
export class ResetDirectionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(DirectionComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity) {
        e.get(DirectionComp).weight = DirectionWeight.none;
        e.get(DirectionComp).direction = v3(0, 0);
    }
}
