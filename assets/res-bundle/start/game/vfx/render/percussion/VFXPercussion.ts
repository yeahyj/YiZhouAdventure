import { _decorator } from 'cc';
import { sp } from 'cc';
import { v3 } from 'cc';
import { BaseVFX } from '../base/BaseVFX';
const { ccclass, property } = _decorator;

@ccclass('VFXPercussion')
export class VFXPercussion extends BaseVFX {
    onLoad() {
        this.view!.node!.getComponent(sp.Skeleton)!.setAnimation(0, 'animation1', false);
        this.view!.node!.getComponent(sp.Skeleton)!.setCompleteListener(() => {
            this.node.destroy();
        });
        this.view!.node!.scale = v3(0.3, 0.3, 0.3);
    }
}
