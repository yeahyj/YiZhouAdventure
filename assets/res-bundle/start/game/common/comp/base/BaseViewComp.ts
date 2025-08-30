import { _decorator, Component } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { ShaderAnimationNameType } from '../../../role/help/RoleEnum';
import { AnimationEventData } from '../../help/CommonInterface';

const { ccclass, property } = _decorator;

/**视图组件 */
@ccclass('BaseViewComp')
export class BaseViewComp extends Component implements ecs.IComp {
    static tid: number = -1;
    static compName: string;

    canRecycle: boolean = null!;
    ent: ecs.Entity = null!;

    initView() {}

    /**设置Shader动画 */
    playShaderAnimation(name: ShaderAnimationNameType) {}

    /**结束Shader动画 */
    endShaderAnimation() {}

    /**设置动画 */
    playAnimation(data: AnimationEventData) {}

    reset(): void {}
}
