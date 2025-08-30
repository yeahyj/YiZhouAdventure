import { js } from 'cc';
import { getMagicStonesConfig } from '../../../../base/config/MagicStonesConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseMagicStoneComp } from '../../staff/comp/base/BaseMagicStoneComp';
import { SkillPluginInfluence } from '../help/MagicEnum';

/**
 * 技能管理组件
 */
@ecs.register('MagicManagerComp')
export class MagicManagerComp extends ecs.Comp {
    /**按照类型分组的已经添加的技能组件 */
    stoneCompByType: Map<string, BaseMagicStoneComp[]> = new Map<string, BaseMagicStoneComp[]>();

    addNewComp(comp: BaseMagicStoneComp) {
        let config = getMagicStonesConfig(comp.stoneId)!;
        let typeComp = this.stoneCompByType.get(config.type) ?? [];
        if (config.influence == SkillPluginInfluence.move && typeComp.length > 0) {
            console.log('唯一技能组件已经存在');
            return;
        }
        //这里 重新new一个组件，是因为技能组件是可以重复添加的，但是每次添加的组件都是新的
        let newComp: BaseMagicStoneComp = new (comp.constructor as any)();
        newComp.stoneId = comp.stoneId;
        newComp.staffModel = comp.staffModel;
        newComp.projectileStone = comp.projectileStone;
        newComp.modifyStone = comp.modifyStone;
        this.ent.add(comp);
    }

    addComp(comp: BaseMagicStoneComp) {
        let config = getMagicStonesConfig(comp.stoneId)!;
        let typeComp = this.stoneCompByType.get(config.type) ?? [];
        if (config.influence == SkillPluginInfluence.move && typeComp.length > 0) {
            console.log('唯一技能组件已经存在');
            return;
        }
        this.ent.add(comp);
    }

    addCompById(id: number) {
        let config = getMagicStonesConfig(id)!;
        let comp: any = this.ent.add(js.getClassByName(config.className) as any);
        this.addNewComp(comp);
    }

    reset(): void {
        this.stoneCompByType.clear();
    }
}
