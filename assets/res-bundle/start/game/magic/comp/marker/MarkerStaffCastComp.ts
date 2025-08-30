import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';

/**
 *  武器施法组件
 */
@ecs.register('MarkerStaffCastComp')
export class MarkerStaffCastComp extends ecs.Comp {
    reset(): void {}
}
