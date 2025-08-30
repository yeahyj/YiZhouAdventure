import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from 'db://assets/res-bundle/base/config/EnvironmentConfig';
import { getEnvironmentResConfig } from 'db://assets/res-bundle/base/config/EnvironmentResConfig';
import { AnimationEventData } from '../../../common/help/CommonInterface';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { BaseEnvironment } from '../../comp/base/BaseEnvironment';
import { RoomEnvironmentModelComp } from '../../comp/RoomEnvironmentModelComp';
import { TreasureChestData } from '../../help/EnvironmentInterface';
import { _decorator, SpriteFrame, Sprite } from 'cc';
import { TreasureChestAnimationStateType } from '../../help/EnvironmentEnum';

const { ccclass, property } = _decorator;

@ccclass('TreasureChest')
export class TreasureChest extends BaseEnvironment {
    /**资源路径 */
    resPath: string = 'res/chest_${resType}_${state}_${lv}';

    initCustom(): void {
        this.view!.playAnimation = (data: AnimationEventData) => {
            let environmentData = <TreasureChestData>this.ent.get(RoomEnvironmentModelComp).initData;
            let resConfig = getEnvironmentResConfig(environmentData.type)!;
            let baseConfig = getEnvironmentConfig(resConfig!.environmentId)!;
            let path = this.resPath
                .replace('${resType}', environmentData.data.resType)
                .replace('${lv}', environmentData.data.lv);
            if (data.name === TreasureChestAnimationStateType.OPEN) {
                path = path.replace('${state}', 'open');
            } else {
                path = path.replace('${state}', 'closed');
            }

            app.manager.loader.load({
                path: baseConfig.resPath + path + '/spriteFrame',
                bundle: resConfig.resBundle,
                type: SpriteFrame,
                onComplete: (spriteFrame: SpriteFrame | null) => {
                    if (!spriteFrame) {
                        console.error(`地板资源加载失败: ${baseConfig.resPath + path}`);
                        return;
                    }
                    if (!this.ent.get(EnabledComp)) {
                        console.log('实体已经被销毁');
                        return;
                    }

                    this.view!.getComponent(Sprite)!.spriteFrame = spriteFrame;
                },
            });
        };
    }
}
