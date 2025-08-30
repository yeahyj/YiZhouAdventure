import { _decorator } from 'cc';
import BaseView from '../../../../../../../extensions/app/assets/base/BaseView';
import { ProgressBar } from 'cc';
import { Sprite } from 'cc';
import { Label } from 'cc';
import { BattleController } from '../../../../../../app-builtin/app-controller/BattleController';
const { ccclass, property } = _decorator;
@ccclass('PaperBattleTask')
export class PaperBattleTask extends BaseView.BindController(BattleController) {
    @property(ProgressBar)
    taskProg: ProgressBar;

    @property(Label)
    taskLab: Label;

    @property(Sprite)
    taskSp: Sprite;

    // 初始化的相关逻辑写在这
    onLoad() {
        this.hideTask();
        this.controller.on(BattleController.Event.ShowTask, this.showTask, this);
        this.controller.on(BattleController.Event.UpdateTaskProgress, this.updateTaskProgress, this);
        this.controller.on(BattleController.Event.HideTask, this.hideTask, this);
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {}

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PaperBattleTask>({name: 'PaperBattleTask', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    //展示任务
    showTask() {
        // this.taskProg.node.active = true;
        // let taskEntity = app.manager.battle.taskEntity;
        // let taskModel = taskEntity.get(TaskModelComp);
        // let taskId = taskModel.taskId;
        // let taskConfig = DB_TaskConfig[taskId];
        // this.taskLab.string = taskConfig.name;
        // // 节点从右到左位移过来动画
        // const oldX = this.taskProg.node.position.x;
        // const newX = oldX - 500; // 假设向左移动200个单位
        // const duration = 0.5; // 动画持续时间为0.5秒
        // this.taskProg.node.setPosition(v3(newX, this.taskProg.node.position.y));
        // this.taskProg.node.getComponent(UIOpacity).opacity = 0;
        // tween(this.taskProg.node)
        //     .to(duration, { position: v3(oldX, this.taskProg.node.position.y) }, { easing: 'cubicOut' })
        //     .start();
        // tween(this.taskProg.node.getComponent(UIOpacity))
        //     .to(duration, { opacity: 255 }, { easing: 'cubicOut' })
        //     .start();
        // this.updateTaskProgress();
    }

    //更新任务进度
    updateTaskProgress() {
        // let taskEntity = app.manager.battle.taskEntity;
        // let taskModel = taskEntity.get(TaskModelComp);
        // let totalProgress = taskModel.totalProgress;
        // let currentProgress = taskModel.currentProgress;
        // this.taskProg.progress = currentProgress / totalProgress;
    }

    //隐藏任务
    hideTask() {
        this.taskProg.node.active = false;
    }
}
