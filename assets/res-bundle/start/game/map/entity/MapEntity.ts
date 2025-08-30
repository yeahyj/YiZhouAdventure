import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BaseEntity } from '../../common/entity/BaseEntity';
import { IsMapComp } from '../../common/comp/IsMapComp';
import { CameraFollowComp } from '../comp/CameraFollowComp';
import { MapModelComp } from '../comp/MapModelComp';

/** 游戏地图 */
@ecs.register('MapEntity')
export class MapEntity extends BaseEntity {
    protected init(): void {
        super.init();
        this.addComponents<ecs.Comp>(MapModelComp, CameraFollowComp, IsMapComp);
    }
}

export class MapSystem extends ecs.System {
    constructor() {
        super();
    }
}
