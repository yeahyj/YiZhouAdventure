import { Vec3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { UnitComp } from './UnitComp';
import { DirectionComp } from './DirectionComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { IsStaffComp } from '../../common/comp/IsStaffComp';
import { IsSkillComp } from '../../common/comp/IsSkillComp';

/**
 * 位置
 */
@ecs.register('PositionComp')
export class PositionComp extends ecs.Comp {
    private position: Readonly<Vec3> = new Vec3();
    //身体角度
    bodyAngle: number = 0;

    reset(): void {
        this.position.set(0, 0, 0);
    }

    /**
     * 设置实体的位置
     * @param x - x坐标或Vec3位置向量
     * @param y - y坐标或是否刷新标志
     * @param isRefresh - 是否刷新单位节点位置
     */
    setPosition(x: number, y: number, isRefresh?: boolean): void;
    setPosition(pos: Vec3, isRefresh?: boolean): void;
    setPosition(xOrPos: number | Vec3, yOrIsRefresh?: number | boolean, isRefresh?: boolean): void {
        // 处理传入数字坐标的情况
        if (typeof xOrPos === 'number' && typeof yOrIsRefresh === 'number') {
            this.position.set(xOrPos, yOrIsRefresh, 0);
            isRefresh = isRefresh ?? false;
        }
        // 处理传入Vec3向量的情况
        else if (xOrPos instanceof Vec3) {
            this.position.set(xOrPos);
            isRefresh = (yOrIsRefresh as boolean) ?? false;
        }
        // 处理无效参数的情况
        else {
            throw new Error('Invalid arguments for setPosition');
        }

        // 如果需要刷新且单位节点存在，则更新单位节点的位置
        let unitNode = this.ent.get(UnitComp) ? this.ent.get(UnitComp).unit : null;
        if (unitNode && isRefresh) {
            unitNode.setPosition(this.position);
        }
    }

    /**
     * 获取实体位置
     * @param clone 是否克隆位置对象
     * @param target 目标向量，用于存储克隆结果
     * @returns 实体位置的Vec3对象
     */
    getPosition(clone: boolean = false, target?: Vec3): Vec3 {
        if (clone) {
            // 如果需要克隆，则返回新的Vec3对象
            return target ? target.set(this.position) : new Vec3(this.position);
        } else {
            // 如果不需要克隆，则直接返回原始位置对象
            return this.position;
        }
    }
}

/**位置系统 */
export class PositionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(PositionComp, UnitComp).anyOf(IsRoleComp, IsMagicComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity) {
        let unitNode = e.get(UnitComp).unit;
        if (unitNode && unitNode.node) {
            let pos = e.get(PositionComp).getPosition();
            let dir = e.get(DirectionComp).direction;
            unitNode.setPosition(pos);
            if (e.get(IsSkillComp) && dir.length() > 0) {
                unitNode.setRotationByDir(dir);
            } else if (e.get(IsRoleComp)) {
                unitNode.setDirection(dir);
            }
        } else {
            return;
        }
    }
}

/**武器位置系统 */
export class WeaponPositionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(PositionComp, IsStaffComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity) {
        let master = e.parent;
        if (master) {
            let pos = master.get(PositionComp).getPosition();
            e.get(PositionComp).setPosition(pos);
        }
    }

    private exit(e: ecs.Entity) {}
}
