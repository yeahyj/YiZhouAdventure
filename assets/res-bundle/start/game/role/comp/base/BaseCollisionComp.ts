import { Vec3 } from 'cc';
import { cBody } from 'db://assets/res-bundle/base/extensions/cc-collision/Body';
import { cObject } from 'db://assets/res-bundle/base/extensions/cc-collision/Object';
import { ShapeType, cBox, cSphere, cPolygon } from 'db://assets/res-bundle/base/extensions/cc-collision/Shape';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 *  基础碰撞
 */
export class BaseCollisionComp extends cObject implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean = null!;
    ent: ecs.Entity = null!;

    initCollision(...args: any[]) {}

    /**首次碰撞 */
    onTriggerEnter(b: cBody, collisionPoint: Vec3 | null): void {}

    /**碰撞停留 */
    onTriggerStay(b: cBody, collisionPoint: Vec3 | null) {}

    /**
     * 碰撞退出
     * @param b 碰撞体
     * 注意b.object可能被清除了
     */
    onTriggerExit(b: cBody, collisionPoint: Vec3 | null) {}

    /**加入碰撞检测 */
    addCollision() {
        this.trigger = true;
    }

    /**取消碰撞检测 */
    removeCollision() {
        this.trigger = false;
    }

    //重新更新shape
    updateShape() {
        //创建碰撞形状
        switch (this.type) {
            case ShapeType.Box:
                this.shape = new cBox(this.center, this.size);
                break;
            case ShapeType.Sphere:
                this.shape = new cSphere(this.center, this.radius);
                break;
            case ShapeType.Polygon:
                this.shape = new cPolygon(this.center, this.points);
                break;
        }

        this.body.shape = this.shape; //绑定碰撞形状
    }

    reset(): void {
        this.trigger = false;
        this.removeBody();
    }
}
