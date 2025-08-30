import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { Vec3 } from 'cc';
import { PositionComp } from './PositionComp';
import { _decorator } from 'cc';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { RestrictMoveComp } from './RestrictMoveComp';

const { ccclass, property } = _decorator;

/**
 * 定向飞行移动组件
 */
@ccclass('DirectionalFlyMoveComp')
@ecs.register('DirectionalFlyMoveComp')
export class DirectionalFlyMoveComp extends BaseMagicStoneComp {
    //飞行速度
    flySpeed: number = 1000;
    //飞行方向
    flyDirection: Vec3 = new Vec3(0, 0, 0);
    //飞行目的地
    flyTarget: Vec3 = new Vec3(0, 0, 0);
    //最大飞行时间
    maxFlyTime: number = 2;
    //当前飞行时间
    curFlyTime: number = 0;

    reset(): void {
        this.flyDirection = new Vec3(0, 0, 0);
        this.flyTarget = new Vec3(0, 0, 0);
        this.flySpeed = 1000;
        this.maxFlyTime = 5;
        this.curFlyTime = 0;
        super.reset();
    }
}

/**禁足系统 */
export class DirectionalFlyMoveSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(DirectionalFlyMoveComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        let comp = e.get(DirectionalFlyMoveComp);
        comp.flyDirection = comp.flyTarget.clone().subtract(e.get(PositionComp).getPosition(true));
        e.add(RestrictMoveComp).coolTime = 999;
    }

    update(e: ECSEntity): void {
        let comp = e.get(DirectionalFlyMoveComp);
        let positionComp = e.get(PositionComp);
        let currentPosition = positionComp.getPosition(true);
        let distanceToTarget = currentPosition.clone().subtract(comp.flyTarget).length();

        if (distanceToTarget <= comp.flySpeed * this.dt) {
            positionComp.setPosition(comp.flyTarget);
            e.remove(DirectionalFlyMoveComp);
        } else {
            let moveStep = comp.flyDirection
                .clone()
                .normalize()
                .multiplyScalar(comp.flySpeed * this.dt);
            positionComp.setPosition(currentPosition.add(moveStep));
            comp.curFlyTime += this.dt;
        }

        if (comp.curFlyTime >= comp.maxFlyTime) {
            e.remove(DirectionalFlyMoveComp);
        }
    }

    entityRemove(e: ECSEntity): void {
        e.remove(RestrictMoveComp);
    }
}
