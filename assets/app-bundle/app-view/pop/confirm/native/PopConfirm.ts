import { _decorator } from 'cc';
import BaseView from '../../../../../../extensions/app/assets/base/BaseView';
import { Label, Button } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('PopConfirm')
export class PopConfirm extends BaseView {
    @property(Label)
    private titleLabel: Label = null!;

    @property(Label)
    private contentLabel: Label = null!;

    @property(Button)
    private confirmButton: Button = null!;

    @property(Button)
    private cancelButton: Button = null!;

    private popData: { title: string; content: string; onConfirm: () => void; onCancel: () => void } | null = null;
    // 初始化的相关逻辑写在这
    onLoad() {
        this.confirmButton.node.on(Button.EventType.CLICK, this.onConfirm, this);
        this.cancelButton.node.on(Button.EventType.CLICK, this.onCancel, this);
    }

    // 界面打开时的相关逻辑写在这(onShow可被多次调用-它与onHide不成对)
    onShow(params: { title: string; content: string; onConfirm: () => void; onCancel: () => void }) {
        this.popData = params;
        this.titleLabel.string = this.popData.title;
        this.contentLabel.string = this.popData.content;
    }

    // 界面关闭时的相关逻辑写在这(已经关闭的界面不会触发onHide)
    onHide(result: undefined) {
        // app.manager.ui.show<PopConfirm>({name: 'PopConfirm', onHide:(result) => { 接收到return的数据，并且有类型提示 }})
        return result;
    }

    private onConfirm() {
        this.popData?.onConfirm();
        this.hide();
    }

    private onCancel() {
        this.popData?.onCancel();
        this.hide();
    }
}
