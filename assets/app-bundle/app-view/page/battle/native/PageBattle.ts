import { _decorator } from 'cc';

import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';

const { ccclass, property } = _decorator;
@ccclass('PageBattle')
export class PageBattle extends BaseView {
    // 子界面列表，数组顺序为子界面排列顺序
    protected miniViews: IMiniViewNames = ['PaperBattleMap', 'PaperBattleRocker', 'PaperBattleInfo'];
    // 初始化的相关逻辑写在这
    onLoad() {}

    protected start(): void {}

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {
        this.showMiniViews({ views: this.miniViews });
    }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PageBattle>({name: 'PageBattle', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }
}
