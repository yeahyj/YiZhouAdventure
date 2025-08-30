import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { MagicEntity } from '../entity/MagicEntity';
import { MagicManagerComp } from './MagicManagerComp';
import { MagicModelComp } from './MagicModelComp';
import { FactionTypeComp } from '../../role/comp/FactionTypeComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { MpComp } from '../../staff/comp/MpComp';
import { StaffDirectionComp } from '../../staff/comp/StaffDirectionComp';
import { StaffModelComp } from '../../staff/comp/StaffModelComp';
import { StaffCastPositionComp } from '../../staff/comp/StaffCastPositionComp';
import { StaffBagComp } from '../../role/comp/StaffBagComp';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { AttributeType } from '../../common/help/CommonEnum';
import { RoleModelComp } from '../../role/comp/RoleModelComp';
import { StaffAttributeType } from '../../staff/help/StaffEnum';
import { IsMagicComp } from '../../common/comp/IsMagicComp';
import { LockStaffCastComp } from '../../role/comp/LockStaffCastComp';
import { InRoomComp } from '../../common/comp/InRoomComp';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';
/**
 * 魔法杖施法组件
 */
@ecs.register('StaffCastComp')
export class StaffCastComp extends ecs.Comp {
    projectileStone: BaseMagicStoneComp[] = [];
    modifyStone: BaseMagicStoneComp[] = [];

    reset(): void {
        this.projectileStone.length = 0;
        this.modifyStone.length = 0;
    }
}

/**魔法杖施法系统 */
export class StaffCastSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffCastComp).excludeOf(LockStaffCastComp);
    }

    constructor() {
        super();
    }
    update(e: ECSEntity): void {
        let staff = e.get(StaffBagComp)?.getUsingStaff();
        if (!staff) {
            return;
        }
        let staffModel = staff.get(StaffModelComp);
        if (staffModel.castDelay <= 0) {
            staffModel.castMaxDelay = 0;
            //施法
            let comp = e.get(StaffCastComp);
            let projectileStone = comp.projectileStone;
            let modifyStone = comp.modifyStone;

            if (projectileStone.length == 0 && modifyStone.length == 0) {
                let castNum = staff.get(StaffModelComp).attributes[StaffAttributeType.castNum];
                staffModel.castNum = castNum;
                while (staffModel.castNum > 0) {
                    let skillId = staffModel.getStone({
                        projectileStone: projectileStone,
                        modifyStone: modifyStone,
                        isBack: false,
                        source: 'staff',
                    });

                    if (skillId) {
                        let config = getMagicStonesConfig(skillId)!;
                        staffModel.castNum -= config.isCast ? 1 : 0;
                    } else {
                        staffModel.castNum = 0;
                    }
                }
            }

            if (projectileStone.length > 0) {
                //计算消耗的mp
                let costMp = 0;
                let scatteringAngle = 0;
                for (let i = 0; i < projectileStone.length; i++) {
                    costMp += getMagicStonesConfig(projectileStone[i].stoneId)!.mpCost;
                    scatteringAngle += getMagicStonesConfig(projectileStone[i].stoneId)!.scatteringAngle;
                }

                for (let i = 0; i < modifyStone.length; i++) {
                    costMp += getMagicStonesConfig(modifyStone[i].stoneId)!.mpCost;
                    scatteringAngle += getMagicStonesConfig(modifyStone[i].stoneId)!.scatteringAngle;
                }

                if (costMp <= staff.get(MpComp).mp) {
                    staff.get(MpComp).mp -= costMp;
                    for (let i = 0; i < projectileStone.length; i++) {
                        let magicEntity = ecs.getEntity<MagicEntity>(MagicEntity);
                        let magicManager = magicEntity.get(MagicManagerComp);
                        //先添加修正后添加技能
                        for (let k = 0; k < modifyStone.length; k++) {
                            magicManager.addNewComp(modifyStone[k]);
                        }
                        magicManager.addNewComp(projectileStone[i]);
                        let attributes = e.get(RoleModelComp).commonAttributes.attributes;
                        magicEntity.get(MagicModelComp).init({
                            scatteringAngle: scatteringAngle,
                            direction: staff.get(StaffDirectionComp).direction,
                            atk: attributes.getValue(AttributeType.atk),
                            crit: attributes.getValue(AttributeType.crit),
                            critDamage: attributes.getValue(AttributeType.critDamage),
                        });
                        magicEntity.get(FactionTypeComp).faction = e.get(FactionTypeComp).faction;
                        magicEntity.add(IsMagicComp);
                        magicEntity.add(InRoomComp).room = ecs
                            .getSingleton(GameModelComp)
                            .mapEntity.get(MapModelComp)
                            .getRoom()!;
                        staff.addChild(magicEntity);
                        magicEntity.get(PositionComp).setPosition(staff.get(StaffCastPositionComp).getCastPosition());
                    }
                    projectileStone.length = 0;
                    modifyStone.length = 0;
                    staffModel.castMaxDelay = staffModel.castDelay;
                }
            }
        }
    }
}
