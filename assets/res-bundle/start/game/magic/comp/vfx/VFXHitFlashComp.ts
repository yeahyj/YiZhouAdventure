import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { ViewComp } from '../../../role/comp/ViewComp';
import { ShaderAnimationNameType } from '../../../role/help/RoleEnum';

/**受击闪烁特效 */
@ecs.register('VFXHitFlashComp')
export class VFXHitFlashComp extends ecs.Comp {
    //闪烁时间
    flashTime: number = 0.1;
    reset(): void {
        this.flashTime = 0.1;
    }
}

/**打击特效系统 */
export class VFXHitFlashSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(VFXHitFlashComp, ViewComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        let view = e.get(ViewComp).view;
        view.playShaderAnimation(ShaderAnimationNameType.white);
    }

    update(e: ECSEntity): void {
        let comp = e.get(VFXHitFlashComp);
        if (comp.flashTime <= 0) {
            let view = e.get(ViewComp).view;
            view.endShaderAnimation();
            e.remove(VFXHitFlashComp);
            return;
        }

        comp.flashTime -= this.dt;
    }
}
