import { Vec3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';

/**
 * 碰撞标记数据
 */
export interface CollisionMark {
    /**碰撞的实体 */
    entity: ECSEntity;
    /**碰撞点 */
    point: Vec3 | null;
}

/**
 * 碰撞标记组件 - 纯数据存储
 * 用于标记当前帧发生的碰撞，供其他系统使用
 */
@ecs.register('MarkerCollisionComp')
export class MarkerCollisionComp extends ecs.Comp {
    /**当前帧的碰撞标记 */
    public marks: CollisionMark[] = [];

    /**
     * 添加碰撞标记
     */
    pushCollision(entity: ECSEntity, point: Vec3 | null): void {
        this.marks.push({ entity, point });
    }

    /**
     * 移除指定实体的碰撞标记
     */
    removeCollision(entity: ECSEntity): void {
        this.marks = this.marks.filter((mark) => mark.entity !== entity);
    }

    /**
     * 获取指定实体的碰撞标记
     */
    getCollision(entity: ECSEntity): CollisionMark | undefined {
        return this.marks.find((mark) => mark.entity === entity);
    }

    /**
     * 是否与指定实体发生碰撞
     */
    hasCollision(entity: ECSEntity): boolean {
        return this.marks.some((mark) => mark.entity === entity);
    }

    reset(): void {
        this.marks = [];
    }
}

/**
 * 碰撞标记系统
 * 负责清理过期的碰撞标记
 */
@ecs.register('MarkerCollisionSystem')
export class MarkerCollisionSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem
{
    entityRemove(entity: ECSEntity): void {
        console.log('entityRemove', entity);
    }
    filter(): ecs.IMatcher {
        return ecs.allOf(MarkerCollisionComp);
    }

    entityEnter(entity: ECSEntity): void {
        // 每帧结束时清理碰撞标记
        // 因为碰撞标记只用于当前帧的碰撞处理
        entity.remove(MarkerCollisionComp);
    }
}
