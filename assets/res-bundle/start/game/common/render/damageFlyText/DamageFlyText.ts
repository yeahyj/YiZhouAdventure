import { Color, Component, Label, Vec3, _decorator, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DamageFlyText')
export class DamageFlyText extends Component {
    public duration: number = 1.0; // 飘字持续时间
    public riseHeight: number = 50; // 飘字上升高度

    // 初始化飘字控件
    public init(value: number, startPosition: Vec3) {
        const label = this.getComponent(Label)!;
        label.string = value.toString();
        let color = value < 0 ? Color.RED : Color.GREEN;
        label.color = color;

        this.node.setPosition(startPosition);
        const endPosition = new Vec3(startPosition.x, startPosition.y + this.riseHeight);

        tween(this.node)
            .to(this.duration, { position: endPosition }, { easing: 'sineOut' })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
