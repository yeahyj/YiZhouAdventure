import { CompType } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECSModel';
import { DungeonLayoutCommon1Comp } from '../../../../start/game/room/comp/dungeon/commonRoom/layout/DungeonLayoutCommon1Comp';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

export const DungeonRoomCommonLayout: CompType<ecs.IComp>[] = [DungeonLayoutCommon1Comp];

export const DungeonRoomCommonMonster: CompType<ecs.IComp>[] = [];
