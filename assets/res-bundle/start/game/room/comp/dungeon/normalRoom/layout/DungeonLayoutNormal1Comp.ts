import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ECSEntity } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSEntity';
import CommonUtil from 'db://assets/res-bundle/start/game/common/help/util/CommonUtil';
import { EnvironmentId, BoxType } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentEnum';
import { BoxData } from 'db://assets/res-bundle/start/game/environment/help/EnvironmentInterface';
import { RoomModelComp } from 'db://assets/res-bundle/start/game/room/comp/RoomModelComp';
/**
 * 普通布局,在房间中红随机添加箱子
 */
@ecs.register('DungeonLayoutNormal1Comp')
export class DungeonLayoutNormal1Comp extends ecs.Comp {
    reset(): void {}
}

/**普通布局系统 */
export class DungeonLayoutNormal1System extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(DungeonLayoutNormal1Comp, RoomModelComp);
    }

    entityEnter(e: ECSEntity): void {
        this.randomGenerateBox(e);
        e.remove(DungeonLayoutNormal1Comp);
    }

    /**随机生成箱子 */
    private randomGenerateBox(e: ECSEntity) {
        let isSymmetric = CommonUtil.randomBetween(0, 1) == 0;
        let minBoxes = CommonUtil.randomBetween(0, 4);
        let maxBoxes = CommonUtil.randomBetween(6, 12);

        let roomData = e.get(RoomModelComp).roomData;
        const width = roomData.width;
        const height = roomData.height;
        const totalTiles = width * height;

        // 创建可用位置的数组e
        const availablePositions: number[] = [];

        // 获取所有门的位置及其相邻格子
        const doorAndAdjacentTiles = new Set<number>();
        roomData.baseEnvironment.door.forEach((door) => {
            const doorPos = door.posIndex;
            doorAndAdjacentTiles.add(doorPos);

            // 添加门周围的格子，根据门的朝向决定需要保持通畅的路径
            const x = doorPos % width;
            const y = Math.floor(doorPos / width);

            // 根据门的位置判断朝向
            const isTopDoor = y === 0;
            const isBottomDoor = y === height - 1;
            const isLeftDoor = x === 0;
            const isRightDoor = x === width - 1;

            // 根据门的朝向添加需要保持通畅的格子
            if (isTopDoor) {
                // 上门，保持下方的格子通畅
                for (let i = 1; i <= 2; i++) {
                    if (y + i < height) {
                        doorAndAdjacentTiles.add((y + i) * width + x);
                        // 为了避免被卡住，还要保持左右各一格的通畅
                        if (x - 1 >= 0) doorAndAdjacentTiles.add((y + i) * width + (x - 1));
                        if (x + 1 < width) doorAndAdjacentTiles.add((y + i) * width + (x + 1));
                    }
                }
            } else if (isBottomDoor) {
                // 下门，保持上方的格子通畅
                for (let i = 1; i <= 2; i++) {
                    if (y - i >= 0) {
                        doorAndAdjacentTiles.add((y - i) * width + x);
                        if (x - 1 >= 0) doorAndAdjacentTiles.add((y - i) * width + (x - 1));
                        if (x + 1 < width) doorAndAdjacentTiles.add((y - i) * width + (x + 1));
                    }
                }
            } else if (isLeftDoor) {
                // 左门，保持右方的格子通畅
                for (let i = 1; i <= 2; i++) {
                    if (x + i < width) {
                        doorAndAdjacentTiles.add(y * width + (x + i));
                        if (y - 1 >= 0) doorAndAdjacentTiles.add((y - 1) * width + (x + i));
                        if (y + 1 < height) doorAndAdjacentTiles.add((y + 1) * width + (x + i));
                    }
                }
            } else if (isRightDoor) {
                // 右门，保持左方的格子通畅
                for (let i = 1; i <= 2; i++) {
                    if (x - i >= 0) {
                        doorAndAdjacentTiles.add(y * width + (x - i));
                        if (y - 1 >= 0) doorAndAdjacentTiles.add((y - 1) * width + (x - i));
                        if (y + 1 < height) doorAndAdjacentTiles.add((y + 1) * width + (x - i));
                    }
                }
            }
        });

        // 收集所有可用的位置
        for (let i = 0; i < roomData.baseEnvironment.floor.length; i++) {
            let floorData = roomData.baseEnvironment.floor[i];
            if (!doorAndAdjacentTiles.has(floorData.posIndex)) {
                availablePositions.push(floorData.posIndex);
            }
        }

        // 随机决定箱子数量
        const boxCount = Math.floor(Math.random() * (maxBoxes - minBoxes + 1)) + minBoxes;

        // 如果可用位置不足，调整箱子数量
        const actualBoxCount = Math.min(boxCount, Math.floor(availablePositions.length / (isSymmetric ? 2 : 1)));

        // 初始化elements数组（如果不存在）
        if (!roomData.layoutEnvironment) {
            roomData.layoutEnvironment = [];
        }

        for (let i = 0; i < actualBoxCount; i++) {
            if (availablePositions.length === 0) break;

            // 随机选择一个位置
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const position = availablePositions[randomIndex];

            // 添加箱子到elements
            let boxData: BoxData = {
                id: EnvironmentId.DUNGEON_BOX,
                data: { type: BoxType.NORMAL },
                posIndex: position,
                type: BoxType.NORMAL,
            };
            roomData.layoutEnvironment.push(boxData);

            // 如果需要对称，添加对称位置
            if (isSymmetric) {
                const x = position % width;
                const y = Math.floor(position / width);
                const symmetricX = width - 1 - x;
                const symmetricPos = y * width + symmetricX;

                // 确保对称位置可用
                const symmetricIndex = availablePositions.indexOf(symmetricPos);
                if (symmetricIndex !== -1) {
                    let boxData: BoxData = {
                        id: EnvironmentId.DUNGEON_BOX,
                        data: { type: BoxType.NORMAL },
                        posIndex: symmetricPos,
                        type: BoxType.NORMAL,
                    };
                    roomData.layoutEnvironment.push(boxData);
                    availablePositions.splice(symmetricIndex, 1);
                }
            }

            // 从可用位置中移除已使用的位置
            availablePositions.splice(randomIndex, 1);
        }
    }
}
