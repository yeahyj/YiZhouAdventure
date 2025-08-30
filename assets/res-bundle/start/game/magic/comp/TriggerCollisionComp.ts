import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { MagicEntity } from '../entity/MagicEntity';
import { MagicModelComp } from './MagicModelComp';
import { MagicManagerComp } from './MagicManagerComp';
import { Vec3 } from 'cc';
import { getMagicStonesConfig } from '../../../../base/config/MagicStonesConfig';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { MarkerCollisionComp } from '../../common/comp/mark/MarkerCollisionComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';

const { ccclass, property } = _decorator;

/**
 * 碰撞1次触发
 */
@ccclass('TriggerCollisionComp')
@ecs.register('TriggerCollisionComp')
export class TriggerCollisionComp extends BaseMagicStoneComp {
    initStone() {
        this.projectileStone = [];
        this.modifyStone = [];
        let config = getMagicStonesConfig(this.stoneId)!;
        let extraCast = config.extraCast;
        let model = this.staffModel;

        while (extraCast > 0) {
            let skillId = model.getStone({
                projectileStone: this.projectileStone,
                modifyStone: this.modifyStone,
                isBack: false,
                source: 'stone',
            });

            if (skillId) {
                let config = getMagicStonesConfig(skillId)!;
                extraCast -= config.isCast ? 1 : 0;
            } else {
                extraCast = 0;
            }
        }
    }
}

/**碰撞1次触发系统 */
export class TriggerCollisionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(TriggerCollisionComp, MarkerCollisionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let comp = e.get(TriggerCollisionComp);
        for (let i = 0; i < comp.projectileStone.length; i++) {
            let skillEntity = ecs.getEntity<MagicEntity>(MagicEntity);
            let skillManager = skillEntity.get(MagicManagerComp);
            //先添加修正后添加技能
            for (let k = 0; k < comp.modifyStone.length; k++) {
                skillManager.addNewComp(comp.modifyStone[k]);
            }
            skillManager.addNewComp(comp.projectileStone[i]);
            //最近敌人的方向
            let pos = e.get(PositionComp).getPosition(true);
            //随机方向
            let dir = new Vec3(Math.random() - 0.5, Math.random() - 0.5).normalize();

            skillEntity.get(MagicModelComp).init({
                scatteringAngle: 0,
                direction: dir,
                atk: e.get(MagicModelComp).atk,
                crit: e.get(MagicModelComp).crit,
                critDamage: e.get(MagicModelComp).critDamage,
            });
            skillEntity.get(FactionTypeComp).faction = e.get(FactionTypeComp).faction;
            skillEntity.add(IsMagicComp);
            skillEntity.add(InRoomComp).room = ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
            skillEntity.get(PositionComp).setPosition(pos);
        }

        e.remove(TriggerCollisionComp);
    }

    private exit(e: ecs.Entity) {}
}
