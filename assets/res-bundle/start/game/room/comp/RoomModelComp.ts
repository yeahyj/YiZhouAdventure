import { MapLayersType, MapLayerNames } from 'db://assets/app-builtin/app-model/export.type';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { FactionType } from '../../common/help/CommonEnum';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { UnitComp } from '../../role/comp/UnitComp';
import { RoleEntity } from '../../role/entity/RoleEntity';
import { RoomData } from '../help/RoomInterface';
import { Node } from 'cc';
import { StateRoomNoEnemyComp } from './StateRoomNoEnemyComp';

/**
 * 房间数据组件
 */
@ecs.register('RoomModelComp')
export class RoomModelComp extends ecs.Comp {
    /**房间数据 */
    roomData: RoomData = null!;

    /**打开的门的位置  */
    openDoorPos: Map<number, boolean> = new Map();
    /**所有角色实体 */
    allRoleEntity: Map<FactionType, RoleEntity[]> = new Map();

    init(data: { roomData: RoomData }) {
        this.roomData = data.roomData;
    }

    addNode(node: Node, layer: MapLayersType) {
        let layerNode = this.ent.get(UnitComp).unit.node.getChildByName('layer_' + MapLayerNames[layer]);
        if (layerNode && layerNode.uuid != node.uuid) {
            layerNode.addChild(node);
        }
    }

    addRoleEntity(entity: RoleEntity) {
        let faction = entity.get(FactionTypeComp).faction;
        let list = this.allRoleEntity.get(faction);
        if (!list) {
            list = [];
            this.allRoleEntity.set(faction, list);
        }
        list.push(entity);

        //如果没有敌人了，就新增状态
        this.checkAddStateRoomNoEnemy();
    }

    removeEntity(entity: RoleEntity) {
        let faction = entity.get(FactionTypeComp).faction;
        let list = this.allRoleEntity.get(faction);
        if (list) {
            list.splice(list.indexOf(entity), 1);
        }

        //如果没有敌人了，就新增状态
        this.checkAddStateRoomNoEnemy();
    }

    //判断是否需要新增没有敌人状态
    private checkAddStateRoomNoEnemy() {
        if (!this.allRoleEntity.get(FactionType.ENEMY) || this.allRoleEntity.get(FactionType.ENEMY)!.length == 0) {
            if (!this.ent.has(StateRoomNoEnemyComp)) {
                this.ent.add(StateRoomNoEnemyComp);
            }
        } else {
            if (this.ent.has(StateRoomNoEnemyComp)) {
                this.ent.remove(StateRoomNoEnemyComp);
            }
        }
    }

    reset(): void {
        this.allRoleEntity.clear();
        this.openDoorPos.clear();
        this.roomData = null!;
    }
}
