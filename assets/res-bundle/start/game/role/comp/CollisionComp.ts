import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { MarkerCollisionLeaveComp } from '../../common/comp/mark/MarkerCollisionLeaveComp';
import { MarkerCollisionComp } from '../../common/comp/mark/MarkerCollisionComp';
import { IsSkillComp } from '../../common/comp/IsSkillComp';
import { MagicModelComp } from '../../magic/comp/MagicModelComp';
import { EnabledComp } from './EnabledComp';
import { HpComp } from './HpComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';
import { Vec3 } from 'cc';
import { getProjectileConfig } from '../../../../base/config/ProjectileConfig';
import { CommonAttributeComp } from './CommonAttributeComp';
import { IsRoomEnvironmentComp } from '../../common/comp/IsRoomEnvironmentComp';
import { AttributeType } from '../../common/help/CommonEnum';
import { ChangeHpData } from '../../common/help/CommonInterface';

/**
 * 碰撞实体数据
 */
export interface CollisionEntityData {
    entity: ecs.Entity;
    point: Vec3 | null;
}

/**
 * 碰撞结果数据
 */
interface CollisionResult {
    time: number;
    ent: ecs.Entity;
    collisionPoint: Vec3 | null;
}

/**
 * 碰撞组件 - 纯数据存储
 */
@ecs.register('CollisionComp')
export class CollisionComp extends ecs.Comp {
    /**当前帧新增的碰撞实体 */
    public enterEntities: CollisionEntityData[] = [];
    /**当前帧离开的碰撞实体 */
    public leaveEntities: ecs.Entity[] = [];
    /**所有碰撞中的实体及其数据 */
    public collisionMap: Map<number, CollisionResult> = new Map();
    /**是否开启碰撞检测 */
    public enabled: boolean = true;

    reset(): void {
        this.enterEntities = [];
        this.leaveEntities = [];
        this.collisionMap.clear();
        this.enabled = true;
    }
}

/**
 * 碰撞系统 - 处理碰撞逻辑
 */
@ecs.register('CollisionSystem')
export class CollisionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(CollisionComp);
    }

    update(entity: ecs.Entity): void {
        const collisionComp = entity.get(CollisionComp);
        if (!collisionComp.enabled) return;

        // 处理新增碰撞
        for (const collisionData of collisionComp.enterEntities) {
            const target = collisionData.entity;
            if (!collisionComp.collisionMap.has(target.eid)) {
                collisionComp.collisionMap.set(target.eid, {
                    time: 0,
                    ent: target,
                    collisionPoint: collisionData.point,
                });
                this.handleCollisionEnter(entity, target, collisionData.point);
            }
        }
        collisionComp.enterEntities = [];

        // 更新现有碰撞
        collisionComp.collisionMap.forEach((result, targetEid) => {
            const target = result.ent;
            if (!target.get(EnabledComp)) {
                collisionComp.collisionMap.delete(targetEid);
                return;
            }

            result.time += this.dt;
            if (this.shouldProcessCollision(entity, target, result.time)) {
                this.processCollision(entity, target, result.collisionPoint);
                result.time = 0;
            }
        });

        // 处理离开碰撞
        for (const target of collisionComp.leaveEntities) {
            this.handleCollisionExit(entity, target);
            collisionComp.collisionMap.delete(target.eid);
        }
        collisionComp.leaveEntities = [];
    }

    private shouldProcessCollision(source: ecs.Entity, target: ecs.Entity, time: number): boolean {
        // 根据实体类型和配置决定碰撞间隔
        let interval = 999;

        if (source.has(IsSkillComp)) {
            const config = getProjectileConfig(source.get(MagicModelComp).projectileId)!;
            interval = Math.min(interval, config.collisionInterval);
        }

        if (source.has(IsRoleComp) && target.has(IsRoleComp)) {
            interval = Math.min(interval, 3);
        }

        return time >= interval;
    }

    private handleCollisionEnter(source: ecs.Entity, target: ecs.Entity, point: Vec3 | null): void {
        if (!target.has(EnabledComp)) return;

        // 添加碰撞标记
        source.add(MarkerCollisionComp).pushCollision(target, point);

        // 处理伤害
        this.processDamage(source, target);
    }

    private handleCollisionExit(source: ecs.Entity, target: ecs.Entity): void {
        source.add(MarkerCollisionLeaveComp);
        source.get(MarkerCollisionLeaveComp).pushLeave(target);
    }

    private processCollision(source: ecs.Entity, target: ecs.Entity, point: Vec3 | null): void {
        if (!target.has(EnabledComp)) return;

        // 添加碰撞标记
        source.add(MarkerCollisionComp).pushCollision(target, point);

        // 处理伤害
        this.processDamage(source, target);
    }

    private processDamage(source: ecs.Entity, target: ecs.Entity): void {
        const damageData = this.calculateDamage(source, target);
        if (!damageData) return;

        const hpComp = target.get(HpComp);
        if (hpComp) {
            hpComp.addHp(damageData);
        }
    }

    private calculateDamage(source: ecs.Entity, target: ecs.Entity): ChangeHpData | null {
        let damage: number;
        let isCrit = false;

        if (source.has(IsSkillComp)) {
            const result = source.get(MagicModelComp).getDamage();
            damage = result.damage;
            isCrit = result.isCrit;
        } else if (source.has(IsRoomEnvironmentComp)) {
            return null;
        } else {
            damage = source.get(CommonAttributeComp).attributes.getValue(AttributeType.atk);
        }

        if (target.has(IsSkillComp) || target.has(IsRoomEnvironmentComp)) {
            damage = 1;
            isCrit = false;
        }

        return {
            value: -damage,
            isCrit,
            isShow: !target.has(IsSkillComp) && !target.has(IsRoomEnvironmentComp),
        };
    }
}
