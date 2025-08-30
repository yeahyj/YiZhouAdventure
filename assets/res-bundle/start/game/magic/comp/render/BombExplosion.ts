import { _decorator } from 'cc';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { FrameAnimation } from '../../../../../../pkg-export/@gamex/cc-comp-frame-animation';
import { UnitMagic } from '../UnitMagic';

const { ccclass, property } = _decorator;

/**
 * 炸弹爆炸
 */
@ccclass('BombExplosion') // 定义为 Cocos Creator 组件
@ecs.register('BombExplosion', false) // 定义为 ECS 组件
export class BombExplosion extends UnitMagic {
    @property(FrameAnimation)
    aniClip: FrameAnimation = null;
}
