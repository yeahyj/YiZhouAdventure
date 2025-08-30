import { _decorator, sp, Material } from 'cc';
import { app } from 'db://assets/app/app';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { BaseViewComp } from '../../common/comp/base/BaseViewComp';
import { AnimationEventData } from '../../common/help/CommonInterface';
import { RoleAnimationLoopType } from '../help/RoleConst';
import { ShaderAnimationNameType, RoleAnimationStateType } from '../help/RoleEnum';

const { ccclass, property } = _decorator;
/**
 * 视图组件
 */
@ccclass('ViewNormalRoleComp')
@ecs.register('ViewNormalRoleComp')
export class ViewNormalRoleComp extends BaseViewComp {
    public view: sp.Skeleton = null!;
    /**动画完成回调 */
    private _animationCompleteCallback: (() => void) | undefined;
    /**初始的材质 */
    originalMaterial: Material = null!;

    protected start(): void {
        this.originalMaterial = this.node.getComponent(sp.Skeleton)!.customMaterial!;

        this.view = this.node.getComponent(sp.Skeleton)!;
        this.view.setCompleteListener((trackEntry) => {
            this._animationCompleteCallback?.();
        });
    }

    /**设置Shader动画 */
    playShaderAnimation(name: ShaderAnimationNameType) {
        //TODO: 需要优化，提前加载保存材质
        app.manager.loader.load({
            path: 'game/role/render/res/vfx/material/' + name,
            bundle: 'start',
            type: Material,
            onComplete: (asset: Material | null) => {
                if (this.isValid && asset) {
                    this.node.getComponent(sp.Skeleton)!.customMaterial = asset;
                }
            },
        });
    }

    /**结束Shader动画 */
    endShaderAnimation() {
        this.node.getComponent(sp.Skeleton)!.customMaterial = this.originalMaterial;
    }

    /**设置动画 */
    playAnimation(data: AnimationEventData) {
        if (this.view) {
            if (data.name == 'skill01' || this.view.animation == 'skill01') {
                console.log('skill01');
            }
            if (this.view.animation != data.name) {
                let loop = RoleAnimationLoopType[data.name as RoleAnimationStateType];
                this.view.setAnimation(0, data.name, loop);
                this._animationCompleteCallback = data.onComplete;
            }
        }
    }

    reset(): void {
        this.view = null!;
        this._animationCompleteCallback = undefined;
    }
}
