import { Prefab, instantiate } from 'cc';
import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from '../../../../base/config/EnvironmentConfig';
import { getEnvironmentResConfig } from '../../../../base/config/EnvironmentResConfig';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { EnabledComp } from '../../role/comp/EnabledComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { RoomEnvironmentModelComp } from './RoomEnvironmentModelComp';
import { UnitComp } from '../../role/comp/UnitComp';
import { MapLayerNames, MapLayersType } from 'db://assets/app-builtin/app-model/export.type';

/**
 * 地图环境加载组件
 */
@ecs.register('RoomEnvironmentViewLoadComp')
export class RoomEnvironmentViewLoadComp extends ecs.Comp {
    reset(): void {}
}

/**
 * 地图环境加载系统
 */
@ecs.register('RoomEnvironmentViewLoadSystem')
export class RoomEnvironmentViewLoadSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomEnvironmentViewLoadComp, RoomEnvironmentModelComp);
    }

    entityEnter(e: ECSEntity): void {
        let environmentData = e.get(RoomEnvironmentModelComp).initData;
        let resConfig = getEnvironmentResConfig(environmentData.type);
        let baseConfig = getEnvironmentConfig(resConfig!.environmentId);
        app.manager.loader.load({
            path: baseConfig!.resPath + baseConfig!.prefabName,
            bundle: baseConfig!.prefabBundle,
            type: Prefab,
            onComplete: (result: Prefab | null) => {
                if (!result) {
                    console.error(`环境资源加载失败: ${baseConfig!.resPath + baseConfig!.prefabName}`);
                    return;
                }
                if (!e.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                let node = instantiate(result);
                node.getComponent(BaseUnit)!.init({ e: e, id: environmentData.type });
                let pos = e.get(PositionComp).getPosition();
                node.setPosition(pos);

                let parent = e.parent;
                if (parent) {
                    let mapLayerNode = parent
                        .get(UnitComp)
                        .unit.node.getChildByName('layer_' + MapLayerNames[MapLayersType.ENVIRONMENT])!;
                    mapLayerNode.addChild(node);
                }
            },
        });
    }
}
