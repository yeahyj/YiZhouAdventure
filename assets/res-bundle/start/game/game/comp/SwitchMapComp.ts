import { js } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { getGameMapConfig } from '../../../../base/config/GameMapConfig';
import { GameModelComp } from './GameModelComp';
import { MapEntity } from '../../map/entity/MapEntity';

/**切换地图组件 */
@ecs.register('SwitchMapComp')
export class SwitchMapComp extends ecs.Comp {
    mapId: number = null!;
    reset(): void {
        this.mapId = null!;
    }
}

/**切换地图系统 */
export class SwitchMapSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(SwitchMapComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        //销毁旧的地图
        let oldMapEntity = ecs.getSingleton(GameModelComp).mapEntity;
        //创建新的地图
        ecs.getSingleton(GameModelComp).mapEntity = ecs.getEntity<MapEntity>(MapEntity);
        oldMapEntity?.destroy();

        //加载地图
        let comp = e.get(SwitchMapComp);
        let config = getGameMapConfig(comp.mapId)!;
        ecs.getSingleton(GameModelComp).mapEntity.add(js.getClassByName(config.className) as any);
        e.remove(SwitchMapComp);
    }
}
