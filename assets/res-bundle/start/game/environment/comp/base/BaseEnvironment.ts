import { _decorator } from 'cc';
import { BaseUnit } from '../../../common/render/base/BaseUnit';
const { ccclass, property } = _decorator;

@ccclass('BaseEnvironment')
export class BaseEnvironment extends BaseUnit {
    initEnvironment(data: any): void {}
}
