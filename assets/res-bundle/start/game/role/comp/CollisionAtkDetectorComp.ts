import { _decorator, PhysicsSystem, Vec3 } from 'cc';
import { cBody } from 'db://assets/res-bundle/base/extensions/cc-collision/Body';
import { Dirty } from 'db://assets/res-bundle/base/extensions/cc-collision/Object';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { RoleBehaviorStateType } from '../help/RoleEnum';
import { BaseCollisionComp } from './base/BaseCollisionComp';
import { DeathComp } from './death/DeathComp';
import { EnabledComp } from './EnabledComp';
import { FactionTypeComp } from './FactionTypeComp';
import { RoleBehaviorStateMachineComp } from './state/RoleBehaviorStateMachineComp';
import { IsRoleComp } from '../../common/comp/IsRoleComp';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { RoomCollisionComp } from '../../room/comp/collision/RoomCollisionComp';

const { ccclass, property } = _decorator;

/**
 * 攻击探测器碰撞
 */
@ccclass('CollisionAtkDetectorComp')
@ecs.register('CollisionAtkDetectorComp', false)
export class CollisionAtkDetectorComp extends BaseCollisionComp {
    chaseRadius: number = 500;

    protected start(): void {
        this.trigger = true;
        this.body.group = this.ent.get(FactionTypeComp).detectorGroup; // 设置检测器碰撞组
        this.body.mask = PhysicsSystem.instance.collisionMatrix[this.ent.get(FactionTypeComp).detectorGroup]; // 设置敌人碰撞组

        let room = this.ent.get(InRoomComp).room;
        if (room) {
            room.get(RoomCollisionComp).addCollision(this);
        }
    }

    initCollision(chaseRadius: number) {
        this.chaseRadius = chaseRadius;
        this.radius = chaseRadius;
        if (this.body) {
            this.updateShape();
        }
    }

    update(dt: number): void {
        //需要实时，同步更新 player 位置
        this.isDirty |= Dirty.T;
    }

    /**首次碰撞 */
    onTriggerEnter(b: cBody, collisionPoint: Vec3 | null): void {
        super.onTriggerEnter(b, collisionPoint);
    }

    /**碰撞停留 */
    onTriggerStay(b: cBody, collisionPoint: Vec3 | null) {
        super.onTriggerStay(b, collisionPoint);

        //找到了可以攻击的目标
        if (this.ent && this.ent.get(IsRoleComp)) {
            //世界中心坐标
            let cb = b.getCenter();
            let ca = this.body.getCenter();
            let lengthSqr = Vec3.squaredDistance(ca, cb);
            //真实距离
            let length = Math.sqrt(lengthSqr);

            let enemyEnt = b.object.getComponent(BaseUnit)!.ent;
            //攻击半径
            if (enemyEnt && enemyEnt.get(IsRoleComp) && !this.ent.get(DeathComp)) {
                //追踪敌人
                this.ent.get(RoleBehaviorStateMachineComp).changeState({
                    state: RoleBehaviorStateType.Chase,
                    data: { chaseEntity: enemyEnt },
                });
            }
        }
    }

    /**碰撞退出 */
    onTriggerExit(b: cBody, collisionPoint: Vec3 | null) {
        super.onTriggerExit(b, collisionPoint);
        if (this.ent && this.ent.get(EnabledComp)) {
            this.ent.get(RoleBehaviorStateMachineComp).changeState({
                state: RoleBehaviorStateType.Idle,
                data: null,
            });
        }
    }

    reset(): void {
        this.chaseRadius = 500;
    }
}
