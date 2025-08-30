import { _decorator, Vec3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import CommonUtil from 'db://assets/res-bundle/start/game/common/help/util/CommonUtil';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
import { RoomEntity } from 'db://assets/res-bundle/start/game/room/entity/RoomEntity';
import { RoomType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';
import { RoomData } from 'db://assets/res-bundle/start/game/room/help/RoomInterface';
import { DungeonRoomBattleComp } from '../../../room/comp/dungeon/battleRoom/DungeonRoomBattleComp';
import { DungeonRoomBossComp } from '../../../room/comp/dungeon/bossRoom/DungeonRoomBossComp';
import { DungeonRoomNormalComp } from '../../../room/comp/dungeon/normalRoom/DungeonRoomNormalComp';
import { DungeonRoomStartComp } from '../../../room/comp/dungeon/startRoom/DungeonRoomStartComp';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { MapModelComp } from 'db://assets/res-bundle/start/game/map/comp/MapModelComp';
import { app } from 'db://assets/app/app';
import { FactionType } from 'db://assets/res-bundle/start/game/common/help/CommonEnum';
import { EnterRoomComp } from 'db://assets/res-bundle/start/game/role/comp/EnterRoomComp';
import { IsPlayerComp } from 'db://assets/res-bundle/start/game/common/comp/IsPlayerComp';

const { ccclass, property } = _decorator;

/**
 * 地牢地图组件
 * 负责管理地牢地图的生成和房间创建
 */
@ccclass('MapDungeonComp')
@ecs.register('MapDungeonComp')
export class MapDungeonComp extends ecs.Comp {
    onAdd() {
        this.createMapRooms();
        this.connectRooms();
    }

    /**
     * 创建地牢房间
     */
    private createMapRooms() {
        // 创建起始房
        this.createStartRoom();

        // 创建普通房
        this.createNormalRooms();

        // 创建对战房
        this.createBattleRooms();

        // 创建Boss房
        this.createBossRoom();
    }

    /**连接房间 */
    private connectRooms() {
        let unConnectedRooms: RoomEntity[] = [];
        let connectedRooms: RoomEntity[] = [];
        let startRoom: RoomEntity = null!;
        let bossRoom: RoomEntity = null!;

        let unConnectedNormalRooms: RoomEntity[] = [];
        // 收集所有房间
        for (let child of this.ent.children.values()) {
            if (child instanceof RoomEntity) {
                const model = child.get(RoomModelComp);

                if (model.roomData.type !== RoomType.Boss && model.roomData.type !== RoomType.Start) {
                    unConnectedRooms.push(child);
                }

                // 根据房间类型分类
                if (model.roomData.type === RoomType.Start) {
                    startRoom = child;
                } else if (model.roomData.type === RoomType.Boss) {
                    bossRoom = child;
                }

                if (model.roomData.type === RoomType.Normal) {
                    unConnectedNormalRooms.push(child);
                }

                //打乱门
                model.roomData.baseEnvironment.door.sort(() => Math.random() - 0.5);
            }
        }

        // 打乱房间顺序，增加随机性
        unConnectedRooms.sort(() => Math.random() - 0.5);

        // 格子所属房间映射，用于记录已占用的位置
        let gridRoomMap: { [key: string]: RoomEntity } = {};

        // 记录起始房间位置
        const startRoomData = startRoom.get(RoomModelComp).roomData;
        startRoomData.pos = new Vec3(0, 0, 0);
        this.markRoomPosition(startRoomData, gridRoomMap, startRoom);
        connectedRooms.push(startRoom);

        // 连接房间的函数 - 将未连接的房间连接到已连接的房间网络
        const connectRoom = (roomToConnect: RoomEntity): boolean => {
            const roomToConnectData = roomToConnect.get(RoomModelComp).roomData;
            const roomToConnectDoors = roomToConnectData.baseEnvironment.door;

            // 随机打乱已连接房间的顺序，增加随机性
            const shuffledConnectedRooms = [...connectedRooms].sort(() => Math.random() - 0.5);

            // 遍历所有已连接的房间
            for (const connectedRoom of shuffledConnectedRooms) {
                const connectedRoomData = connectedRoom.get(RoomModelComp).roomData;
                const connectedRoomDoors = connectedRoomData.baseEnvironment.door;

                // 遍历未连接房间的所有门
                for (const doorToConnect of roomToConnectDoors) {
                    // 只处理未连接的门
                    if (doorToConnect.data.nextRoomId === 0) {
                        const doorOffset = doorToConnect.data.offset;

                        // 遍历已连接房间的所有门
                        for (const connectedDoor of connectedRoomDoors) {
                            // 只处理未连接的门，且方向相反的门
                            if (
                                connectedDoor.data.nextRoomId === 0 &&
                                connectedDoor.data.offset.x === -doorOffset.x &&
                                connectedDoor.data.offset.y === -doorOffset.y
                            ) {
                                // 计算未连接房间的可能位置
                                const possiblePos = new Vec3(
                                    connectedRoomData.pos.x + connectedDoor.data.offset.x,
                                    connectedRoomData.pos.y + connectedDoor.data.offset.y,
                                    0,
                                );

                                // 检查位置是否可用
                                if (this.canPlaceRoom(roomToConnectData, gridRoomMap, possiblePos)) {
                                    // 设置未连接房间的位置
                                    roomToConnectData.pos = possiblePos;
                                    this.markRoomPosition(roomToConnectData, gridRoomMap, roomToConnect);

                                    // 连接两个房间的门
                                    doorToConnect.data.nextRoomId = connectedRoomData.id;
                                    doorToConnect.data.nextDoorId = connectedDoor.data.doorId;
                                    connectedDoor.data.nextRoomId = roomToConnectData.id;
                                    connectedDoor.data.nextDoorId = doorToConnect.data.doorId;

                                    // 从未连接列表中移除
                                    CommonUtil.removeFromArray(unConnectedRooms, roomToConnect);

                                    // 添加到已连接列表
                                    connectedRooms.push(roomToConnect);

                                    return true;
                                }
                            }
                        }
                    }
                }
            }

            // 如果无法连接，返回false
            return false;
        };

        // 先连接所有普通房间
        for (const normalRoom of unConnectedNormalRooms) {
            if (!connectRoom(normalRoom)) {
                console.warn(`无法连接普通房间 ${normalRoom.get(RoomModelComp).roomData.id}`);
            }
        }

        // 再连接Boss房间
        if (!connectRoom(bossRoom)) {
            console.warn('无法连接Boss房间');
        }

        // 继续连接剩余的未连接房间
        const remainingRooms = [...unConnectedRooms]; // 创建副本以避免在迭代过程中修改数组
        for (const room of remainingRooms) {
            if (!connectRoom(room)) {
                console.warn(`无法连接房间 ${room.get(RoomModelComp).roomData.id}`);
            }
        }

        // 清理所有未连接的门
        for (const room of connectedRooms) {
            let doorData = room.get(RoomModelComp).roomData.baseEnvironment.door;
            for (let i = 0; i < doorData.length; i++) {
                if (doorData[i].data.nextRoomId === 0) {
                    doorData.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * 标记房间位置为已占用
     */
    private markRoomPosition(roomData: RoomData, gridRoomMap: { [key: string]: RoomEntity }, room: RoomEntity) {
        for (let i = 0; i < roomData.size.x; i++) {
            for (let j = 0; j < roomData.size.y; j++) {
                const posKey = `${roomData.pos.x + i}-${roomData.pos.y - j}`;
                gridRoomMap[posKey] = room;
            }
        }
    }

    /**
     * 判断房间是否可以放置
     */
    private canPlaceRoom(roomData: RoomData, gridRoomMap: { [key: string]: RoomEntity }, pos: Vec3) {
        for (let i = 0; i < roomData.size.x; i++) {
            for (let j = 0; j < roomData.size.y; j++) {
                const posKey = `${pos.x + i}-${pos.y - j}`;
                if (gridRoomMap[posKey]) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 创建起始房
     */
    private createStartRoom() {
        const startRoom = ecs.getEntity<RoomEntity>(RoomEntity);
        startRoom.add(DungeonRoomStartComp);
        startRoom.get(RoomModelComp).roomData.role.push({
            id: app.store.player.roleId,
            pos: new Vec3(0, 0, 0),
            faction: FactionType.ALLY,
            extraComp: [{ comp: EnterRoomComp, data: { roomId: 1 } }, { comp: IsPlayerComp }],
        });
        ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addRoom(startRoom);
    }

    /**
     * 创建普通房
     */
    private createNormalRooms() {
        const count = CommonUtil.randomBetween(1, 3);
        for (let i = 0; i < count; i++) {
            const room = ecs.getEntity<RoomEntity>(RoomEntity);
            room.add(DungeonRoomNormalComp);
            ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addRoom(room);
        }
    }

    /**
     * 创建对战房
     */
    private createBattleRooms() {
        const count = CommonUtil.randomBetween(1, 3);
        for (let i = 0; i < count; i++) {
            const room = ecs.getEntity<RoomEntity>(RoomEntity);
            room.add(DungeonRoomBattleComp);
            ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addRoom(room);
        }
    }

    /**
     * 创建Boss房
     */
    private createBossRoom() {
        const room = ecs.getEntity<RoomEntity>(RoomEntity);
        room.add(DungeonRoomBossComp);
        ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addRoom(room);
    }

    reset(): void {}
}
