import { _decorator, SpriteFrame, Sprite } from 'cc';
import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from 'db://assets/res-bundle/base/config/EnvironmentConfig';
import { getEnvironmentResConfig } from 'db://assets/res-bundle/base/config/EnvironmentResConfig';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { BaseEnvironment } from '../../comp/base/BaseEnvironment';
import { RoomEnvironmentModelComp } from '../../comp/RoomEnvironmentModelComp';
import { WallData } from '../../help/EnvironmentInterface';
import { GridMoveType } from '../../../room/help/RoomEnum';
import { AddGridMoveTypeComp } from '../../comp/AddGridMoveTypeComp';

const { ccclass, property } = _decorator;

@ccclass('Wall')
export class Wall extends BaseEnvironment {
    /**资源路径 */
    resPath: string = 'res/wall_${resType}_${dir}';

    initCustom(): void {
        let environmentData = <WallData>this.ent.get(RoomEnvironmentModelComp).initData;
        let resConfig = getEnvironmentResConfig(environmentData.type)!;
        let baseConfig = getEnvironmentConfig(resConfig!.environmentId)!;
        let path = this.resPath
            .replace('${resType}', environmentData.data.resType)
            .replace('${dir}', environmentData.data.dir);
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

        this.ent.add(AddGridMoveTypeComp).init(GridMoveType.BLOCK);
    }
}
