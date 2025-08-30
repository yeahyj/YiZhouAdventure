// 自动生成的配置文件，请勿手动修改

/**
 * GameMapConfig 配置表接口
 */
export interface IGameMapConfig {
    id: number; // 地图id
    name: string; // 名字
    className: string; // 类名
}

/**
 * GameMapConfig 配置表数据
 */
export const DB_GameMapConfig: Readonly<Record<string, IGameMapConfig>> = {
  '1': {
    'id': 1,
    'name': '开始',
    'className': 'MapStartComp'
  },
  '100101': {
    'id': 100101,
    'name': '地牢',
    'className': 'MapDungeonComp'
  }
} as const;

/**
 * 获取 GameMapConfig 配置项
 * @param id 配置ID
 */
export function getGameMapConfig(id: string | number): IGameMapConfig | undefined {
    return DB_GameMapConfig[String(id)];
}

/**
 * 获取所有 GameMapConfig 配置项
 */
export function getAllGameMapConfig(): IGameMapConfig[] {
    return Object.values(DB_GameMapConfig);
}

/**
 * 查找 GameMapConfig 配置项
 * @param predicate 查找条件
 */
export function findGameMapConfig(predicate: (item: IGameMapConfig) => boolean): IGameMapConfig | undefined {
    return Object.values(DB_GameMapConfig).find(predicate);
}

/**
 * 查找所有匹配的 GameMapConfig 配置项
 * @param predicate 查找条件
 */
export function findAllGameMapConfig(predicate: (item: IGameMapConfig) => boolean): IGameMapConfig[] {
    return Object.values(DB_GameMapConfig).filter(predicate);
}
