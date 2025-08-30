import { _decorator } from 'cc';
import { MagicMoveComp } from '../base/MagicMoveComp';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { Vec3 } from 'cc';
import { DirectionComp } from '../../../role/comp/DirectionComp';
import { MagicModelComp } from '../MagicModelComp';
import { IsMagicComp } from '../../../common/comp/IsMagicComp';

const { ccclass, property, menu } = _decorator;
/**
 * 直线运动
 */
@ccclass('MagicMoveLinearComp')
@ecs.register('MagicMoveLinearComp')
export class MagicMoveLinearComp extends MagicMoveComp {
    //角度
    direction: Vec3;

    reset(): void {
        this.direction = null;
    }
}

/**移动系统 */
export class MagicMoveLinearSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(MagicMoveLinearComp, MagicModelComp, IsMagicComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        let data = e.get(MagicModelComp);
        //随机散射角度，-scatteringAngle和scatteringAngle之间
        let scatteringAngle = data.scatteringAngle;
        let angle = Math.random() * scatteringAngle * 2 - scatteringAngle;
        let direction = data.direction.clone();
        // 计算旋转矩阵
        let radian = angle * (Math.PI / 180); // 将角度转换为弧度
        let cos = Math.cos(radian);
        let sin = Math.sin(radian);

        // 应用旋转矩阵到当前方向向量
        let newX = direction.x * cos - direction.y * sin;
        let newY = direction.x * sin + direction.y * cos;

        // 设置新的方向向量
        direction.x = newX;
        direction.y = newY;
        e.get(MagicMoveLinearComp).direction = direction;
    }

    update(e: ecs.Entity): void {
        let direction = e.get(MagicMoveLinearComp).direction;
        e.get(DirectionComp).direction = direction;
    }

    private exit(e: ecs.Entity) {}
}
