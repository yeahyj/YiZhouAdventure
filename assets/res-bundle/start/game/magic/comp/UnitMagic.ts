import { _decorator } from 'cc';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { Vec3, Quat } from 'cc';
import { CollisionBodyComp } from '../../role/comp/CollisionBodyComp';

const { ccclass, property } = _decorator;

/**
 *  基础魔法单位
 */
export class UnitMagic extends BaseUnit {
    initCustom(): void {
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            this.ent.add(atk);
        }
    }

    setRotationByDir(dir: Vec3) {
        let rotation = new Quat();
        // 从方向向量生成旋转四元数，假设dir是角度向量
        let angle = Math.atan2(dir.y, dir.x);
        Quat.fromAngleZ(rotation, (angle * 180) / Math.PI); // 修改为只使用y和z作为旋转角度
        this.node.setRotation(rotation);
    }
}
