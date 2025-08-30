import { cCollider } from 'db://assets/res-bundle/base/extensions/cc-collision/Collider';
import { cObject } from 'db://assets/res-bundle/base/extensions/cc-collision/Object';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoomModelComp } from '../RoomModelComp';
import { BaseCollisionComp } from '../../../role/comp/base/BaseCollisionComp';

/**
 * 房间碰撞组件 - 管理房间内的碰撞体
 */
@ecs.register('RoomCollisionComp')
export class RoomCollisionComp extends ecs.Comp {
    /**房间专属的碰撞系统 */
    public collider: cCollider = null!;

    /**房间内的碰撞对象列表 */
    private collisionObjects: cObject[] = [];

    onAdd(): void {
        // 创建房间专属的碰撞系统
        this.collider = new cCollider();
    }

    /**
     * 添加碰撞对象到房间
     * @param obj 碰撞对象
     */
    addCollision(collisionComp: BaseCollisionComp): void {
        if (!this.collisionObjects.includes(collisionComp)) {
            this.collisionObjects.push(collisionComp);
            this.collider.insert(collisionComp.body);
        }
    }

    /**
     * 从房间移除碰撞对象
     * @param obj 碰撞对象
     */
    removeCollision(collisionComp: BaseCollisionComp): void {
        const index = this.collisionObjects.indexOf(collisionComp);
        if (index !== -1) {
            this.collisionObjects.splice(index, 1);
            // 如果房间处于激活状态，从碰撞系统中移除碰撞体
            this.collider.remove(collisionComp.body, false, true);
        }
    }

    reset(): void {
        // 清空碰撞对象列表
        this.collisionObjects = [];

        // 重置碰撞系统
        if (this.collider) {
            this.collider.reset();
        }
    }
}

/**
 * 房间碰撞系统 - 处理房间内的碰撞检测
 */
@ecs.register('RoomCollisionSystem')
export class RoomCollisionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomCollisionComp, RoomModelComp);
    }

    update(entity: ecs.Entity): void {
        const roomCollisionComp = entity.get(RoomCollisionComp);
        roomCollisionComp.collider.updateTrigger(this.dt);
    }
}
