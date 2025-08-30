// 自动生成的配置索引文件，请勿手动修改
import { ICompConfig, DB_CompConfig } from './CompConfig';
import { IGameMapConfig, DB_GameMapConfig } from './GameMapConfig';
import { IProjectileConfig, DB_ProjectileConfig } from './ProjectileConfig';
import { IEnvironmentConfig, DB_EnvironmentConfig } from './EnvironmentConfig';
import { IEnvironmentResConfig, DB_EnvironmentResConfig } from './EnvironmentResConfig';
import { IRoleConfig, DB_RoleConfig } from './RoleConfig';
import { IResourceConfig, DB_ResourceConfig } from './ResourceConfig';
import { IStaffConfig, DB_StaffConfig } from './StaffConfig';
import { IMagicStonesConfig, DB_MagicStonesConfig } from './MagicStonesConfig';

// 所有配置表接口
export interface IConfigs {
    CompConfig: ICompConfig;
    GameMapConfig: IGameMapConfig;
    ProjectileConfig: IProjectileConfig;
    EnvironmentConfig: IEnvironmentConfig;
    EnvironmentResConfig: IEnvironmentResConfig;
    RoleConfig: IRoleConfig;
    ResourceConfig: IResourceConfig;
    StaffConfig: IStaffConfig;
    MagicStonesConfig: IMagicStonesConfig;
}

// 所有配置表数据
export const Configs = {
    CompConfig: DB_CompConfig,
    GameMapConfig: DB_GameMapConfig,
    ProjectileConfig: DB_ProjectileConfig,
    EnvironmentConfig: DB_EnvironmentConfig,
    EnvironmentResConfig: DB_EnvironmentResConfig,
    RoleConfig: DB_RoleConfig,
    ResourceConfig: DB_ResourceConfig,
    StaffConfig: DB_StaffConfig,
    MagicStonesConfig: DB_MagicStonesConfig,
} as const;

// 类型安全的获取函数
export function getConfig<T extends keyof IConfigs>(table: T, id: string | number): IConfigs[T] | undefined {
    const db = Configs[table] as Record<string, IConfigs[T]>;
    return db[String(id)];
}

// 获取配置表所有数据
export function getAllConfigs<T extends keyof IConfigs>(table: T): IConfigs[T][] {
    const db = Configs[table] as Record<string, IConfigs[T]>;
    return Object.values(db);
}

// 根据条件查找配置
export function findConfig<T extends keyof IConfigs>(
    table: T,
    predicate: (item: IConfigs[T]) => boolean
): IConfigs[T] | undefined {
    const items = getAllConfigs(table);
    return items.find(predicate);
}

// 根据条件查找所有匹配的配置
export function findConfigs<T extends keyof IConfigs>(
    table: T,
    predicate: (item: IConfigs[T]) => boolean
): IConfigs[T][] {
    const items = getAllConfigs(table);
    return items.filter(predicate);
}

// 配置表工具类型
export type ConfigTableKeys = keyof IConfigs;
export type ConfigItem<T extends ConfigTableKeys> = IConfigs[T];

// 导出所有接口和数据
export type {
    ICompConfig,
    IGameMapConfig,
    IProjectileConfig,
    IEnvironmentConfig,
    IEnvironmentResConfig,
    IRoleConfig,
    IResourceConfig,
    IStaffConfig,
    IMagicStonesConfig,
};

export {
    DB_CompConfig,
    DB_GameMapConfig,
    DB_ProjectileConfig,
    DB_EnvironmentConfig,
    DB_EnvironmentResConfig,
    DB_RoleConfig,
    DB_ResourceConfig,
    DB_StaffConfig,
    DB_MagicStonesConfig,
};