import { Vec3, Prefab, instantiate } from 'cc';
import { MapLayersType } from 'db://assets/app-builtin/app-model/export.type';
import { app } from 'db://assets/app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { DamageFlyText } from '../../common/render/damageFlyText/DamageFlyText';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { MapModelComp } from '../../map/comp/MapModelComp';
import { PositionComp } from './PositionComp';

/**
 * 伤害飘字
 */
@ecs.register('DamageFlyTextComp')
export class DamageFlyTextComp extends ecs.Comp {
    //等待中的
    readyText: number[] = [];
    //间隔时间
    interval: number = 0.3;
    //当前间隔时间
    curInterval: number = 0.3;

    addText(text: number): void {
        this.readyText.push(text);
        this.curInterval = 0.3;
    }

    reset(): void {}
}

/**生命检测系统 */
export class DamageFlyTextSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(DamageFlyTextComp);
    }

    constructor() {
        super();
    }

    update(e: ecs.Entity): void {
        let clyTextComp = e.get(DamageFlyTextComp);
        if (clyTextComp.readyText.length > 0 && clyTextComp.curInterval >= clyTextComp.interval) {
            let text = clyTextComp.readyText.shift() ?? 0;
            //创建飘字
            this.createDamageFlyText(text, e.get(PositionComp).getPosition());
            clyTextComp.curInterval = 0;
        } else if (clyTextComp.curInterval < clyTextComp.interval) {
            clyTextComp.curInterval += this.dt;
        }
    }

    //创建飘字
    createDamageFlyText(text: number, startPos: Vec3) {
        app.manager.loader.load({
            path: 'game/common/render/damageFlyText/DamageFlyText',
            bundle: 'start',
            type: Prefab,
            onComplete: (result: Prefab | null) => {
                if (result) {
                    let node = instantiate(result);
                    ecs.getSingleton(GameModelComp).mapEntity.get(MapModelComp).addNodeToRoom(node, MapLayersType.TIP);
                    node.getComponent(DamageFlyText)!.init(text, startPos);
                }
            },
        });
    }

    private exit(e: ecs.Entity) {}
}
