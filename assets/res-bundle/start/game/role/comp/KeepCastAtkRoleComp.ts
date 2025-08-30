import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { Vec3 } from 'cc';
import { PositionComp } from './PositionComp';
import { StaffCastComp } from '../../magic/comp/StaffCastComp';
import { StaffDirectionComp } from '../../staff/comp/StaffDirectionComp';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import CommonUtil from '../../common/help/util/CommonUtil';
import { StaffBagComp } from './StaffBagComp';

/**
 * 角度计算工具
 */
class AngleUtil {
    /**
     * 标准化角度到0-360度范围
     */
    static normalizeAngle(angle: number): number {
        angle = angle % 360;
        return angle < 0 ? angle + 360 : angle;
    }

    /**
     * 计算两点之间的角度（0度为水平向右，90度为垂直向上）
     */
    static calculateAngle(from: Vec3, to: Vec3): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        return this.normalizeAngle((Math.atan2(dy, dx) * 180) / Math.PI);
    }

    /**
     * 获取最短旋转方向和距离
     */
    static getRotationInfo(currentAngle: number, targetAngle: number): { direction: number; distance: number } {
        let diff = targetAngle - currentAngle;
        // 标准化差值到[-180, 180]范围
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return {
            direction: Math.sign(diff),
            distance: Math.abs(diff),
        };
    }

    /**
     * 角度转向量
     */
    static angleToVec3(angle: number): Vec3 {
        const radian = (angle * Math.PI) / 180;
        return new Vec3(Math.cos(radian), Math.sin(radian), 0);
    }
}

/**
 * 持续施法 攻击角色
 */
@ecs.register('KeepCastAtkRoleComp')
export class KeepCastAtkRoleComp extends ecs.Comp {
    // 当前施法角度（度数）
    currentAngle: number = 0;
    // 每帧最大旋转角度
    readonly maxRotationPerFrame: number = 0.5;
    // 攻击目标
    target: ecs.Entity | null = null;
    // 缓存的目标位置
    private cachedTargetPos: Vec3 | null = null;
    // 缓存的自身位置
    private cachedSelfPos: Vec3 | null = null;
    // 上次更新时间
    private lastUpdateTime: number = 0;
    // 位置缓存更新间隔（秒）
    private readonly cacheUpdateInterval: number = 0.1;

    reset(): void {
        this.currentAngle = 0;
        this.target = null;
        this.cachedTargetPos = null;
        this.cachedSelfPos = null;
        this.lastUpdateTime = 0;
    }

    /**
     * 设置攻击目标
     */
    setTarget(target: ecs.Entity): void {
        if (this.target !== target) {
            this.target = target;
            this.cachedTargetPos = null;
            this.cachedSelfPos = null;
        }
    }

    /**
     * 更新施法角度
     */
    updateCastAngle(dt: number): void {
        if (!this.target || !this.target.has(PositionComp) || !this.ent.has(PositionComp)) return;

        const currentTime = Date.now() / 1000;

        // 更新位置缓存
        if (
            !this.cachedTargetPos ||
            !this.cachedSelfPos ||
            currentTime - this.lastUpdateTime >= this.cacheUpdateInterval
        ) {
            this.cachedTargetPos = this.target.get(PositionComp).getPosition();
            this.cachedSelfPos = this.ent.get(PositionComp).getPosition();
            this.lastUpdateTime = currentTime;
        }

        const targetAngle = AngleUtil.calculateAngle(this.cachedSelfPos, this.cachedTargetPos);
        const rotationInfo = AngleUtil.getRotationInfo(this.currentAngle, targetAngle);

        // 计算这一帧可以旋转的角度
        const actualRotation = Math.min(rotationInfo.distance, this.maxRotationPerFrame);

        // 更新当前角度
        this.currentAngle = AngleUtil.normalizeAngle(this.currentAngle + actualRotation * rotationInfo.direction);
    }

    /**
     * 获取当前方向向量
     */
    getCurrentDirection(): Vec3 {
        return AngleUtil.angleToVec3(this.currentAngle);
    }
}

/**持续施法 攻击角色系统 */
export class KeepCastAtkRoleSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate, ecs.IEntityRemoveSystem
{
    filter(): ecs.IMatcher {
        return ecs.allOf(KeepCastAtkRoleComp, PositionComp, StaffBagComp);
    }

    entityEnter(e: ECSEntity): void {
        this.initializeEntity(e);
    }

    update(e: ecs.Entity): void {
        const castComp = e.get(KeepCastAtkRoleComp);

        if (!this.validateTarget(castComp)) {
            this.exit(e);
            return;
        }

        // 更新施法角度
        castComp.updateCastAngle(this.dt);

        // 更新法杖方向
        this.updateStaffDirection(e, castComp);
    }

    entityRemove(e: ECSEntity): void {
        if (e.has(StaffCastComp)) {
            e.remove(StaffCastComp);
        }
    }

    private initializeEntity(e: ECSEntity): void {
        e.add(StaffCastComp);
        const staff = e.get(StaffBagComp).getUsingStaff();
        if (staff && staff.has(StaffDirectionComp)) {
            const dir = staff.get(StaffDirectionComp).direction;
            e.get(KeepCastAtkRoleComp).currentAngle = CommonUtil.vecToAngle(dir);
        }
    }

    private validateTarget(castComp: KeepCastAtkRoleComp): boolean {
        return castComp.target != null && castComp.target.has(PositionComp);
    }

    private updateStaffDirection(e: ecs.Entity, castComp: KeepCastAtkRoleComp): void {
        const staff = e.get(StaffBagComp).getUsingStaff();
        if (staff && staff.has(StaffDirectionComp)) {
            staff.get(StaffDirectionComp).direction = castComp.getCurrentDirection();
        }
    }

    private exit(e: ecs.Entity): void {
        if (e.has(StaffCastComp)) {
            e.remove(StaffCastComp);
        }
        e.remove(KeepCastAtkRoleComp);
    }
}
