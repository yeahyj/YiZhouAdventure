import { _decorator, PhysicsSystem, Vec3 } from 'cc';
import { cBody } from 'db://assets/res-bundle/base/extensions/cc-collision/Body';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { IsDropComp } from '../../drop/comp/IsDropComp';
import { BaseCollisionComp } from './base/BaseCollisionComp';
import { CollisionComp, CollisionEntityData } from './CollisionComp';
import { FactionTypeComp } from './FactionTypeComp';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { RoomCollisionComp } from '../../room/comp/collision/RoomCollisionComp';

const { ccclass } = _decorator;

/**
 * 物理碰撞体组件
 */
@ccclass('CollisionBodyComp')
@ecs.register('CollisionBodyComp', false)
export class CollisionBodyComp extends BaseCollisionComp {
    protected start(): void {
        this.body.group = this.ent.get(FactionTypeComp).bodyGroup;
        this.body.mask = PhysicsSystem.instance.collisionMatrix[this.ent.get(FactionTypeComp).bodyGroup];

        let inRoomComp = this.ent.get(InRoomComp);
        let room = inRoomComp.room;
        if (room) {
            room.get(RoomCollisionComp).addCollision(this);
        }
    }

    initCollision(): void {}

    /**首次碰撞 */
    onTriggerEnter(b: cBody, collisionPoint: Vec3 | null): void {
        super.onTriggerEnter(b, collisionPoint);
        if (b.group != PhysicsSystem.PhysicsGroup['ENEMYDET'] && b.group != PhysicsSystem.PhysicsGroup['ALLYDET']) {
            const targetEnt = b.object.getComponent(BaseUnit)!.ent;
            const collisionComp = this.ent.get(CollisionComp);
            if (collisionComp && targetEnt) {
                const collisionData: CollisionEntityData = {
                    entity: targetEnt,
                    point: collisionPoint,
                };
                collisionComp.enterEntities.push(collisionData);
            }
        }
    }

    /**碰撞停留 */
    onTriggerStay(b: cBody, collisionPoint: Vec3 | null) {
        super.onTriggerStay(b, collisionPoint);
        if (b.group != PhysicsSystem.PhysicsGroup['ENEMYDET'] && b.group != PhysicsSystem.PhysicsGroup['ALLYDET']) {
            const targetEnt = b.object.getComponent(BaseUnit)!.ent;
            const collisionComp = this.ent.get(CollisionComp);
            if (collisionComp && targetEnt) {
                const result = collisionComp.collisionMap.get(targetEnt.eid);
                if (result) {
                    result.collisionPoint = collisionPoint;
                }
            }
        }
    }

    /**碰撞退出 */
    onTriggerExit(b: cBody, collisionPoint: Vec3 | null) {
        super.onTriggerExit(b, collisionPoint);
        if (
            b.object &&
            b.object.node &&
            b.group != PhysicsSystem.PhysicsGroup['ENEMYDET'] &&
            b.group != PhysicsSystem.PhysicsGroup['ALLYDET']
        ) {
            const targetEnt = b.object.getComponent(BaseUnit)?.ent;
            const collisionComp = this.ent.get(CollisionComp);
            if (collisionComp && targetEnt && !this.ent.get(IsDropComp) && !targetEnt.get(IsDropComp)) {
                collisionComp.leaveEntities.push(targetEnt);
            }
        }
    }

    /**加入碰撞检测 */
    addCollision() {
        this.trigger = true;
    }

    /**取消碰撞检测 */
    removeCollision() {
        this.trigger = false;
    }
}
