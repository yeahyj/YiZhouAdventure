import { _decorator, Prefab, JsonAsset } from 'cc';
import { app } from 'db://assets/app/app';
import { getEnvironmentConfig } from 'db://assets/res-bundle/base/config/EnvironmentConfig';
import { getAllEnvironmentResConfig } from 'db://assets/res-bundle/base/config/EnvironmentResConfig';
import { getAllRoleConfig } from 'db://assets/res-bundle/base/config/RoleConfig';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { RoomSizeType } from 'db://assets/res-bundle/start/game/room/help/RoomEnum';

const { ccclass, property } = _decorator;
/**
 * 游戏资源组件
 */
@ccclass('GameResComp')
@ecs.register('GameResComp')
export class GameResComp extends ecs.Comp {
    roomConfigByType: Map<RoomSizeType, Record<string, any>[]> = new Map();
    roomConfigById: Map<number, Record<string, any>> = new Map();
    tilesConfigById: Map<number, Record<string, any>> = new Map();
    rolePrefab: Map<number, Prefab> = new Map();

    init(loadOver: () => void) {
        let task = app.lib.task
            .createAny()
            .add((next, retry) => {
                app.manager.loader.loadDir({
                    path: 'game/map/help/config/map',
                    bundle: 'start',
                    type: JsonAsset,
                    onComplete: (asset: JsonAsset[] | null) => {
                        if (asset) {
                            console.log('地图数据加载完成', asset);
                            for (const item of asset) {
                                let jsonProperties = item.json?.['properties'];
                                if (jsonProperties) {
                                    for (const property of jsonProperties) {
                                        if (property['name'] === 'type') {
                                            let type = property['value'];
                                            let config = this.roomConfigByType.get(type) ?? [];
                                            config.push(item.json!);
                                            this.roomConfigByType.set(type, config);
                                        } else if (property['name'] === 'id') {
                                            let id = property['value'];
                                            let config = item.json!;
                                            this.roomConfigById.set(id, config);
                                        }
                                    }
                                }
                            }
                        }
                        next();
                    },
                });
            })
            .add((next, retry) => {
                app.manager.loader.loadDir({
                    path: 'game/map/help/config/tiles',
                    bundle: 'start',
                    type: JsonAsset,
                    onComplete: (asset: JsonAsset[] | null) => {
                        if (asset) {
                            console.log('地图块数据加载完成', asset);
                            for (const item of asset) {
                                let tiles = item.json?.['tiles'];
                                if (tiles) {
                                    for (const tilesItem of tiles) {
                                        let config: Record<string, any> = {};
                                        for (const property of tilesItem.properties) {
                                            config[property['name']] = property['value'];
                                        }
                                        this.tilesConfigById.set(tilesItem.id + 1, config);
                                    }
                                }
                            }
                        }
                        next();
                    },
                });
            });

        //加载角色
        let roleConfig = getAllRoleConfig();
        for (const key in roleConfig) {
            const config = roleConfig[key];
            task.add((next, retry) => {
                app.manager.loader.load({
                    path: config.path,
                    bundle: config.bundle,
                    type: Prefab,
                    onComplete: (result: Prefab | null) => {
                        if (result) {
                            this.rolePrefab.set(config.id, result);
                        }
                        next();
                    },
                });
            });
        }

        //加载环境资源
        let loadedEnvironmentResConfig = new Set<string>();
        let environmentResConfig = getAllEnvironmentResConfig();
        for (const key in environmentResConfig) {
            const config = environmentResConfig[key];

            loadedEnvironmentResConfig.add(key + '_' + config.resBundle);
            if (!loadedEnvironmentResConfig.has(key + '_' + config.resBundle)) {
                let path = getEnvironmentConfig(key)?.resPath;
                if (path) {
                    task.add((next, retry) => {
                        app.manager.loader.loadDir({
                            path: path,
                            bundle: config.resBundle,
                        });
                    });
                }
            }
        }

        task.start(() => {
            console.log('角色，环境数据加载完成');
            loadOver();
        });
    }

    loadResByBundle(bundle: string) {}

    /**
     * 根据类型获取所有房间配置
     * @param type 房间类型
     * @returns 房间配置
     */
    getRoomConfigByType(type: RoomSizeType): Record<string, any>[] {
        return this.roomConfigByType.get(type) ?? [];
    }

    /**
     * 根据类型获取随机房间配置
     * @param type 房间类型
     * @returns 房间配置
     */
    getOneRoomConfigByType(type: RoomSizeType): Record<string, any> {
        let config = this.getRoomConfigByType(type) ?? [];
        return config[Math.floor(Math.random() * config.length)];
    }

    /**
     * 根据id获取房间配置
     * @param id 房间id
     * @returns 房间配置
     */
    getRoomConfigById(id: number): Record<string, any> {
        return this.roomConfigById.get(id) ?? {};
    }

    /**
     * 根据id获取地图块配置
     * @param id 地图块id
     * @returns 配置表中的地图快id
     */
    getTileConfigById(id: number): Record<string, any> {
        return this.tilesConfigById.get(id) ?? {};
    }

    reset(): void {}
}
