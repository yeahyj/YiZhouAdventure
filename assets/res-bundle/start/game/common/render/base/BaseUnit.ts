import { Component } from 'cc';
import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { Vec3, Quat } from 'cc';
import { CollisionBodyComp } from '../../../role/comp/CollisionBodyComp';
import { CollisionAtkDetectorComp } from '../../../role/comp/CollisionAtkDetectorComp';
import { CollisionFootComp } from '../../../role/comp/CollisionFootComp';
import { v3 } from 'cc';
import { UnitComp } from '../../../role/comp/UnitComp';
import { ViewComp } from '../../../role/comp/ViewComp';
import { BaseViewComp } from '../../comp/base/BaseViewComp';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';

const { ccclass, property } = _decorator;

/**
 *  基础单位
 */
export class BaseUnit extends Component {
    @property(BaseViewComp)
    public view: BaseViewComp | null = null;

    ent: ECSEntity = null!;
    id: number | undefined;

    init(data: { e: ecs.Entity; id?: number }) {
        this.ent = data.e;
        this.id = data.id;
    }

    protected onLoad(): void {
        if (this.ent) {
            this.initUnit();
            this.initCustom();
        }
    }

    initUnit() {
        this.ent.add(UnitComp).initUnit(this);

        if (this.view) {
            this.ent.add(ViewComp).initView(this.view);
        }
    }

    /**自定义初始化 */
    initCustom(...data: any[]) {}

    setPosition(position: Vec3) {
        //TODO:后面稳定了就不重复设置
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            atk.setPosition(position);
        }

        let det = this.getComponent(CollisionAtkDetectorComp);
        if (det) {
            det.setPosition(position);
        }

        let foot = this.getComponent(CollisionFootComp);
        if (foot) {
            foot.setPosition(position);
        }

        this.node.position = position;
    }

    setRotation(rotation: Quat) {
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            atk.setRotation(rotation);
        }

        let det = this.getComponent(CollisionAtkDetectorComp);
        if (det) {
            det.setRotation(rotation);
        }

        let foot = this.getComponent(CollisionFootComp);
        if (foot) {
            foot.setRotation(rotation);
        }

        this.node.rotation = rotation;
    }

    setRotationByDir(dir: Vec3) {
        // 创建旋转四元数
        let rotation = new Quat();
        // 从方向向量生成旋转四元数，假设dir是角度向量
        let angle = Math.atan2(dir.y, dir.x);
        Quat.fromAngleZ(rotation, (angle * 180) / Math.PI); // 修改为只使用y和z作为旋转角度
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            atk.setRotation(rotation);
        }

        let det = this.getComponent(CollisionAtkDetectorComp);
        if (det) {
            det.setRotation(rotation);
        }

        let foot = this.getComponent(CollisionFootComp);
        if (foot) {
            foot.setRotation(rotation);
        }
    }

    setScale(scale: Vec3) {
        let atk = this.getComponent(CollisionBodyComp);
        if (atk) {
            atk.setScale(scale);
        }

        let det = this.getComponent(CollisionAtkDetectorComp);
        if (det) {
            det.setScale(scale);
        }

        let foot = this.getComponent(CollisionFootComp);
        if (foot) {
            foot.setScale(scale);
        }

        this.node.scale = scale;
    }

    setDirection(dir: Vec3) {
        //如果是朝左，则翻转
        if (!this.view) {
            return;
        }
        let scale = this.view.node.scale;
        if (dir.x < 0) {
            this.setScale(v3(-scale.x, scale.y, scale.z));
        } else if (dir.x > 0) {
            this.setScale(v3(scale.x, scale.y, scale.z));
        }
    }

    /**加入碰撞检测 */
    addCollision(type?: ('foot' | 'atk')[]) {
        type = type ?? ['foot', 'atk'];
        for (let i = 0; i < type.length; i++) {
            if (type[i] == 'atk') {
                let atk = this.getComponent(CollisionBodyComp);
                if (atk) {
                    atk.trigger = true;
                }
            }
        }
    }

    /**取消碰撞检测 */
    removeCollision(type?: ('foot' | 'atk' | 'atkDetector')[]) {
        type = type ?? ['foot', 'atk', 'atkDetector'];
        for (let i = 0; i < type.length; i++) {
            if (type[i] == 'atk') {
                let atk = this.getComponent(CollisionBodyComp);
                if (atk) {
                    atk.trigger = false;
                }
            } else if (type[i] == 'atkDetector') {
                let atkDetector = this.getComponent(CollisionAtkDetectorComp);
                if (atkDetector) {
                    atkDetector.trigger = false;
                }
            } else if (type[i] == 'foot') {
                let foot = this.getComponent(CollisionFootComp);
                if (foot) {
                    foot.trigger = false;
                }
            }
        }
    }
}
