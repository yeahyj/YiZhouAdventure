import { Camera } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { MapEntity } from '../../map/entity/MapEntity';
import { RoleEntity } from '../../role/entity/RoleEntity';
import { GameEntity } from '../entity/GameEntity';
import { app } from 'db://assets/app/app';
import { Node } from 'cc';
import { RootGroupSystem } from '../sys/RootGroupSystem';

/**
 * 游戏模型组件
 */
@ecs.register('GameModelComp')
export class GameModelComp extends ecs.Comp {
    /**战斗控制实体 */
    gameEntity: GameEntity = null!;
    /**地图控制实体 */
    mapEntity: MapEntity = null!;
    /**玩家实体 */
    playerEntity: RoleEntity = null!;

    mapNode: Node = null!;
    /**地图摄像机 */
    mapCamera: Camera = null!;

    init(data: { mapNode: Node; mapCamera: Camera }): void {
        this.mapNode = data.mapNode;
        this.mapCamera = data.mapCamera;

        app.manager.battle.rootSys.add(new RootGroupSystem());

        // 游戏实体
        this.gameEntity = ecs.getEntity<GameEntity>(GameEntity);
    }

    addRoom(roomNode: Node): void {
        this.mapNode.addChild(roomNode);
    }

    reset(): void {}
}
