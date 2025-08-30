/* eslint-disable */
import { Component,director,Director } from 'cc';
import { app } from '../../app/app';
import { EDITOR,EDITOR_NOT_IN_PREVIEW } from 'cc/env';

export type IReadOnly<T> = { readonly [P in keyof T]: T[P] extends Function ? T[P] : (T[P] extends Object ? IReadOnly<T[P]> : T[P]); };

export type IViewName = "PageBattle"|"PageHome"|"PopConfirm"|"PopEquipStone"|"PopSet"
export type IViewNames = IViewName[]
export type IMiniViewName = "PaperBattleInfo"|"PaperBattleMap"|"PaperBattleRocker"|"PaperBattleTask"
export type IMiniViewNames = IMiniViewName[]
export type IMusicName = "never"
export type IMusicNames = IMusicName[]
export type IEffectName = "never"
export type IEffectNames = IEffectName[]

import config_game from '../app-model/config.game'
import store_game from '../app-model/store.game'
import store_help from '../app-model/store.help'
import store_player from '../app-model/store.player'
import {BattleController} from '../app-controller/BattleController'
import {BattleManager} from '../app-manager/battle/BattleManager'
import EventManager from '../../../extensions/app/assets/manager/event/EventManager'
import LoaderManager from '../../../extensions/app/assets/manager/loader/LoaderManager'
import SoundManager from '../../../extensions/app/assets/manager/sound/SoundManager'
import TimerManager from '../../../extensions/app/assets/manager/timer/TimerManager'
import UIManager from '../../../extensions/app/assets/manager/ui/UIManager'
export type IApp = {
    Controller: {Battle:typeof BattleController},
    controller: {battle:IReadOnly<BattleController>},
    Manager: {Battle:Omit<typeof BattleManager,keyof Component>,Event:Omit<typeof EventManager,keyof Component>,Loader:Omit<typeof LoaderManager,keyof Component>,Sound:Omit<typeof SoundManager,keyof Component>,Timer:Omit<typeof TimerManager,keyof Component>,UI:Omit<typeof UIManager,keyof Component>},
    manager: {battle:Omit<BattleManager,keyof Component>,event:Omit<EventManager,keyof Component>,loader:Omit<LoaderManager,keyof Component>,sound:Omit<SoundManager<IEffectName,IMusicName>,keyof Component>,timer:Omit<TimerManager,keyof Component>,ui:Omit<UIManager<IViewName,IMiniViewName>,keyof Component>},
    data: {},
    config: {game:IReadOnly<config_game>}
    store: {game:IReadOnly<store_game>,help:IReadOnly<store_help>,player:IReadOnly<store_player>}
}

function init(){
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) Object.assign(app.config, {game:new config_game()})
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) Object.assign(app.data, {})
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) Object.assign(app.store, {game:new store_game(),help:new store_help(),player:new store_player()})

if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) Object.assign(app.Controller, {Battle:BattleController})
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) Object.assign(app.controller, {battle:new BattleController()})
}
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) director.on(Director.EVENT_RESET,init)
if(!EDITOR||!EDITOR_NOT_IN_PREVIEW) init()
