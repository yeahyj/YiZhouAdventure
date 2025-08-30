import BaseController from '../../../extensions/app/assets/base/BaseController';

export class BattleController extends BaseController<
    BattleController,
    {
        // 定义了事件，并同时定义参数列表和返回值

        /**更新主角信息背包ui */
        UpdatePlayerBagUI: () => void;
        /**更新主角信息进度ui */
        UpdatePlayerProgressUI: () => void;

        //主角死亡
        PlayerDead: () => void;
        /**增加npc互动菜单 */
        AddNPCInteractionMenu: (interaction: number[]) => void;
        /**展示任务 */
        ShowTask: () => void;
        /**更新任务进度 */
        UpdateTaskProgress: () => void;
        /**隐藏任务 */
        HideTask: () => void;
        /**卸载装备或者装备装备 */
        ChangeEquip: () => void;
    }
>() {
    // controller中发射事件, view中监听事件:

    // 1、view中需要将 「extends BaseView」 改为=> 「extends BaseView.bindController(BattleController)」
    // 2、view中使用this.controller.on监听事件

    updatePlayerBagUI() {
        this.emit(BattleController.Event.UpdatePlayerBagUI);
    }

    updatePlayerProgressUI() {
        this.emit(BattleController.Event.UpdatePlayerProgressUI);
    }

    playerDead() {
        this.emit(BattleController.Event.PlayerDead);
    }

    addNPCInteractionMenu(interaction: number[]) {
        this.emit(BattleController.Event.AddNPCInteractionMenu, interaction);
    }

    showTask() {
        this.emit(BattleController.Event.ShowTask);
    }

    updateTaskProgress() {
        this.emit(BattleController.Event.UpdateTaskProgress);
    }

    hideTask() {
        this.emit(BattleController.Event.HideTask);
    }

    changeEquip() {
        this.emit(BattleController.Event.ChangeEquip);
    }
}
