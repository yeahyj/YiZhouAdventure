import { ecs } from 'db://assets/res-bundle/base/extensions/cc-ecs/ECS';

/**
 * 负效果组件
 */
export class NegativeEffectComp extends ecs.Comp {
    //影响数量
    affectNum: number = 0;

    addAffectNum(num: number) {
        this.affectNum += num;
    }

    //移除影响数量
    removeAffectNum(num: number) {
        this.affectNum -= num;
    }

    reset(): void {
        this.affectNum = 0;
    }
}
