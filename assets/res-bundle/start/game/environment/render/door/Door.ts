import { _decorator, SpriteFrame, Sprite } from 'cc';
import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from 'db://assets/res-bundle/base/config/EnvironmentConfig';
import { getEnvironmentResConfig } from 'db://assets/res-bundle/base/config/EnvironmentResConfig';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { BaseEnvironment } from '../../comp/base/BaseEnvironment';
import { RoomEnvironmentModelComp } from '../../comp/RoomEnvironmentModelComp';
import { DoorData } from '../../help/EnvironmentInterface';
import { AnimationEventData } from '../../../common/help/CommonInterface';
import { GridMoveType } from '../../../room/help/RoomEnum';
import { AddGridMoveTypeComp } from '../../comp/AddGridMoveTypeComp';
import { DoorAnimationStateType } from '../../help/EnvironmentEnum';
import { GridPlayerEnterRoomComp } from '../../comp/GridPlayerEnterRoomComp';
import { CheckPlayerEnterGirdComp } from '../../comp/CheckPlayerEnterGirdComp';

const { ccclass, property } = _decorator;

@ccclass('Door')
export class Door extends BaseEnvironment {
    @property(Sprite)
    openSp: Sprite = null!;

    @property(Sprite)
    openInnerSp: Sprite = null!;

    @property(Sprite)
    closeSp: Sprite = null!;

    /**资源路径 */
    openResPath: string = 'res/open/door_open_${resType}_${dir}';
    openBgResPath: string = 'res/open/door_openInner_${resType}_${dir}';
    closeResPath: string = 'res/close/door_close_${resType}_${dir}';

    initCustom(): void {
        this.ent.add(GridPlayerEnterRoomComp);
        this.ent.add(CheckPlayerEnterGirdComp);
        let environmentData = <DoorData>this.ent.get(RoomEnvironmentModelComp).initData;
        let resConfig = getEnvironmentResConfig(environmentData.type)!;
        let baseConfig = getEnvironmentConfig(resConfig!.environmentId)!;

        let resType = 'start';
        let openResPath = this.openResPath.replace('${resType}', resType).replace('${dir}', environmentData.data.dir);
        let openBgResPath = this.openBgResPath
            .replace('${resType}', resType)
            .replace('${dir}', environmentData.data.dir);
        let closeResPath = this.closeResPath.replace('${resType}', resType).replace('${dir}', environmentData.data.dir);

        app.manager.loader.load({
            path: baseConfig.resPath + openResPath + '/spriteFrame',
            bundle: resConfig.resBundle,
            type: SpriteFrame,
            onComplete: (spriteFrame: SpriteFrame | null) => {
                if (!spriteFrame) {
                    console.error(`门资源加载失败: ${baseConfig.resPath + openResPath}`);
                    return;
                }
                if (!this.ent.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                this.openSp.spriteFrame = spriteFrame;
            },
        });

        app.manager.loader.load({
            path: baseConfig.resPath + openBgResPath + '/spriteFrame',
            bundle: resConfig.resBundle,
            type: SpriteFrame,
            onComplete: (spriteFrame: SpriteFrame | null) => {
                if (!spriteFrame) {
                    console.error(`门背景资源加载失败: ${baseConfig.resPath + openBgResPath}`);
                    return;
                }
                if (!this.ent.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                this.openInnerSp.spriteFrame = spriteFrame;
            },
        });

        app.manager.loader.load({
            path: baseConfig.resPath + closeResPath + '/spriteFrame',
            bundle: resConfig.resBundle,
            type: SpriteFrame,
            onComplete: (spriteFrame: SpriteFrame | null) => {
                if (!spriteFrame) {
                    console.error(`门关闭资源加载失败: ${baseConfig.resPath + closeResPath}`);
                    return;
                }
                if (!this.ent.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                this.closeSp.spriteFrame = spriteFrame;
            },
        });

        this.view!.playAnimation = (data: AnimationEventData) => {
            if (data.name === 'open') {
                this.openSp.node.active = true;
                this.openInnerSp.node.active = true;
                this.closeSp.node.active = false;
            } else if (data.name === 'close') {
                this.openSp.node.active = false;
                this.openInnerSp.node.active = false;
                this.closeSp.node.active = true;
            }
        };

        if (environmentData.data.state === DoorAnimationStateType.OPEN) {
            this.view!.playAnimation({ name: 'open' });
            this.ent.add(AddGridMoveTypeComp).init(GridMoveType.FREE, true);
        } else {
            this.view!.playAnimation({ name: 'close' });
            this.ent.add(AddGridMoveTypeComp).init(GridMoveType.BLOCK, true);
        }
    }
}
