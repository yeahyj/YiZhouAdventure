import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseCollisionComp } from './base/BaseCollisionComp';
import { PhysicsSystem } from 'cc';

const { ccclass, property, menu } = _decorator;

/**
 *  移动碰撞
 */
@ccclass('CollisionFootComp')
@ecs.register('CollisionFootComp', false)
export class CollisionFootComp extends BaseCollisionComp {
    /**每秒最大避障速度 */
    maxVelocityBySecond: number = 0;

    protected start(): void {
        this.body.group = PhysicsSystem.PhysicsGroup['FOOT'];
        this.body.mask = PhysicsSystem.instance.collisionMatrix[PhysicsSystem.PhysicsGroup['FOOT']];

        // let room = this.ent.get(InRoomComp).room;
        // if (room) {
        //     room.get(RoomCollisionComp).addCollision(this);
        // }
    }

    initCollision(maxVelocityBySecond: number): void {
        this.maxVelocityBySecond = maxVelocityBySecond;
    }

    reset(): void {
        this.maxVelocityBySecond = 0;
    }
}
