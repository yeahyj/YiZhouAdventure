import { BattleController } from '../../../../../app-builtin/app-controller/BattleController';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';

/**
 * 玩家功能
 */
@ecs.register('NPCInteractionMenuComp')
export class NPCInteractionMenuComp extends ecs.Comp {
    //对话数据
    data: { id: number; interaction: number[]; weight: number } = { id: 0, interaction: [], weight: 99999 };
    //是否刷新
    isRefresh: boolean = false;

    /**权重是小的优先 */
    addInteraction(interactionData: { id: number; interaction: number[]; weight: number }) {
        if (!interactionData) return; // 防止传入空数据

        const shouldUpdate =
            !this.data || this.data.weight > interactionData.weight || this.data.id === interactionData.id;

        if (shouldUpdate) {
            this.isRefresh = !this.data || this.data.id !== interactionData.id;
            this.data = { ...interactionData }; // 创建新对象，避免引用问题
        }
    }

    /**删除对话 */
    removeChat(id: number) {
        if (this.data && this.data.id === id) {
            this.isRefresh = true;
            this.data = { id: 0, interaction: [], weight: 99999 };
        }
    }

    reset(): void {
        this.data = { id: 0, interaction: [], weight: 99999 };
        this.isRefresh = false;
    }
}

export class NPCInteractionMenuSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(NPCInteractionMenuComp);
    }

    constructor() {
        super();
    }
    update(e: ECSEntity): void {
        let comp = e.get(NPCInteractionMenuComp);
        if (comp.isRefresh) {
            //TODO:这里添加交互功能需要判断是否解锁
            BattleController.inst.addNPCInteractionMenu(comp.data.interaction);
            comp.isRefresh = false; // 重置刷新标志
        }
    }
}
