import { _decorator, Vec3, Quat } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { UnitComp } from '../../role/comp/UnitComp';
import { StaffCastPositionComp } from '../comp/StaffCastPositionComp';
import { Node } from 'cc';

const { ccclass, property } = _decorator;

/**
 *  基础单位
 */
@ccclass('UnitStaff')
export class UnitStaff extends BaseUnit {
    @property(Node)
    public castPos: Node = null!;

    init(data: { e: ecs.Entity; id?: number }) {
        data.e.add(UnitComp).initUnit(this);
        let castPos = this.castPos.getComponent(StaffCastPositionComp);
        if (castPos) {
            data.e.add(castPos);
        }
    }

    setRotationByDir(dir: Vec3) {
        let rotation = new Quat();
        let dirX = dir.x;
        let dirY = dir.y;
        if (this.node.scale.x < 0) {
            dirY = -dirY;
        }
        let angle = Math.atan2(dirY, dirX);

        // 重新设置rotation以确保看起来正常
        if (Math.abs(this.node.scale.x) < 0) {
            // 检查绝对值
            angle -= Math.PI; // 反转回正常角度
        }
        Quat.fromAngleZ(rotation, (angle * 180) / Math.PI);
        this.node.setRotation(rotation);
    }

    setScale(roleScale: Vec3) {
        this.node.setScale(roleScale);
    }
}
