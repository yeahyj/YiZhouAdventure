import { Vec3, v3 } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { DirectionWeight } from '../../common/help/CommonEnum';
import BattleUtil from '../../common/help/util/BattleUtil';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';
import { GridMoveType } from '../../room/help/RoomEnum';
import { RoomData } from '../../room/help/RoomInterface';
import { DirectionComp } from './DirectionComp';
import { PositionComp } from './PositionComp';

/**
 * 网格移动组件
 */
@ecs.register('TiledMoveComp')
export class TiledMoveComp extends ecs.Comp {
    //移动路径
    movePath: Vec3[] = [];
    //目的地
    endPos: Vec3 | null = null;
    //当前路径索引
    currentPathIndex: number = 0;
    //移动阈值（到达目标点的距离阈值）
    readonly moveThreshold: number = 5;
    //路径重算等待时间（帧数）
    readonly pathRecalculateDelay: number = 10;
    //当前等待帧数
    waitFrames: number = 0;

    reset(): void {
        this.movePath = [];
        this.endPos = null;
        this.currentPathIndex = 0;
        this.waitFrames = 0;
    }

    /**
     * 设置移动目标
     * @param endPos 目标位置
     */
    setMoveTarget(endPos: Vec3): void {
        this.endPos = endPos;
        this.updatePath();
    }

    /**
     * 更新移动路径
     * @returns 是否成功找到路径
     */
    updatePath(): boolean {
        if (!this.endPos) return false;

        const currentPos = this.ent.get(PositionComp).getPosition();
        this.movePath = BattleUtil.getMovePath(currentPos, this.endPos);
        this.currentPathIndex = 0;
        this.waitFrames = 0;

        return this.movePath.length > 0;
    }

    /**
     * 清除移动目标
     */
    clearMoveTarget(): void {
        this.endPos = null;
        this.movePath = [];
        this.currentPathIndex = 0;
        this.waitFrames = 0;
    }

    /**
     * 检查下一个位置是否可以移动
     */
    canMoveToNextPosition(currentPos: Vec3, direction: Vec3, roomData: RoomData): boolean {
        const nextPos = v3();
        Vec3.multiplyScalar(nextPos, direction, this.moveThreshold);
        Vec3.add(nextPos, nextPos, currentPos);
        return BattleUtil.isMovableOnTiledByPos({ pos: nextPos, moveType: GridMoveType.FREE });
    }
}

/**网格移动系统 */
export class TiledMoveSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(TiledMoveComp, DirectionComp, PositionComp);
    }

    update(e: ecs.Entity) {
        const moveComp = e.get(TiledMoveComp);
        const posComp = e.get(PositionComp);
        const dirComp = e.get(DirectionComp);

        // 如果没有移动目标，退出
        if (!moveComp.endPos) {
            this.exit(e);
            return;
        }

        const currentPos = posComp.getPosition();
        const roomData = ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoomData();

        // 如果已经到达目标点，退出
        if (Vec3.distance(currentPos, moveComp.endPos) <= moveComp.moveThreshold) {
            this.exit(e);
            return;
        }

        // 如果正在等待，继续等待
        if (moveComp.waitFrames > 0) {
            moveComp.waitFrames--;
            return;
        }

        // 如果没有路径或当前路径点无效，尝试重新计算路径
        if (moveComp.movePath.length === 0 || moveComp.currentPathIndex >= moveComp.movePath.length) {
            if (!moveComp.updatePath()) {
                // 如果找不到路径，进入等待状态
                moveComp.waitFrames = moveComp.pathRecalculateDelay;
                return;
            }
        }

        // 获取当前目标点
        const targetPos = moveComp.movePath[moveComp.currentPathIndex];
        const direction = v3();
        Vec3.subtract(direction, targetPos, currentPos);
        direction.normalize();

        // 检查是否可以移动到下一个位置
        if (moveComp.canMoveToNextPosition(currentPos, direction, roomData)) {
            // 设置移动方向
            dirComp.setDirection({
                dir: direction,
                weight: DirectionWeight.move,
            });

            // 如果足够接近目标点，前进到下一个路径点
            if (Vec3.distance(currentPos, targetPos) <= moveComp.moveThreshold) {
                moveComp.currentPathIndex++;
            }
        } else {
            // 如果不能移动，尝试重新计算路径
            if (!moveComp.updatePath()) {
                // 如果找不到路径，进入等待状态
                moveComp.waitFrames = moveComp.pathRecalculateDelay;
            }
        }
    }

    private exit(e: ecs.Entity) {
        const moveComp = e.get(TiledMoveComp);
        const dirComp = e.get(DirectionComp);

        // 清除移动方向
        dirComp.setDirection({
            dir: v3(0, 0),
            weight: DirectionWeight.move,
        });

        // 清除移动目标
        moveComp.clearMoveTarget();
    }
}
