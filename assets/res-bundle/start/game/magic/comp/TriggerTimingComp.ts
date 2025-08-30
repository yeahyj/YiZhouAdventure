import { _decorator } from 'cc';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { MagicEntity } from '../entity/MagicEntity';
import { MagicManagerComp } from './MagicManagerComp';
import { Vec3 } from 'cc';
import { getMagicStonesConfig } from '../../../../base/config/MagicStonesConfig';
import { MagicModelComp } from './MagicModelComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';

const { ccclass, property } = _decorator;

/**
 * 定时触发
 */
@ccclass('TriggerTimingComp')
@ecs.register('TriggerTimingComp')
export class TriggerTimingComp extends ProjectileStoneComp {
    /**触发倒计时 */
    triggerTime: number = 0.5;

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

    reset(): void {
        this.projectileStone.length = 0;
        this.modifyStone.length = 0;
        this.triggerTime = 0.5;
    }
}

/**定时触发系统 */
export class TriggerTimingSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(TriggerTimingComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        let comp = e.get(TriggerTimingComp);
        comp.triggerTime -= this.dt;
        if (comp.triggerTime <= 0) {
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
                skillEntity.add(InRoomComp).room = ecs
                    .getSingleton(GameModelComp)
                    .mapEntity.get(MapModelComp)
                    .getRoom()!;
                skillEntity.get(PositionComp).setPosition(pos);
            }

            e.remove(TriggerTimingComp);
        }
    }

    private exit(e: ecs.Entity) {}
}
