import { Prefab, instantiate } from 'cc';
import { MapLayersType } from '../../../../../../app-builtin/app-model/export.type';
import { app } from '../../../../../../app/app';
import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../../base/extensions/cc-ecs/ECSEntity';
import { MarkerCollisionComp } from '../../../common/comp/mark/MarkerCollisionComp';
import { BaseVFX } from '../../../vfx/render/base/BaseVFX';
import { MapModelComp } from '../../../map/comp/MapModelComp';
import { GameModelComp } from '../../../game/comp/GameModelComp';

/**打击特效 */
@ecs.register('VFXPercussionComp')
export class VFXPercussionComp extends ecs.Comp {
    reset(): void {}
}

/**打击特效系统 */
export class VFXPercussionSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(VFXPercussionComp, MarkerCollisionComp);
    }

    constructor() {
        super();
    }
    entityEnter(e: ECSEntity): void {
        let markerComp = e.get(MarkerCollisionComp);
        let collision = markerComp.marks;
        if (collision.length == 0) return;
        for (let i = 0; i < collision.length; i++) {
            let collisionPoint = collision[i].point?.clone();
            if (!collisionPoint) continue;
            app.manager.loader.load({
                path: 'game/vfx/render/percussion/VFXPercussion',
                bundle: 'start',
                type: Prefab,
                onComplete: (result: Prefab | null) => {
                    if (!result) return;
                    let node = instantiate(result);
                    let vfx = node.getComponent(BaseVFX);
                    if (vfx) {
                        ecs.getSingleton(GameModelComp)
                            .mapEntity.get(MapModelComp)
                            .addNodeToRoom(node, MapLayersType.VFX);
                        node.setPosition(collisionPoint);
                    }
                },
            });
            e.remove(VFXPercussionComp);
        }
    }
}
