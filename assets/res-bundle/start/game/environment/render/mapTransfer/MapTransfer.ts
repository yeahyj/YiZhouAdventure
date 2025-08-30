import { _decorator, SpriteFrame, Sprite } from 'cc';
import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from 'db://assets/res-bundle/base/config/EnvironmentConfig';
import { getEnvironmentResConfig } from 'db://assets/res-bundle/base/config/EnvironmentResConfig';
import { EnabledComp } from '../../../role/comp/EnabledComp';
import { BaseEnvironment } from '../../comp/base/BaseEnvironment';
import { RoomEnvironmentModelComp } from '../../comp/RoomEnvironmentModelComp';
import { MapTransferData } from '../../help/EnvironmentInterface';
import { AnimationEventData } from '../../../common/help/CommonInterface';
import { GridMoveType } from '../../../room/help/RoomEnum';
import { AddGridMoveTypeComp } from '../../comp/AddGridMoveTypeComp';
import { MapTransferStateType } from '../../help/EnvironmentEnum';
import { Label } from 'cc';
import { GridEnterMapComp } from '../../comp/GridEnterMapComp';
import { CheckPlayerEnterGirdComp } from '../../comp/CheckPlayerEnterGirdComp';

const { ccclass, property } = _decorator;

@ccclass('MapTransfer')
export class MapTransfer extends BaseEnvironment {
    @property(Sprite)
    openSp: Sprite = null!;

    @property(Sprite)
    openInnerSp: Sprite = null!;

    @property(Sprite)
    closeSp: Sprite = null!;

    @property(Label)
    nameLabel: Label = null!;

    /**资源路径 */
    openResPath: string = 'res/open/mapTransfer_open_${resType}_${dir}';
    openBgResPath: string = 'res/open/mapTransfer_openInner_${resType}_${dir}';
    closeResPath: string = 'res/close/mapTransfer_close_${resType}_${dir}';

    initCustom(): void {
        let environmentData = <MapTransferData>this.ent.get(RoomEnvironmentModelComp).initData;
        let resConfig = getEnvironmentResConfig(environmentData.type)!;
        let baseConfig = getEnvironmentConfig(resConfig!.environmentId)!;
        let openResPath = this.openResPath
            .replace('${resType}', environmentData.data.resType)
            .replace('${dir}', environmentData.data.dir);
        let openBgResPath = this.openBgResPath
            .replace('${resType}', environmentData.data.resType)
            .replace('${dir}', environmentData.data.dir);
        let closeResPath = this.closeResPath
            .replace('${resType}', environmentData.data.resType)
            .replace('${dir}', environmentData.data.dir);

        app.manager.loader.load({
            path: baseConfig.resPath + openResPath + '/spriteFrame',
            bundle: resConfig.resBundle,
            type: SpriteFrame,
            onComplete: (spriteFrame: SpriteFrame | null) => {
                if (!spriteFrame) {
                    console.error(`地图传送门资源加载失败: ${baseConfig.resPath + openResPath}`);
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
                    console.error(`地图传送门背景资源加载失败: ${baseConfig.resPath + openBgResPath}`);
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
                    console.error(`地图传送门关闭资源加载失败: ${baseConfig.resPath + closeResPath}`);
                    return;
                }
                if (!this.ent.get(EnabledComp)) {
                    console.log('实体已经被销毁');
                    return;
                }

                this.closeSp.spriteFrame = spriteFrame;
            },
        });

        this.ent.add(CheckPlayerEnterGirdComp);
        this.ent.add(GridEnterMapComp).mapId = environmentData.data.mapId;

        this.nameLabel.string = environmentData.data.name;

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

        if (environmentData.data.state === MapTransferStateType.OPEN) {
            this.view!.playAnimation({ name: 'open' });
            this.ent.add(AddGridMoveTypeComp).init(GridMoveType.FREE, true);
        } else {
            this.view!.playAnimation({ name: 'close' });
            this.ent.add(AddGridMoveTypeComp).init(GridMoveType.BLOCK, true);
        }
    }
}
