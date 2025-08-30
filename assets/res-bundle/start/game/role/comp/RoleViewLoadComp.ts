import { RoleModelComp } from './RoleModelComp';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { Prefab, instantiate } from 'cc';
import { MapLayersType } from '../../../../../app-builtin/app-model/export.type';
import { app } from '../../../../../app/app';
import { IsPlayerComp } from '../../common/comp/IsPlayerComp';
import { EnabledComp } from './EnabledComp';
import { PositionComp } from './PositionComp';
import { BaseUnit } from '../../common/render/base/BaseUnit';
import { getRoleConfig } from '../../../../base/config/RoleConfig';
import { RoomModelComp } from '../../room/comp/RoomModelComp';
import { RoleEntity } from '../entity/RoleEntity';

/**
 * 角色视图加载组件
 */
@ecs.register('RoleViewLoadComp')
export class RoleViewLoadComp extends ecs.Comp {
    reset(): void {}
}

/**角色视图加载系统 */
export class RoleViewLoadSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleViewLoadComp, RoleModelComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: RoleEntity): void {
        let config = getRoleConfig(e.get(RoleModelComp).roleId)!;
        app.manager.loader.load({
            path: config.path,
            bundle: config.bundle,
            type: Prefab,
            onComplete: (result: Prefab | null) => {
                if (!e.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }
                if (!result) {
                    console.log('角色视图加载失败');
                    return;
                }

                let node = instantiate(result);
                if (e.get(IsPlayerComp)) {
                    node.name = 'player';
                }
                node.getComponent(BaseUnit)!.init({ e, id: e.get(RoleModelComp).roleId });
                e.parent?.get(RoomModelComp).addNode(node, MapLayersType.ENTITY);
                node.setPosition(e.get(PositionComp).getPosition());
            },
        });
        e.remove(RoleViewLoadComp);
    }
}
