import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import BattleUtil from '../../../common/help/util/BattleUtil';
import { RoomModelComp } from '../../../room/comp/RoomModelComp';
import { RoomSizeType, RoomType } from '../../../room/help/RoomEnum';
import { StartBaseEnvNormal1Comp } from './baseEnvironment/StartBaseEnvNormal1Comp';
import { RoomEntity } from '../../../room/entity/RoomEntity';
import { MapModelComp } from '../MapModelComp';
import { GameModelComp } from '../../../game/comp/GameModelComp';
import { StartLayoutNormal1Comp } from './layout/StartLayoutNormal1Comp';
import { Vec3 } from 'cc';
import { FactionType } from '../../../common/help/CommonEnum';
import { app } from 'db://assets/app/app';
import { EnterRoomComp } from '../../../role/comp/EnterRoomComp';
import { IsPlayerComp } from '../../../common/comp/IsPlayerComp';
import { TestRoleAttributeComp } from '../../../role/comp/TestRoleAttributeComp';

const { ccclass, property } = _decorator;

/**
 * 地牢地图组件
 * 负责管理地牢地图的生成和房间创建
 */
@ccclass('MapStartComp')
@ecs.register('MapStartComp')
export class MapStartComp extends ecs.Comp {
    onAdd() {
        //TODO:这里应该加载资源
        //创建房间
        const roomEntity = ecs.getEntity<RoomEntity>(RoomEntity);
        let roomData = BattleUtil.getMapData(RoomSizeType.Start, RoomType.Start);
        //数据
        roomEntity.add(RoomModelComp).init({ roomData: roomData });
        //基础环境
        roomEntity.add(StartBaseEnvNormal1Comp);
        //布局
        roomEntity.add(StartLayoutNormal1Comp);
        //角色
        roomEntity.get(RoomModelComp).roomData.role.push({
            id: app.store.player.roleId,
            pos: new Vec3(0, 0, 0),
            faction: FactionType.ALLY,
            extraComp: [
                { comp: EnterRoomComp, data: { roomId: 1 } },
                { comp: IsPlayerComp },
                { comp: TestRoleAttributeComp },
            ],
        });

        ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addRoom(roomEntity);
    }

    reset(): void {}
}
