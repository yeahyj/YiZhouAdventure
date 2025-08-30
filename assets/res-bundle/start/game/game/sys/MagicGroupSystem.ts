import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { BlackHoleSystem } from '../../magic/comp/BlackHoleComp';
import { BlackHoleEffectSystem, RemoveBlackHoleEffectSystem } from '../../magic/comp/BlackHoleEffectComp';
import { BombSystem } from '../../magic/comp/BombComp';
import { BombExplosionSystem } from '../../magic/comp/BombExplosionComp';
import { ChainSawSystem } from '../../magic/comp/ChainSawComp';
import { CollisionFireballSystem } from '../../magic/comp/CollisionFireballComp';
import { CollisionMotionlessSystem } from '../../magic/comp/CollisionMotionlessComp';
import { CollisionReboundSystem } from '../../magic/comp/CollisionReboundComp';
import { CreateBombExplosionSystem } from '../../magic/comp/CreateBombExplosionComp';
import { DeathFireballSystem } from '../../magic/comp/DeathFireballComp';
import { FireballSystem } from '../../magic/comp/FireballComp';
import { FlyingHooksSystem } from '../../magic/comp/FlyingHooksComp';
import { MagicLifeTimeSystem } from '../../magic/comp/MagicLifeTimeComp';
import { MagicMoveLinearSystem } from '../../magic/comp/motion/MagicMoveLinearComp';
import { TimingFireballSystem } from '../../magic/comp/TimingFireballComp';
import { TriggerCollisionSystem } from '../../magic/comp/TriggerCollisionComp';
import { TriggerTimingSystem } from '../../magic/comp/TriggerTimingComp';
import { DirectionalFlyMoveSystem } from '../../role/comp/DirectionalFlyMoveComp';
import { RestrictMoveSystem } from '../../role/comp/RestrictMoveComp';
import { AttackStateFlySystem } from '../../role/comp/state/attack/AttackStateFlyComp';

/** 魔法系统 */
export class MagicGroupSystem extends ecs.System {
    constructor() {
        super();

        this.add(new FireballSystem());
        this.add(new CollisionFireballSystem());
        this.add(new BombSystem());
        this.add(new CreateBombExplosionSystem());
        this.add(new BombExplosionSystem());
        this.add(new ChainSawSystem());
        this.add(new BlackHoleSystem());
        this.add(new TimingFireballSystem());
        this.add(new FlyingHooksSystem());
        this.add(new DeathFireballSystem());

        //效果相关
        this.add(new TriggerTimingSystem());
        this.add(new TriggerCollisionSystem());
        this.add(new BlackHoleEffectSystem());
        this.add(new RemoveBlackHoleEffectSystem());

        //移动相关
        this.add(new MagicMoveLinearSystem());
        this.add(new CollisionMotionlessSystem());
        this.add(new CollisionReboundSystem());
        this.add(new RestrictMoveSystem());
        this.add(new DirectionalFlyMoveSystem());

        //限制
        this.add(new MagicLifeTimeSystem());

        //技能
        this.add(new AttackStateFlySystem());
    }
}
