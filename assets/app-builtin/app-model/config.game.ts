import { Size } from 'cc';
import { IModel } from '../../../extensions/app/assets/base/BaseModel';
// config中不能定义任何方法, 任何变量在外部访问都是readonly
export default class Game implements IModel<Game> {
    /**战斗武器个数 */
    BattleWeaponNum: number = 3;
    /**战斗道具个数 */
    BattleItemNum: number = 0;
    /**每种类型背包格子数 */
    BagCapacity: number = 20;
    /**仓库格子数 */
    WarehouseCapacity: number = 100;
    /**普通怪物技能插件掉落概率 */
    NormalMonsterSkillPluginDropRate: number = 0.02;
    /**精英怪物技能插件掉落概率 */
    EliteMonsterSkillPluginDropRate: number = 0.06;
    /**boss怪物技能插件掉落概率 */
    BossMonsterSkillPluginDropRate: number = 0.1;
    /**魔法石掉落概率 */
    MagicStoneDropRate: number = 0;
    /**装备掉落概率 */
    EquipmentDropRate: number = 0.05;
    /**武器掉落概率 */
    WeaponDropRate: number = 0.05;
    /**金钱掉落概率 */
    MoneyDropRate: number = 0.4;
    /**金钱掉落范围 */
    MoneyDropRange: number[] = [100, 1000];
    /**道具收集距离 */
    CollectItemDistance: number = 100;

    /**小秘境难度 */
    MiniDungeonDifficulty: number[] = [0.5, 1, 3, 6];
    /**小秘境难度名字 */
    MiniDungeonDifficultyName: string[] = ['简单', '普通', '困难', '地狱'];
    /**角色满级 */
    PlayerMaxLv: number = 70;
    /**默认暴击伤害倍率 */
    CritDamageRate: number = 4;

    /**无限地图长宽 */
    InfiniteMapSize: number = 9999999;
    /**地图块大小 */
    MapTiledSize: Size = new Size(32, 32);
}
