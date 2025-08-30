import { _decorator } from 'cc';
import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';
import { CommonNumericMap } from '../../common/help/numeric/common/CommonNumericMap';
import { CommonAttributeData } from '../../common/help/CommonInterface';

const { ccclass, property, menu } = _decorator;

/**
 *  公共属性
 */
@ecs.register('CommonAttributeComp')
export class CommonAttributeComp extends ecs.Comp {
    /** 角色属性 */
    attributes: CommonNumericMap = null!;

    init(data: CommonAttributeData) {
        this.attributes = new CommonNumericMap();

        this.attributes.init(data as any);
    }

    reset(): void {}
}
