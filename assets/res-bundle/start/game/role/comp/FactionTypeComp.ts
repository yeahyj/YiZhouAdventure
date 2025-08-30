import { PhysicsSystem } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { FactionType } from '../../common/help/CommonEnum';

/**
 * 角色属性数据
 */
@ecs.register('FactionTypeComp')
export class FactionTypeComp extends ecs.Comp {
    /**阵营 */
    faction: FactionType = null!;

    /**碰撞组 */
    get group(): number {
        return this.getGroupByFaction(this.faction);
    }

    /**敌人碰撞组 */
    get mask(): number {
        return this.getMaskByFaction(this.faction);
    }

    /**检测器碰撞组 */
    get detectorGroup(): number {
        let group: any = PhysicsSystem.PhysicsGroup;
        if (this.faction == FactionType.ENEMY) {
            return group['ENEMYDET'];
        } else if (this.faction == FactionType.ALLY) {
            return group['ALLYDET'];
        } else {
            return group['ENEMY'] | group['ALLY'] | group['NEUTRAL'];
        }
    }

    get bodyGroup(): number {
        let group: any = PhysicsSystem.PhysicsGroup;
        if (this.faction == FactionType.ENEMY) {
            return group['ENEMY'];
        } else if (this.faction == FactionType.ALLY) {
            return group['ALLY'];
        } else {
            return group['NEUTRAL'];
        }
    }

    reset(): void {
        this.faction = null!;
    }

    /**根据角色Faction获取碰撞组 */
    getGroupByFaction(faction: FactionType) {
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
    getMaskByFaction(faction: FactionType) {
        let group: any = PhysicsSystem.PhysicsGroup;
        if (faction == FactionType.ENEMY) {
            return group['ALLY'];
        } else if (faction == FactionType.ALLY) {
            return group['ENEMY'];
        } else {
            return group['ENEMY'] | group['ALLY'] | group['NEUTRAL'];
        }
    }
}
