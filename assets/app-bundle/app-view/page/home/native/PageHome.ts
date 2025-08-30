import { _decorator, Button, Node } from 'cc';

import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { IMiniViewNames } from '../../../../../app-builtin/app-admin/executor';
import { app } from '../../../../../app/app';

const { ccclass, property } = _decorator;
@ccclass('PageHome')
export class PageHome extends BaseView {
    @property(Node)
    startNode: Node = null!;

    @property(Node)
    supportNode: Node = null!;

    // 子界面列表，数组顺序为子界面排列顺序
    protected miniViews: IMiniViewNames = [];
    // 初始化的相关逻辑写在这
    onLoad() {
        this.startNode.on(Button.EventType.CLICK, this.onClickStartGame, this);
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: any) {
        this.showMiniViews({ views: this.miniViews });
    }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PageHome>({name: 'PageHome', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    onClickStartGame() {
        app.manager.ui.show({
            name: 'PageBattle',
        });
    }
}
