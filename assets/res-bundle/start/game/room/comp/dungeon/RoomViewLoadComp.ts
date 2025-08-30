import { UITransform, UIOpacity } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { InRoomComp } from 'db://assets/res-bundle/start/game/common/comp/InRoomComp';
import BattleUtil from 'db://assets/res-bundle/start/game/common/help/util/BattleUtil';
import { BaseUnit } from 'db://assets/res-bundle/start/game/common/render/base/BaseUnit';
import { DoorNormalOpenComp } from 'db://assets/res-bundle/start/game/environment/comp/DoorNormalOpenComp';
import { RoomEnvironmentModelComp } from 'db://assets/res-bundle/start/game/environment/comp/RoomEnvironmentModelComp';
import { RoomEnvironmentEntity } from 'db://assets/res-bundle/start/game/environment/entity/RoomEnvironmentEntity';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { PositionComp } from 'db://assets/res-bundle/start/game/role/comp/PositionComp';
import { RoleModelComp } from 'db://assets/res-bundle/start/game/role/comp/RoleModelComp';
import { UnitComp } from 'db://assets/res-bundle/start/game/role/comp/UnitComp';
import { RoleEntity } from 'db://assets/res-bundle/start/game/role/entity/RoleEntity';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomEntity } from 'db://assets/res-bundle/start/game/room/entity/RoomEntity';
import { RoomType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';

/**
 * 房间视图加载
 */
@ecs.register('RoomViewLoadComp')
export class RoomViewLoadComp extends ecs.Comp {
    reset(): void {}
}

/**房间视图加载系统 */
export class RoomViewLoadSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoomViewLoadComp, RoomModelComp);
    }

    entityEnter(e: RoomEntity): void {
        this.createRoomNode(e);
    }

    createRoomNode(e: RoomEntity) {
        let roomData = e.get(RoomModelComp).roomData;
        let roomNode = BattleUtil.createRoomNode();
        roomNode.addComponent(UITransform);
        roomNode.addComponent(UIOpacity);
        roomNode.name = 'room' + roomData.id;
        roomNode.setPosition(0, 0, 0);
        e.add(UnitComp).initUnit(roomNode.addComponent(BaseUnit));
        ecs.getSingleton(GameModelComp).addRoom(roomNode);
        roomNode.active = roomData.type == RoomType.Start;

        //加载地板
        for (let i = 0; i < roomData.baseEnvironment.floor.length; i++) {
            let floorData = roomData.baseEnvironment.floor[i];
            let pos = BattleUtil.getNodePosByGridIndex(roomData.baseEnvironment.floor[i].posIndex, e);
            let floorEntity = ecs.getEntity<RoomEnvironmentEntity>(RoomEnvironmentEntity);
            floorEntity.add(RoomEnvironmentModelComp).init({ environmentData: floorData });
            floorEntity.add(InRoomComp).room = e;
            floorEntity.get(PositionComp).setPosition(pos);
            e.addChild(floorEntity);
        }

        //加载墙
        for (let i = 0; i < roomData.baseEnvironment.wall.length; i++) {
            let wall = roomData.baseEnvironment.wall[i];
            let pos = BattleUtil.getNodePosByGridIndex(roomData.baseEnvironment.wall[i].posIndex, e);
            let wallEntity = ecs.getEntity<RoomEnvironmentEntity>(RoomEnvironmentEntity);
            wallEntity.add(RoomEnvironmentModelComp).init({ environmentData: wall });
            wallEntity.add(InRoomComp).room = e;
            wallEntity.get(PositionComp).setPosition(pos);
            e.addChild(wallEntity);
        }

        //加载门
        for (let i = 0; i < roomData.baseEnvironment.door.length; i++) {
            let door = roomData.baseEnvironment.door[i];
            if (door.data.nextRoomId != null) {
                let pos = BattleUtil.getNodePosByGridIndex(roomData.baseEnvironment.door[i].posIndex, e);
                let doorEntity = ecs.getEntity<RoomEnvironmentEntity>(RoomEnvironmentEntity);
                doorEntity.add(RoomEnvironmentModelComp).init({ environmentData: door });
                doorEntity.add(InRoomComp).room = e;
                doorEntity.get(PositionComp).setPosition(pos);
                if (door.data.nextRoomId != null && door.data.nextRoomId != 0) {
                    doorEntity.add(DoorNormalOpenComp);
                }
                e.addChild(doorEntity);
            }
        }

        //加载布局环境
        let layoutEnvironment = roomData.layoutEnvironment;
        for (let i = 0; i < layoutEnvironment.length; i++) {
            let layout = layoutEnvironment[i];
            let pos = BattleUtil.getNodePosByGridIndex(layout.posIndex, e);
            let layoutEntity = ecs.getEntity<RoomEnvironmentEntity>(RoomEnvironmentEntity);
            layoutEntity.add(RoomEnvironmentModelComp).init({ environmentData: layout });
            layoutEntity.add(InRoomComp).room = e;
            layoutEntity.get(PositionComp).setPosition(pos);
            e.addChild(layoutEntity);
        }

        //加载角色
        let role = roomData.role;
        for (let i = 0; i < role.length; i++) {
            let roleData = role[i];
            let roleEntity = ecs.getEntity<RoleEntity>(RoleEntity);
            roleEntity.add(RoleModelComp).init({ roleData: roleData });
            roleEntity.get(PositionComp).setPosition(roleData.pos);
            roleEntity.add(InRoomComp).room = e;
            e.addChild(roleEntity);
            e.get(RoomModelComp).addRoleEntity(roleEntity);
        }
    }
}
