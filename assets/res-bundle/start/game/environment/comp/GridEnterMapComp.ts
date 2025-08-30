import { PopConfirm } from 'db://assets/app-bundle/app-view/pop/confirm/native/PopConfirm';
import { app } from 'db://assets/app/app';
import { ecs } from '../../../../base/extensions/cc-ecs/ECS';
import { ECSEntity } from '../../../../base/extensions/cc-ecs/ECSEntity';
import { GameModelComp } from '../../game/comp/GameModelComp';
import { PositionComp } from '../../role/comp/PositionComp';
import { StateEnterGirdState } from '../help/EnvironmentEnum';
import { RoomEnvironmentModelComp } from './RoomEnvironmentModelComp';
import { StateEnterGirdComp } from './state/StateEnterGirdComp';
import { SwitchMapComp } from '../../game/comp/SwitchMapComp';
import { LockMoveComp } from '../../role/comp/LockMoveComp';
import { LockStaffCastComp } from '../../role/comp/LockStaffCastComp';

/**
 * 格子进入地图组件
 */
@ecs.register('GridEnterMapComp')
export class GridEnterMapComp extends ecs.Comp {
    mapId: number = 0;

    reset(): void {}
}

/**格子进入地图系统 */
export class GridEnterMapSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(GridEnterMapComp, RoomEnvironmentModelComp, PositionComp, StateEnterGirdComp);
    }

    update(entity: ECSEntity): void {
        if (entity.get(StateEnterGirdComp).state == StateEnterGirdState.ENTER) {
            let player = ecs.getSingleton(GameModelComp).playerEntity;
            if (!player) {
                return;
            }

            player.add(LockMoveComp);
            player.add(LockStaffCastComp);
            app.manager.ui.show<PopConfirm>({
                name: 'PopConfirm',
                data: {
                    title: '提示',
                    content: '是否进入地图？',
                    onConfirm: () => {
                        console.log('确认');
                        ecs.getSingleton(GameModelComp).gameEntity.add(SwitchMapComp).mapId =
                            entity.get(GridEnterMapComp).mapId;
                    },
                    onCancel: () => {
                        console.log('取消');
                        entity.parent!.isActive = true;
                        player.remove(LockMoveComp);
                        player.remove(LockStaffCastComp);
                    },
                },
            });
        }
    }
}
