import { js } from 'cc';
import { getMagicStonesConfig } from 'db://assets/res-bundle/base/config/MagicStonesConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import BattleUtil from '../../common/help/util/BattleUtil';
import { MagicStoneItemType, MagicStoneType, StaffAttributeType } from '../help/StaffEnum';
import { StaffAttributeData, MagicStoneItemData } from '../help/StaffInterface';
import { BaseMagicStoneComp } from './base/BaseMagicStoneComp';
import { getStaffConfig } from 'db://assets/res-bundle/base/config/StaffConfig';
import CommonUtil from '../../common/help/util/CommonUtil';

/**
 * 法杖数据
 */
@ecs.register('StaffModelComp')
export class StaffModelComp extends ecs.Comp {
    /**法杖id */
    staffId: number = null!;
    /**基础数据 */
    attributes: StaffAttributeData = null!;
    /**魔法石id */
    stoneArr: MagicStoneItemData[] = [];
    /**施法位置 */
    castIndex: number = 999;
    /**回绕位置 */
    castBackIndex: number = 0;
    /**施法延迟 */
    castDelay: number = 0;
    /**施法数量 */
    castNum: number = 0;
    /**魔法石上限 */
    magicStoneMax: number = 0;

    /**最大施法延迟，用于界面展示 */
    castMaxDelay: number = 0;

    /**
     * 初始化法杖数据
     * @param staffId 法杖id
     */
    init(data: { staffId: number }) {
        this.staffId = data.staffId;
        let config = getStaffConfig(this.staffId)!;
        this.attributes = {
            [StaffAttributeType.isDisorder]: config.isDisorder,
            [StaffAttributeType.castNum]: CommonUtil.randomBetween(config.castNum[0], config.castNum[1]),
            [StaffAttributeType.castDelay]: CommonUtil.randomBetween(config.castDelay[0], config.castDelay[1]),
            [StaffAttributeType.chargeTime]: CommonUtil.randomBetween(config.chargeTime[0], config.chargeTime[1]),
            [StaffAttributeType.mpMax]: CommonUtil.randomBetween(config.mpMax[0], config.mpMax[1]),
            [StaffAttributeType.mpChargeSpeed]: CommonUtil.randomBetween(
                config.mpChargeSpeed[0],
                config.mpChargeSpeed[1],
            ),
            [StaffAttributeType.capacity]: CommonUtil.randomBetween(config.capacity[0], config.capacity[1]),
            [StaffAttributeType.scatter]: CommonUtil.randomBetween(config.scatter[0], config.scatter[1]),
            [StaffAttributeType.magicStoneMax]: CommonUtil.randomBetween(
                config.magicStoneMax[0],
                config.magicStoneMax[1],
            ),
            [StaffAttributeType.magicStones]: [],
        };

        let magicStones = config.magicStones;
        for (let i = 0; i < magicStones.length; i++) {
            let stoneId = magicStones[i];
            let stoneData = getMagicStonesConfig(stoneId);
            if (!stoneData) {
                console.error(`魔法石配置不存在: ${stoneId}`);
                continue;
            }
            this.attributes[StaffAttributeType.magicStones].push({
                [MagicStoneItemType.id]: stoneId,
                [MagicStoneItemType.capacity]: stoneData.capacity,
            });
        }

        // let config = getStaffConfig(this.staffId);
        // this.attributes = BattleUtil.getStaffDataById(this.staffId)!;
    }

    /**获取一个法术或者修正 */
    getStone(data: {
        projectileStone: BaseMagicStoneComp[];
        modifyStone: BaseMagicStoneComp[];
        isBack: boolean;
        source: 'staff' | 'stone';
    }): number | null {
        let stoneId = null;
        for (let i = this.castIndex; i < this.stoneArr.length; i++) {
            if (this.stoneArr[i]) {
                stoneId = this.stoneArr[i][MagicStoneItemType.id];
                this.castIndex = i + 1;
                break;
            }
        }

        if (!stoneId && data.isBack) {
            //法术回绕
            stoneId = this.stoneArr[this.castBackIndex][MagicStoneItemType.id];
            this.castBackIndex++;
        } else if (!stoneId && !data.isBack) {
            //不法术回绕
            this.castNum = 0;
        }

        if (stoneId) {
            let config = getMagicStonesConfig(stoneId)!;
            let stoneCompObj = js.getClassByName(config.className);
            let stoneComp: BaseMagicStoneComp = new (stoneCompObj as any)();
            if (config.type == MagicStoneType.projectile) {
                data.projectileStone.push(stoneComp);
            } else {
                data.modifyStone.push(stoneComp);
            }
            this.castDelay += config.delayTime;
            stoneComp.init({
                staffModel: this,
                stoneId: stoneId,
                projectileStone: data.projectileStone,
                modifyStone: data.modifyStone,
            });
        }

        return stoneId;
    }

    reset(): void {
        this.castMaxDelay = 0;
        this.castDelay = 0;
        this.castIndex = 999;
        this.castBackIndex = 0;
        this.castNum = 0;
        this.magicStoneMax = 0;
        this.stoneArr.length = 0;
    }
}

export class StaffModelSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(StaffModelComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        let comp = e.get(StaffModelComp);
        this.updateStaffSkillIds(e);
        if (comp.castDelay > 0) {
            comp.castDelay -= this.dt;
        }
    }

    updateStaffSkillIds(e: ecs.Entity) {
        let comp = e.get(StaffModelComp);
        let data = e.get(StaffModelComp).attributes;

        let isHaveSkill = false;
        for (let i = comp.castIndex; i < comp.stoneArr.length; i++) {
            if (comp.stoneArr[i]) {
                isHaveSkill = true;
                break;
            }
        }

        if (
            !isHaveSkill ||
            (comp.castIndex >= comp.stoneArr.length && data[StaffAttributeType.magicStones].length != 0)
        ) {
            let data = e.get(StaffModelComp).attributes;
            if (data[StaffAttributeType.isDisorder]) {
                comp.stoneArr = BattleUtil.deepClone(
                    data[StaffAttributeType.magicStones].sort(() => Math.random() - 0.5),
                );
            } else {
                comp.stoneArr = BattleUtil.deepClone(data[StaffAttributeType.magicStones]);
            }
            comp.castBackIndex = 0;
            comp.castIndex = 0;
            comp.castNum = data[StaffAttributeType.castNum];
            comp.castDelay += data[StaffAttributeType.chargeTime];
            comp.castMaxDelay = comp.castDelay;
        }
    }
}
