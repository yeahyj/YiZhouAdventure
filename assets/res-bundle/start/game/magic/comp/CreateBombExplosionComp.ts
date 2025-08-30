import { _decorator, Vec3, js } from 'cc';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { MagicEntity } from '../entity/MagicEntity';
import { ProjectileStoneComp } from './base/ProjectileStoneComp';
import { MagicModelComp } from './MagicModelComp';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { StoneId } from '../../staff/help/StaffEnum';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';

const { ccclass, property } = _decorator;

/**
 * 创建炸弹爆炸实体
 */
@ccclass('CreateBombExplosionComp')
@ecs.register('CreateBombExplosionComp')
export class CreateBombExplosionComp extends ProjectileStoneComp {
    pos: Vec3 = new Vec3();
    atk: number = 0;

    initData(data: { pos: Vec3; atk: number }) {
        this.pos.set(data.pos);
        this.atk = data.atk;
    }

    reset(): void {
        this.pos.set(0, 0, 0);
        this.atk = 0;
    }
}

/**创建炸弹爆炸实体系统 */
export class CreateBombExplosionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(CreateBombExplosionComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ecs.Entity): void {
        let skillEntity = ecs.getEntity<MagicEntity>(MagicEntity);
        let skillId = StoneId.BombExplosionComp;
        let config = getMagicStonesConfig(skillId)!;
        skillEntity.get(MagicModelComp).init({
            scatteringAngle: 0,
            direction: new Vec3(0, 0),
            atk: e.get(MagicModelComp).atk,
            crit: e.get(MagicModelComp).crit,
            critDamage: e.get(MagicModelComp).critDamage,
        });
        skillEntity.get(FactionTypeComp).faction = e.get(FactionTypeComp).faction;
        skillEntity.add(IsMagicComp);
        skillEntity.add(InRoomComp).room = ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).getRoom()!;
        skillEntity.get(PositionComp).setPosition(e.get(PositionComp).getPosition());
        let plugCompObj = js.getClassByName(config.className);
        skillEntity.add(plugCompObj as any);
    }

    private exit(e: ecs.Entity) {}
}
