import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { EffectData, AttackVisitorData } from '../../magic/help/MagicInterface';

/**攻击接受者 */
@ecs.register('AtkAcceptComp')
export class AtkAcceptComp extends ecs.Comp {
    /**攻击效果 */
    acceptEffect: EffectData[] = [];
    accept(data: AttackVisitorData) {}

    reset(): void {}
}
