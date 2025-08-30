import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { PositionComp } from './PositionComp';
import { MapModelComp } from '../../map/comp/MapModelComp';
import { v3 } from 'cc';
import BattleUtil from '../../common/help/util/BattleUtil';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { RoomModelComp } from '../../room/comp/RoomModelComp';
import { UnitComp } from './UnitComp';
import { MapLayersType } from 'db://assets/app-builtin/app-model/export.type';
import { RoleEntity } from '../entity/RoleEntity';
import { RoomCollisionComp } from '../../room/comp/collision/RoomCollisionComp';
import { CollisionBodyComp } from './CollisionBodyComp';

/**进入房间组件 */
@ecs.register('EnterRoomComp')
export class EnterRoomComp extends ecs.Comp {
    /**进入的房间id */
    roomId: number = null!;
    /**进入的门id */
    doorId: number | null = null;

    init(data: { roomId: number; doorId: number }) {
        this.roomId = data.roomId;
        this.doorId = data.doorId;
    }

    reset(): void {}
}

/**进入房间系统 */
export class EnterRoomSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(EnterRoomComp, UnitComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: RoleEntity): void {
        let mapModel = ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp);
        //先移除碰撞体
        mapModel.getRoom()?.get(RoomCollisionComp).removeCollision(e.get(CollisionBodyComp));
        if (e.parent) {
            e.parent.removeChild(e, false);
        }

        let enterRoomComp = e.get(EnterRoomComp);
        console.log('EnterRoomComp init roomId:', enterRoomComp.roomId, 'doorId:', enterRoomComp.doorId);
        mapModel.enterRoom(enterRoomComp.roomId);

        //先把角色随从移动新房间
        //再移动角色
        mapModel.getRoom()!.get(RoomModelComp).addNode(e.get(UnitComp).unit!.node, MapLayersType.ENTITY);
        mapModel.getRoom()!.get(RoomModelComp).addRoleEntity(e);
        e.isActive = true;
        mapModel.getRoom()!.addChild(e);
        //还要重新移动碰撞体
        mapModel.getRoom()!.get(RoomCollisionComp).addCollision(e.get(CollisionBodyComp));

        //重新设置角色位置，如果有门，就在门的前面格子出来
        let playerPos = v3(0, 0);
        let doorId = enterRoomComp.doorId;
        if (doorId) {
            let allDoorData = mapModel.getRoomData().baseEnvironment.door;
            let doorData = allDoorData.find((door) => door.data.doorId == doorId);
            if (doorData) {
                let doorPos = doorData.posIndex;
                let doorTilePos = BattleUtil.getGridPosByGridIndex(doorPos);

                let playerTitlePos = v3(doorTilePos.x - doorData.data.offset.x, doorTilePos.y + doorData.data.offset.y);

                console.log('门位置:', doorTilePos, '门方向:', doorData.data.dir, '玩家位置:', playerTitlePos);

                playerPos = BattleUtil.getNodePosByGridPos(playerTitlePos);
            }
        }
        e.get(PositionComp).setPosition(playerPos, true);
        e.remove(EnterRoomComp);
    }
}
