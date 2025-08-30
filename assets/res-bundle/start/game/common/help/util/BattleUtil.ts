import { PhysicsSystem, Vec3, v3, UITransform, Widget, Prefab, instantiate, js } from 'cc';
import { MapLayerNames, MapLayersType } from 'db://assets/app-builtin/app-model/export.type';
import { app } from 'db://assets/app/app';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { getProjectileConfig } from 'db://assets/res-bundle/base/config/ProjectileConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import {
    DirectionType,
    EnvironmentId,
    FloorType,
    WallType,
    DoorType,
    DoorAnimationStateType,
} from '../../../environment/help/EnvironmentEnum';
import { GameModelComp } from '../../../game/comp/GameModelComp';
import { MagicLifeTimeComp } from '../../../magic/comp/MagicLifeTimeComp';
import { MagicModelComp } from '../../../magic/comp/MagicModelComp';
import { MapModelComp } from '../../../map/comp/MapModelComp';

import { CollisionComp } from '../../../role/comp/CollisionComp';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { HpComp } from '../../../role/comp/HpComp';
import { PositionComp } from '../../../role/comp/PositionComp';
import { SpeedComp } from '../../../role/comp/SpeedComp';
import { RoomGridMoveTypeComp } from '../../../room/comp/RoomGridMoveTypeComp';
import { RoomModelComp } from '../../../room/comp/RoomModelComp';
import { RoomEntity } from '../../../room/entity/RoomEntity';
import { BaseUnit } from '../../render/base/BaseUnit';
import CommonUtil from './CommonUtil';
import { Node } from 'cc';
import { FloorData, WallData, DoorData } from '../../../environment/help/EnvironmentInterface';
import { GridMoveType, RoomSizeType, RoomType } from '../../../room/help/RoomEnum';
import { RoomData } from '../../../room/help/RoomInterface';
import { FactionType } from '../CommonEnum';
import { GameResComp } from '../../../game/comp/GameResComp';
import { v2 } from 'cc';

export default class BattleUtil {
    public static deepClone(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => BattleUtil.deepClone(item));
        }

        const clonedObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = BattleUtil.deepClone(obj[key]);
            }
        }

        return clonedObj;
    }

    /**在数组里面随机取值，数组里面的是对象，对象里面又一个probability参数，总值可能大于1 */
    static randomSelectWithProbability<T extends { probability: number }>(arr: T[]): T | null {
        if (arr.length === 0) {
            return null;
        }

        const totalProbability = arr.reduce((sum, item) => sum + item.probability, 0);
        const randomValue = Math.random() * totalProbability;

        let accumulatedProbability = 0;
        for (const item of arr) {
            accumulatedProbability += item.probability;
            if (randomValue <= accumulatedProbability) {
                return item;
            }
        }

        return arr[arr.length - 1];
    }

    /**
     * 加载icon
     * @param sp 加载节点
     * @param id 配置id
     * @param config 配置
     */
    static loadIcon(sp: Node, id: number, config: { [key: string]: any }) {
        // let iconId = config[id].icon;
        // let iconPath = getIconConfig(iconId).path;
        // app.manager.loader.load({
        //     path: 'icon/' + iconPath + '/spriteFrame',
        //     bundle: 'battle',
        //     type: SpriteFrame,
        //     onComplete: (result: SpriteFrame) => {
        //         sp.getComponent(Sprite).spriteFrame = result;
        //     },
        // });
    }

    /**
     * 获取敌对阵营
     * @param faction 当前阵营
     * @returns 敌对阵营
     */
    static getEnemyFaction(faction: FactionType) {
        if (faction == FactionType.ALLY) {
            return FactionType.ENEMY;
        } else if (faction == FactionType.ENEMY) {
            return FactionType.ALLY;
        }
    }

    /**根据角色Faction获取碰撞组 */
    static getGroupByFaction(faction: FactionType) {
        let group: any = PhysicsSystem.PhysicsGroup;
        if (faction == FactionType.ENEMY) {
            return group['ENEMY'];
        } else if (faction == FactionType.ALLY) {
            return group['ALLY'];
        } else {
            return group['NEUTRAL'];
        }
    }

    /**根据角色Faction获取碰撞组 */
    static getMaskByFaction(faction: FactionType) {
        let group: any = PhysicsSystem.PhysicsGroup;
        if (faction == FactionType.ENEMY) {
            return group['ALLY'];
        } else if (faction == FactionType.ALLY) {
            return group['ENEMY'];
        } else {
            return group['ENEMY'] | group['ALLY'] | group['NEUTRAL'];
        }
    }

    /**根据网格检测是否可以移动 */
    static isMovableOnTiledByPos(data: {
        pos: Vec3;
        isPlayer?: boolean;
        fromPos?: Vec3;
        roomEntity?: RoomEntity;
        moveType: GridMoveType;
    }): boolean {
        let { pos, isPlayer, fromPos, roomEntity, moveType } = data;
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        let targetGridPos = this.getGridPosByNodePos(pos, roomData);

        // 检查目标位置是否在地图范围内
        if (
            targetGridPos.x < 0 ||
            targetGridPos.x >= roomData.width ||
            targetGridPos.y < 0 ||
            targetGridPos.y >= roomData.height
        ) {
            return false;
        }

        // 如果是玩家且在门口，允许移动
        if (isPlayer) {
            let roomModelComp = ecs
                .getSingleton(GameModelComp)
                .mapEntity!.get(MapModelComp)!
                .getRoom()!
                .get(RoomModelComp);
            let posIndex = this.getGridIndexByGridPos(v3(targetGridPos.x, targetGridPos.y));
            if (roomModelComp.openDoorPos.has(posIndex)) {
                return true;
            }
        }

        // 首先检查目标位置是否可移动
        const targetIndex = targetGridPos.y * roomData.width + targetGridPos.x;
        if (roomEntity.get(RoomGridMoveTypeComp).getGridMoveType(targetIndex) > moveType) {
            return false;
        }

        // 如果没有提供起始位置，只检查目标位置
        if (!fromPos) {
            return true;
        }

        // 获取起始位置的网格坐标
        let currentGridPos = this.getGridPosByNodePos(fromPos, roomData);

        // 计算移动方向
        let dx = targetGridPos.x - currentGridPos.x;
        let dy = targetGridPos.y - currentGridPos.y;

        // 如果是斜向移动
        if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
            // 检查移动路径上的两个相邻格子
            const horizontalIndex = currentGridPos.y * roomData.width + (currentGridPos.x + dx);
            const verticalIndex = (currentGridPos.y + dy) * roomData.width + currentGridPos.x;

            let horizontalBlocked = roomEntity.get(RoomGridMoveTypeComp).getGridMoveType(horizontalIndex) > moveType;
            let verticalBlocked = roomEntity.get(RoomGridMoveTypeComp).getGridMoveType(verticalIndex) > moveType;

            // 如果两个相邻格子中有一个被阻挡，就不能斜着走
            if (horizontalBlocked || verticalBlocked) {
                return false;
            }
        }

        return true;
    }

    /**节点坐标转换为网格坐标 */
    static getGridPosByNodePos(pos: Vec3, roomData?: RoomData) {
        roomData = roomData ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoomData();
        //注意节点坐标是起点中心，而网格坐标是起点左上角
        let width = roomData.width * roomData.tileWidth;
        let height = roomData.height * roomData.tileHeight;
        //如果是在地图外了
        if (pos.y > height / 2 || pos.y < -height / 2 || pos.x > width / 2 || pos.x < -width / 2) {
            return new Vec3(-1, -1, 0);
        }
        let row = Math.floor(Math.abs(pos.y - height / 2) / roomData.tileHeight);
        let column = Math.floor((pos.x + width / 2) / roomData.tileWidth);
        return new Vec3(column, row, 0);
    }

    /**网格索引转换网格坐标 */
    static getGridPosByGridIndex(index: number, roomData?: RoomData) {
        roomData = roomData ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoomData();
        //行
        let row = Math.floor(index / roomData.width);
        //列
        let column = index % roomData.width;
        return new Vec3(column, row, 0);
    }
    /**网格坐标转换网格索引 */
    static getGridIndexByGridPos(pos: Vec3, roomEntity?: RoomEntity) {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        return pos.y * roomData.width + pos.x;
    }
    /**根据地图网格索引获取节点坐标位置 */
    static getNodePosByGridIndex(index: number, roomEntity?: RoomEntity): Vec3 {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        let tileWidth = roomData.tileWidth;
        let tileHeight = roomData.tileHeight;
        let roomWidth = roomData.width * tileWidth;
        let roomHeight = roomData.height * tileHeight;
        let row = Math.floor(index / roomData.width);
        let column = index % roomData.width;
        return new Vec3(
            column * tileWidth - roomWidth / 2 + tileWidth / 2,
            roomHeight / 2 - row * tileHeight - tileHeight / 2,
        );
    }

    /**根据地图网格坐标获取节点坐标 */
    static getNodePosByGridPos(gridPos: Vec3, roomEntity?: RoomEntity): Vec3 {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        let tileWidth = roomData.tileWidth;
        let tileHeight = roomData.tileHeight;
        let roomWidth = roomData.width * tileWidth;
        let roomHeight = roomData.height * tileHeight;
        return new Vec3(
            gridPos.x * tileWidth - roomWidth / 2 + tileWidth / 2,
            roomHeight / 2 - gridPos.y * tileHeight - tileHeight / 2,
        );
    }

    /**根据节点坐标获取网格索引 */
    static getGridIndexByNodePos(pos: Vec3, roomEntity?: RoomEntity): number {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let gridPos = this.getGridPosByNodePos(pos, roomEntity.get(RoomModelComp).roomData);
        return this.getGridIndexByGridPos(gridPos, roomEntity);
    }

    /**根据起点和步数，随机获取一个可以移动过去的终点，注意路径是最优路径，如果步数不够，找不到终点，步数可以少点 */
    static getRandomMoveEndPos(startPos: Vec3, step: number, roomEntity?: RoomEntity): Vec3 {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        const startGridPos = this.getGridPosByNodePos(startPos, roomData);
        const startIndex = startGridPos.y * roomData.width + startGridPos.x;

        // 使用BFS找到所有在步数范围内可达的点
        const queue: Array<{ pos: number; steps: number }> = [{ pos: startIndex, steps: 0 }];
        const visited = new Set<number>([startIndex]);
        const reachablePoints: number[] = [];

        while (queue.length > 0) {
            const current = queue.shift()!;

            if (current.steps <= step) {
                reachablePoints.push(current.pos);
            }

            if (current.steps >= step) continue;

            const x = current.pos % roomData.width;
            const y = Math.floor(current.pos / roomData.width);

            // 可能的移动方向：上、下、左、右、左上、右上、左下、右下
            const directions = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 }, // 上下
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }, // 左右
                { dx: -1, dy: -1 },
                { dx: 1, dy: -1 }, // 左上、右上
                { dx: -1, dy: 1 },
                { dx: 1, dy: 1 }, // 左下、右下
            ];

            for (const dir of directions) {
                const newX = x + dir.dx;
                const newY = y + dir.dy;
                const newPos = newY * roomData.width + newX;

                // 检查新位置是否有效且可移动
                if (
                    newX >= 0 &&
                    newX < roomData.width &&
                    newY >= 0 &&
                    newY < roomData.height &&
                    !visited.has(newPos) &&
                    this.isMovableOnTiledByPos({
                        pos: this.getNodePosByGridPos(v3(newX, newY), roomEntity),
                        isPlayer: false,
                        fromPos: this.getNodePosByGridPos(v3(x, y), roomEntity),
                        roomEntity: roomEntity,
                        moveType: GridMoveType.BLOCK,
                    })
                ) {
                    queue.push({ pos: newPos, steps: current.steps + 1 });
                    visited.add(newPos);
                }
            }
        }

        // 从可达点中随机选择一个
        if (reachablePoints.length === 0) {
            return startPos;
        }

        const randomIndex = Math.floor(Math.random() * reachablePoints.length);
        const selectedPos = reachablePoints[randomIndex];
        const x = selectedPos % roomData.width;
        const y = Math.floor(selectedPos / roomData.width);

        return this.getNodePosByGridPos(v3(x, y), roomEntity);
    }

    /**根据起点和终点获取移动路径，最优路径 */
    static getMovePath(startPos: Vec3, endPos: Vec3, roomEntity?: RoomEntity): Vec3[] {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;
        const startGridPos = this.getGridPosByNodePos(startPos, roomData);
        const endGridPos = this.getGridPosByNodePos(endPos, roomData);

        const startIndex = startGridPos.y * roomData.width + startGridPos.x;
        const endIndex = endGridPos.y * roomData.width + endGridPos.x;

        // 使用A*算法找最短路径
        const openSet = new Set<number>([startIndex]);
        const cameFrom = new Map<number, number>();
        const gScore = new Map<number, number>();
        const fScore = new Map<number, number>();

        gScore.set(startIndex, 0);
        fScore.set(startIndex, this.heuristic(startGridPos, endGridPos));

        while (openSet.size > 0) {
            // 找到f值最小的节点
            let current = -1;
            let minF = Infinity;
            for (const pos of openSet) {
                const f = fScore.get(pos) ?? Infinity;
                if (f < minF) {
                    minF = f;
                    current = pos;
                }
            }

            if (current === endIndex) {
                return this.reconstructPath(cameFrom, current, roomEntity);
            }

            openSet.delete(current);
            const x = current % roomData.width;
            const y = Math.floor(current / roomData.width);

            // 检查所有可能的移动方向
            const directions = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 }, // 上下
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }, // 左右
                { dx: -1, dy: -1 },
                { dx: 1, dy: -1 }, // 左上、右上
                { dx: -1, dy: 1 },
                { dx: 1, dy: 1 }, // 左下、右下
            ];

            for (const dir of directions) {
                const newX = x + dir.dx;
                const newY = y + dir.dy;
                const neighbor = newY * roomData.width + newX;

                // 检查新位置是否有效且可移动
                if (
                    newX >= 0 &&
                    newX < roomData.width &&
                    newY >= 0 &&
                    newY < roomData.height &&
                    this.isMovableOnTiledByPos({
                        pos: this.getNodePosByGridPos(v3(newX, newY), roomEntity),
                        isPlayer: false,
                        fromPos: this.getNodePosByGridPos(v3(x, y), roomEntity),
                        roomEntity: roomEntity,
                        moveType: GridMoveType.BLOCK,
                    })
                ) {
                    // 计算移动代价（斜向移动代价为1.4，直线移动代价为1）
                    const moveCost = Math.abs(dir.dx) + Math.abs(dir.dy) > 1 ? 1.4 : 1;
                    const tentativeGScore = (gScore.get(current) ?? Infinity) + moveCost;

                    if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
                        cameFrom.set(neighbor, current);
                        gScore.set(neighbor, tentativeGScore);
                        fScore.set(neighbor, tentativeGScore + this.heuristic({ x: newX, y: newY }, endGridPos));
                        openSet.add(neighbor);
                    }
                }
            }
        }

        // 如果找不到路径，返回空数组
        return [];
    }

    /**A*算法的启发式函数 */
    private static heuristic(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
        // 使用对角线距离作为启发式函数
        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);
        return Math.max(dx, dy) + (Math.sqrt(2) - 1) * Math.min(dx, dy);
    }

    /**重建路径 */
    private static reconstructPath(cameFrom: Map<number, number>, current: number, roomEntity: RoomEntity): Vec3[] {
        let roomData = roomEntity.get(RoomModelComp).roomData;
        const path: Vec3[] = [];
        while (cameFrom.has(current)) {
            const x = current % roomData.width;
            const y = Math.floor(current / roomData.width);
            path.unshift(this.getNodePosByGridPos(v3(x, y), roomEntity));
            current = cameFrom.get(current)!;
        }
        // 添加起点
        const startX = current % roomData.width;
        const startY = Math.floor(current / roomData.width);
        path.unshift(this.getNodePosByGridPos(v3(startX, startY), roomEntity));
        return path;
    }

    static createRoomNode() {
        let node = new Node();
        node.layer = ecs.getSingleton(GameModelComp).mapNode.layer;
        for (let i = 0; i < MapLayerNames.length; ++i) {
            let layerNode = this.createFullScreenNode();
            layerNode.name = 'layer_' + (MapLayerNames[i] ? MapLayerNames[i] : i);
            node.addChild(layerNode);
        }
        return node;
    }

    /**创建全屏节点 */
    static createFullScreenNode() {
        let node = new Node();
        node.layer = ecs.getSingleton(GameModelComp).mapNode.layer;
        let uiTransform = node.addComponent(UITransform);
        uiTransform.anchorX = 0.5;
        uiTransform.anchorY = 0.5;
        let widget = node.addComponent(Widget);
        widget.isAlignBottom = true;
        widget.isAlignTop = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.bottom = 0;
        return node;
    }

    /**创建魔法投射物 */
    static createMagicProjectile(data: { id: number; ent: ecs.Entity; cb?: (node: Node) => void }) {
        let config = getProjectileConfig(data.id)!;
        data.ent.add(HpComp);
        data.ent.get(MagicModelComp).initAttribute(data.id);
        data.ent.add(SpeedComp);
        data.ent.add(CollisionComp);
        data.ent.add(MagicLifeTimeComp);
        app.manager.loader.load({
            path: config.path,
            bundle: config.bundle,
            type: Prefab,
            onComplete: (result: Prefab | null) => {
                if (!data.ent.get(EnabledComp)) {
                    console.log('技能已经被销毁');
                    return;
                }
                if (!result) {
                    console.error(`魔法投射物配置不存在: ${data.id}`);
                    return;
                }

                let node = instantiate(result);
                node.getComponent(BaseUnit)!.init({ e: data.ent, id: data.id });
                ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addNodeToRoom(node, MapLayersType.SKILL);
                let pos = data.ent.get(PositionComp).getPosition();
                node.setPosition(pos);

                //增加额外组件
                let projectileComp = config.extraModifyStone;
                if (projectileComp) {
                    for (let i = 0; i < projectileComp.length; i++) {
                        let stoneId = projectileComp[i];
                        let stoneData = getMagicStonesConfig(stoneId);
                        if (!stoneData) {
                            console.error(`魔法石配置不存在: ${stoneId}`);
                            continue;
                        }
                        let plugCompObj = js.getClassByName(stoneData.className as any);
                        data.ent.add(plugCompObj as any);
                    }
                }
                if (data.cb) {
                    data.cb(node);
                }
            },
        });
    }

    /**
     * 在坐标点附近寻找一个空位置，中间不能有阻挡
     * @param pos 起始坐标
     * @param maxStep 最大搜索步数，默认为3
     * @param roomData 房间数据
     * @returns 找到的空位置，如果找不到则返回原始位置
     */
    static findEmptyPos(pos: Vec3, maxStep: number = 3, roomEntity?: RoomEntity): Vec3 {
        roomEntity = roomEntity ?? ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        let roomData = roomEntity.get(RoomModelComp).roomData;

        // 获取起始点的网格坐标
        const startGridPos = this.getGridPosByNodePos(pos, roomData);
        const startIndex = startGridPos.y * roomData.width + startGridPos.x;

        // 如果起始位置就是空的，直接返回
        if (roomEntity.get(RoomGridMoveTypeComp).getGridMoveType(startIndex) === GridMoveType.FREE) {
            return pos;
        }

        // 使用BFS寻找指定步数内的空位置
        const queue: Array<{ pos: number; steps: number }> = [{ pos: startIndex, steps: 0 }];
        const visited = new Set<number>([startIndex]);
        const emptyPositions: number[] = [];

        // 可能的移动方向：上、下、左、右、左上、右上、左下、右下
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: -1, dy: -1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: 1 },
        ];

        while (queue.length > 0) {
            const current = queue.shift()!;
            const x = current.pos % roomData.width;
            const y = Math.floor(current.pos / roomData.width);

            // 如果已经超过最大步数，跳过
            if (current.steps > maxStep) {
                continue;
            }

            for (const dir of directions) {
                const newX = x + dir.dx;
                const newY = y + dir.dy;
                const newPos = newY * roomData.width + newX;

                // 检查新位置是否有效且未访问过
                if (newX >= 0 && newX < roomData.width && newY >= 0 && newY < roomData.height && !visited.has(newPos)) {
                    visited.add(newPos);

                    // 检查新位置是否可移动
                    const nodePos = this.getNodePosByGridPos(v3(newX, newY), roomEntity);
                    if (
                        this.isMovableOnTiledByPos({
                            pos: nodePos,
                            isPlayer: false,
                            fromPos: pos,
                            roomEntity: roomEntity,
                            moveType: GridMoveType.BLOCK,
                        })
                    ) {
                        // 将找到的空位置加入数组
                        emptyPositions.push(newPos);
                    }

                    // 继续搜索
                    queue.push({ pos: newPos, steps: current.steps + 1 });
                }
            }
        }

        // 如果找到了空位置，随机返回一个
        if (emptyPositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyPositions.length);
            const selectedPos = emptyPositions[randomIndex];
            const x = selectedPos % roomData.width;
            const y = Math.floor(selectedPos / roomData.width);
            return this.getNodePosByGridPos(v3(x, y), roomEntity);
        }

        // 如果找不到空位置，返回原始位置
        return pos;
    }

    /**
     * vec方向转换成方向类型
     * @param vec 方向
     * @returns 方向类型
     */
    static getDirectionTypeByVec(vec: Vec3): DirectionType {
        if (vec.x === 0 && vec.y === 1) {
            return DirectionType.TOP;
        } else if (vec.x === 0 && vec.y === -1) {
            return DirectionType.BOTTOM;
        } else if (vec.x === 1 && vec.y === 0) {
            return DirectionType.RIGHT;
        } else if (vec.x === -1 && vec.y === 0) {
            return DirectionType.LEFT;
        } else if (vec.x === 1 && vec.y === 1) {
            return DirectionType.RIGHT_TOP;
        } else if (vec.x === -1 && vec.y === 1) {
            return DirectionType.LEFT_TOP;
        } else if (vec.x === 1 && vec.y === -1) {
            return DirectionType.RIGHT_BOTTOM;
        }
        return DirectionType.NONE;
    }

    /**随机选取一个可移动地图坐标 */
    static randomMoveNodePos(roomEntity: RoomEntity): Vec3 {
        let index = this.randomMoveTiledIndex(roomEntity);
        return this.getNodePosByGridIndex(index, roomEntity);
    }

    /**随机选取一个可移动网格索引 */
    static randomMoveTiledIndex(roomEntity: RoomEntity) {
        let movable = roomEntity.get(RoomGridMoveTypeComp).getGridMoveDataByTypeIndex(GridMoveType.FREE);
        let randomIndex = CommonUtil.randomBetween(0, movable.length - 1);
        return movable[randomIndex];
    }

    /**获取地图数据 */
    static getMapData(sizeType: RoomSizeType, roomType: RoomType): RoomData {
        let configComp = ecs.getSingleton(GameModelComp).gameEntity.get(GameResComp);
        let roomConfig = configComp.getOneRoomConfigByType(sizeType);
        let roomData: RoomData = {
            height: roomConfig.height,
            width: roomConfig.width,
            sizeType: sizeType,
            size: v2(roomConfig.width / 15, roomConfig.height / 9),
            tileHeight: roomConfig.tileheight,
            tileWidth: roomConfig.tilewidth,
            layers: [],
            pos: null!,
            layoutEnvironment: [],
            baseEnvironment: { floor: [], wall: [], door: [] },
            role: [],
            id: 0,
            type: roomType,
        };

        let roomLayers = roomConfig.layers;

        // 第一次遍历，收集门的位置
        const doorPositions: { x: number; y: number }[] = [];
        let doorLayer: number[] = [];
        for (let i = 0; i < roomLayers.length; i++) {
            let layerData = roomLayers[i];
            if (layerData.name === 'door') {
                doorLayer = layerData.data;
                for (let j = 0; j < layerData.data.length; j++) {
                    if (layerData.data[j] > 0) {
                        let gridPos = this.getGridPosByGridIndex(j, roomData);
                        doorPositions.push({
                            x: gridPos.x,
                            y: gridPos.y,
                        });
                    }
                }
            }
        }

        // 计算所有门的相对房间位置
        const doorSkewPositions = this.calculateDoorSkewPositions(doorPositions);
        let doorIndex = 1;

        // 第二次遍历，创建环境
        for (let i = 0; i < roomLayers.length; i++) {
            let layerData = roomLayers[i];
            for (let j = 0; j < layerData.data.length; j++) {
                if (layerData.name == 'floor' && layerData.data[j] > 0) {
                    let environmentData: FloorData = {
                        id: EnvironmentId.DUNGEON_FLOOR,
                        posIndex: j,
                        data: { resType: '1' },
                        type: FloorType.NORMAL,
                    };
                    roomData.baseEnvironment.floor.push(environmentData);
                } else if (layerData.name == 'wall' && layerData.data[j] > 0) {
                    let dir = this.calculateWallDirection(
                        j,
                        roomData.width,
                        roomData.height,
                        (index: number) => {
                            return layerData.data[index] > 0;
                        },
                        (index: number) => {
                            // 检查是否有地板层
                            const floorLayer = roomLayers.find((layer: any) => layer.name === 'floor');
                            if (floorLayer) {
                                return floorLayer.data[index] > 0;
                            }
                            return false;
                        },
                    );
                    let environmentData: WallData = {
                        id: EnvironmentId.DUNGEON_WALL,
                        posIndex: j,
                        data: { resType: '1', dir: dir },
                        type: WallType.NORMAL,
                    };
                    roomData.baseEnvironment.wall.push(environmentData);
                } else if (layerData.name == 'door' && layerData.data[j] > 0) {
                    // 计算门的方向
                    const dir = this.calculateDoorDirection(j, roomData.width, roomData.height, (index: number) => {
                        // 检查是否有地板层
                        const floorLayer = roomLayers.find((layer: any) => layer.name === 'floor');
                        if (floorLayer) {
                            return floorLayer.data[index] > 0;
                        }
                        return false;
                    });

                    //计算门的偏移值
                    let offset = (roomData: RoomData) => {
                        if (dir === DirectionType.TOP) {
                            return v2(0, -1);
                        } else if (dir === DirectionType.BOTTOM) {
                            return v2(0, 1);
                        } else if (dir === DirectionType.LEFT) {
                            return v2(1, 0);
                        } else if (dir === DirectionType.RIGHT) {
                            return v2(-1, 0);
                        }

                        console.error('门的方向错误,导致门的偏移错误', dir);
                        return v2(0, 0);
                    };

                    //计算房间的偏移值
                    let roomOffset = (roomData: RoomData, posIndex: number) => {
                        let gridPos = this.getGridPosByGridIndex(posIndex, roomData);
                        return v2(Math.ceil(gridPos.x - 7 / 14), Math.ceil((gridPos.y - 4) / 8));
                    };

                    let environmentData: DoorData = {
                        id: EnvironmentId.DUNGEON_DOOR,
                        posIndex: j,
                        data: {
                            doorId: doorIndex,
                            resType: '1',
                            dir: dir,
                            nextRoomId: 0,
                            nextDoorId: 0,
                            nextRoomOffset: roomOffset(roomData, j),
                            state: DoorAnimationStateType.CLOSE,
                            offset: offset(roomData),
                        },
                        type: DoorType.NORMAL,
                    };
                    roomData.baseEnvironment.door.push(environmentData);
                    doorIndex++;
                }
            }
        }

        return roomData;
    }

    /**
     * 计算墙壁方向
     * @param posIndex 当前位置索引
     * @param width 房间宽度
     * @param height 房间高度
     * @param isWall 判断某个位置是否是墙的函数
     * @param isFloor 判断某个位置是否是地板的函数
     * @returns 墙壁方向
     */
    static calculateWallDirection(
        posIndex: number,
        width: number,
        height: number,
        isWall: (index: number) => boolean,
        isFloor: (index: number) => boolean,
    ): DirectionType {
        const x = posIndex % width;
        const y = Math.floor(posIndex / width);

        const hasWall = {
            top: y > 0 ? isWall(posIndex - width) : false,
            bottom: y < height - 1 ? isWall(posIndex + width) : false,
            left: x > 0 ? isWall(posIndex - 1) : false,
            right: x < width - 1 ? isWall(posIndex + 1) : false,
        };

        // 获取周围的地板情况
        const hasFloor = {
            top: y > 0 ? isFloor(posIndex - width) : false,
            bottom: y < height - 1 ? isFloor(posIndex + width) : false,
            left: x > 0 ? isFloor(posIndex - 1) : false,
            right: x < width - 1 ? isFloor(posIndex + 1) : false,
            topLeft: y > 0 && x > 0 ? isFloor(posIndex - width - 1) : false,
            topRight: y > 0 && x < width - 1 ? isFloor(posIndex - width + 1) : false,
            bottomLeft: y < height - 1 && x > 0 ? isFloor(posIndex + width - 1) : false,
            bottomRight: y < height - 1 && x < width - 1 ? isFloor(posIndex + width + 1) : false,
        };

        if (!hasFloor.bottom && hasFloor.top) return DirectionType.TOP;
        if (hasFloor.bottom && !hasFloor.top) return DirectionType.BOTTOM;
        if (!hasFloor.left && hasFloor.right) return DirectionType.RIGHT;
        if (hasFloor.left && !hasFloor.right) return DirectionType.LEFT;
        if (hasFloor.bottomRight && !hasFloor.bottom && !hasFloor.right) return DirectionType.RIGHT_BOTTOM;
        if (hasFloor.bottomLeft && !hasFloor.bottom && !hasFloor.left) return DirectionType.LEFT_BOTTOM;
        if (hasFloor.topRight && !hasFloor.top && !hasFloor.right) return DirectionType.RIGHT_TOP;
        if (hasFloor.topLeft && !hasFloor.top && !hasFloor.left) return DirectionType.LEFT_TOP;

        return DirectionType.NONE;
    }

    /**
     * 计算门的方向
     * @param posIndex 当前位置索引
     * @param width 房间宽度
     * @param height 房间高度
     * @param hasBlock 判断某个位置是否有阻挡的函数
     * @returns 门的方向
     */
    static calculateDoorDirection(
        posIndex: number,
        width: number,
        height: number,
        isFloor: (index: number) => boolean,
    ): DirectionType {
        const x = posIndex % width;
        const y = Math.floor(posIndex / width);

        // 获取周围的地板情况
        const hasFloor = {
            top: y > 0 ? isFloor(posIndex - width) : false,
            bottom: y < height - 1 ? isFloor(posIndex + width) : false,
            left: x > 0 ? isFloor(posIndex - 1) : false,
            right: x < width - 1 ? isFloor(posIndex + 1) : false,
            topLeft: y > 0 && x > 0 ? isFloor(posIndex - width - 1) : false,
            topRight: y > 0 && x < width - 1 ? isFloor(posIndex - width + 1) : false,
            bottomLeft: y < height - 1 && x > 0 ? isFloor(posIndex + width - 1) : false,
            bottomRight: y < height - 1 && x < width - 1 ? isFloor(posIndex + width + 1) : false,
        };

        if (!hasFloor.bottom && hasFloor.top) return DirectionType.TOP;
        if (hasFloor.bottom && !hasFloor.top) return DirectionType.BOTTOM;
        if (!hasFloor.left && hasFloor.right) return DirectionType.RIGHT;
        if (hasFloor.left && !hasFloor.right) return DirectionType.LEFT;
        if (hasFloor.bottomRight && !hasFloor.bottom && !hasFloor.right) return DirectionType.RIGHT_BOTTOM;
        if (hasFloor.bottomLeft && !hasFloor.bottom && !hasFloor.left) return DirectionType.LEFT_BOTTOM;
        if (hasFloor.topRight && !hasFloor.top && !hasFloor.right) return DirectionType.RIGHT_TOP;
        if (hasFloor.topLeft && !hasFloor.top && !hasFloor.left) return DirectionType.LEFT_TOP;

        return DirectionType.NONE;
    }

    /**
     * 计算门的相对房间位置
     * @param doorPositions 所有门的位置数组 [x, y][]
     * @returns 每个门对应的相对房间位置 Vec3[]
     */
    static calculateDoorSkewPositions(doorPositions: { x: number; y: number }[]): Vec3[] {
        if (doorPositions.length === 0) return [];

        // 直接返回门相对于房间左上角的位置坐标
        // 在地图坐标系中，左上角是(0,0)，向右x增加，向下y增加
        return doorPositions.map((pos) => {
            // 直接使用门的网格坐标作为相对位置
            return v3(pos.x, pos.y, 0);
        });
    }
}
