import { Camera, Vec3 } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { MapModelComp } from './MapModelComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { GameModelComp } from '../../game/comp/GameModelComp';

/**
 * 摄像机跟随组件
 */
@ecs.register('CameraFollowComp')
export class CameraFollowComp extends ecs.Comp {
    /**摄像机 */
    camera: Camera = null!;
    /**跟随的实体 */
    followEty: ecs.Entity | null = null;
    /**跟随的点 */
    followPos: Vec3 | null = null;

    reset(): void {}
}

/**摄像机跟随系统 */
export class CameraFollowSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(CameraFollowComp);
    }
    constructor() {
        super();
    }
    entityEnter(e: ecs.Entity): void {
        e.get(CameraFollowComp).camera = ecs.getSingleton(GameModelComp).mapCamera;
    }

    update(e: ecs.Entity): void {
        let comp = e.get(CameraFollowComp);
        if (comp.followPos) {
            this.setPos(comp, comp.followPos);
        } else if (comp.followEty) {
            this.setPos(comp, comp.followEty.get(PositionComp).getPosition(true));
        }
    }

    setPos(comp: CameraFollowComp, cameraPos: Vec3) {
        comp.followPos = null;
        const roomData = ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoomData();
        // 获取正交相机的高度
        const height = ecs.getSingleton(GameModelComp).mapCamera.orthoHeight * 2;
        const width = height * ecs.getSingleton(GameModelComp).mapCamera.camera.aspect;
        const halfMapWidth = (roomData.width * roomData.tileWidth) / 2;
        const halfMapHeight = (roomData.height * roomData.tileHeight) / 2;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        if (halfWidth > halfMapWidth) {
            cameraPos.x = 0;
        } else if (cameraPos.x + halfWidth > halfMapWidth) {
            cameraPos.x = halfMapWidth - halfWidth;
        } else if (cameraPos.x - halfWidth < -halfMapWidth) {
            cameraPos.x = -halfMapWidth + halfWidth;
        }

        if (halfHeight > halfMapHeight) {
            cameraPos.y = 0;
        } else if (cameraPos.y + halfHeight > halfMapHeight) {
            cameraPos.y = halfMapHeight - halfHeight;
        } else if (cameraPos.y - halfHeight < -halfMapHeight) {
            cameraPos.y = -halfMapHeight + halfHeight;
        }
        comp.camera.node.setPosition(cameraPos);
    }
}
