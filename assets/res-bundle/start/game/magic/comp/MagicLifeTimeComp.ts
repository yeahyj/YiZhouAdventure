import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { AttributeType } from '../../common/help/CommonEnum';
import { DeathBeforeComp } from '../../role/comp/death/DeathBeforeComp';
import { MagicModelComp } from './MagicModelComp';

/**
 * 魔法生命周期组件
 */
@ecs.register('MagicLifeTimeComp')
export class MagicLifeTimeComp extends ecs.Comp {
    /**技能生命周期 */
    lifeTime: number = 0;
    reset(): void {
        this.lifeTime = 0;
    }
}

/**魔法生命周期系统 */
export class MagicLifeTimeSystem
    extends ecs.ComblockSystem<ecs.Entity>
    implements ecs.IEntityEnterSystem, ecs.ISystemUpdate
{
    filter(): ecs.IMatcher {
        return ecs.allOf(MagicLifeTimeComp);
    }

    constructor() {
        super();
    }

    entityEnter(e: ECSEntity): void {
        let comp = e.get(MagicLifeTimeComp);
        comp.lifeTime = e.get(MagicModelComp).attributes.get(AttributeType.lifeTime).getValue();
    }

    update(e: ecs.Entity): void {
        let lifeTime = e.get(MagicLifeTimeComp);
        if (lifeTime.lifeTime <= 0) {
            e.add(DeathBeforeComp);
            e.remove(MagicLifeTimeComp);
        } else {
            lifeTime.lifeTime -= this.dt;
        }
    }
}
