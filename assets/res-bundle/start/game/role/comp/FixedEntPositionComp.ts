import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { PositionComp } from './PositionComp';

/**
 * 固定在具体的实体身上 ,也会随之转身
 */
@ecs.register('FixedEntPositionComp')
export class FixedEntPositionComp extends ecs.Comp {
    fixedEnt: ecs.Entity = null;

    reset(): void {}
}

/**固定系统 */
export class FixedEntPositionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(FixedEntPositionComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        let posComp = e.get(PositionComp);
        let fixedEnt = e.get(FixedEntPositionComp).fixedEnt;
        if (fixedEnt && posComp) {
            let fixedEntPos = fixedEnt.get(PositionComp);
            posComp.setPosition(fixedEntPos.getPosition());
            posComp.bodyAngle = fixedEntPos.bodyAngle;
        }
    }

    private exit(e: ecs.Entity) {}
}
