import { _decorator } from 'cc';
import BaseManager from '../../../../extensions/app/assets/base/BaseManager';
import { ecs } from '../../../res-bundle/base/extensions/cc-ecs/ECS';

const { ccclass } = _decorator;
@ccclass('BattleManager')
export class BattleManager extends BaseManager {
    rootSys: ecs.RootSystem = new ecs.RootSystem();

    update(dt: number) {
        this.rootSys?.execute(dt);
    }
}
