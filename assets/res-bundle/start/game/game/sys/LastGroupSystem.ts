import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { RoomUnitHierarchySystem } from '../../room/comp/RoomUnitHierarchyComp';
import { VFXHitFlashSystem } from '../../magic/comp/vfx/VFXHitFlashComp';
import { CameraFollowSystem } from '../../map/comp/CameraFollowComp';
import { DamageFlyTextSystem } from '../../role/comp/DamageFlyTextComp';
import { ResetDirectionSystem } from '../../role/comp/DirectionComp';
import { EquipStaffSystem } from '../../role/comp/EquipStaffComp';
import { MarkerCollisionSystem } from '../../common/comp/mark/MarkerCollisionComp';

/**
 * 最后组系统
 * 负责最后的一些系统
 */
export class LastGroupSystem extends ecs.System {
    constructor() {
        super();

        //这里靠后的系统
        this.add(new EquipStaffSystem());
        this.add(new CameraFollowSystem());
        this.add(new DamageFlyTextSystem());
        this.add(new ResetDirectionSystem());
        this.add(new RoomUnitHierarchySystem());
        //shader 特效

        this.add(new VFXHitFlashSystem());
        //shader 特效 结束

        //MARK 碰撞
        this.add(new MarkerCollisionSystem());
    }
}
