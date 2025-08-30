import { _decorator, Button, Toggle } from 'cc';
import BaseView from 'db://app/base/BaseView';
import { BaseSetItem } from './expansion/BaseSetItem';
import { Node } from 'cc';

const { ccclass, property } = _decorator;
@ccclass('PopSet')
export class PopSet extends BaseView {
    @property(Node)
    infoNode: Node = null!;

    @property(Node)
    titleNode: Node = null!;

    @property(Node)
    closeNode: Node = null!;
    // 初始化的相关逻辑写在这
    onLoad() {
        this.closeNode.on(
            Button.EventType.CLICK,
            () => {
                this.hide();
            },
            this,
        );
    }

    protected onShow(data?: any) {
        this.updateUI({ index: data.index, itemData: data?.itemData });
    }

    onClickTitle(event: Event, customEventData: string) {
        let title: any = event.target;
        let index = this.titleNode.children.indexOf(title);
        this.switchInfo(index);
    }

    //切换信息
    switchInfo(index: number) {
        this.updateUI({ index: index });
    }

    updateUI(data: { index: number; itemData?: any }) {
        for (let i = 0; i < this.infoNode.children.length; i++) {
            let item = this.infoNode.children[i];
            item.active = i == data.index;
            item.getComponent(BaseSetItem)?.show(data.itemData);
            this.titleNode.children[i].getComponent(Toggle)!.isChecked = i == data.index;
        }
    }
}
