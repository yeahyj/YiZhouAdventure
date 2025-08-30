import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';

/**
 * 沉默
 * 禁止施法组件
 */
@ecs.register('MarkerStaffSilenceComp')
export class MarkerStaffSilenceComp extends ecs.Comp {
    reset(): void {}
}
