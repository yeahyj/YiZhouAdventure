import { _decorator, Camera, Node } from 'cc';

import BaseView from '../../../../../../../extensions/app/assets/base/BaseView';
import { ecs } from '../../../../../../res-bundle/base/extensions/cc-ecs/ECS';
import { GameModelComp } from 'db://assets/res-bundle/start/game/game/comp/GameModelComp';
import { GameResComp } from 'db://assets/res-bundle/start/game/game/comp/GameResComp';
import { SwitchMapComp } from 'db://assets/res-bundle/start/game/game/comp/SwitchMapComp';

const { ccclass, property } = _decorator;
@ccclass('PaperBattleMap')
export class PaperBattleMap extends BaseView {
    @property(Node)
    mapNode: Node = null!;

    @property(Camera)
    mapCamera: Camera = null!;

    start() {
        ecs.getSingleton(GameModelComp).init({
            mapNode: this.mapNode,
            mapCamera: this.mapCamera,
        });

        ecs.getSingleton(GameModelComp)
            .gameEntity.add(GameResComp)
            .init(() => {
                ecs.getSingleton(GameModelComp).gameEntity.add(SwitchMapComp).mapId = 1;
            });
    }
}
