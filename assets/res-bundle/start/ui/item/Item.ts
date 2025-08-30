import { Node } from 'cc';
import { Button } from 'cc';
import { Sprite } from 'cc';
import { _decorator, Component } from 'cc';
import { app } from 'db://assets/app/app';
import { SpriteFrame } from 'cc';
import { Label } from 'cc';
import { ItemType } from '../../game/common/help/CommonEnum';
import { Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {
    @property(Sprite)
    selectSp: Sprite = null!;

    @property(Sprite)
    bgSp: Sprite = null!;

    @property(Sprite)
    iconSp: Sprite = null!;

    @property(Label)
    namLab: Label = null!;

    @property(Node)
    clickBtn: Node = null!;

    click: (() => void) | null = null;

    protected onLoad(): void {
        this.clickBtn.on(Button.EventType.CLICK, this.onItemClick, this);
    }

    init(data: {
        iconPath?: string;
        bundle?: string;
        type: ItemType;
        isSelect?: boolean;
        click?: () => void;
        name?: string;
    }) {
        if (data.iconPath) {
            app.manager.loader.load({
                path: data.iconPath + '/spriteFrame',
                bundle: data.bundle,
                type: SpriteFrame,
                onComplete: (result: SpriteFrame | null) => {
                    if (result) {
                        this.iconSp.node.active = true;
                        this.iconSp.spriteFrame = result;
                    } else {
                        this.iconSp.node.active = false;
                    }
                },
            });
        } else {
            this.iconSp.node.active = false;
            this.namLab.node.active = false;
        }

        this.namLab.string = data.name ?? '';
        this.namLab.node.active = data.name ? true : false;

        this.selectSp.node.active = data.isSelect ?? false;

        this.click = data.click ?? null;

        if (data.type == ItemType.STAFF) {
            //绿色
            this.bgSp.color = new Color(0, 255, 0, 255);
        } else if (data.type == ItemType.PROP) {
            //蓝色
            this.bgSp.color = new Color(0, 0, 255, 255);
        }
    }

    setSelect(isSelect: boolean) {
        this.selectSp.node.active = isSelect;
    }

    onItemClick() {
        this.click?.();
    }
}
