import { ecs } from '../../../../../base/extensions/cc-ecs/ECS';
import { StaffModelComp } from '../StaffModelComp';

/**
 * 基础魔法石组件
 */
export class BaseMagicStoneComp extends ecs.Comp {
    stoneId: number = 0;
    /**魔法石所属的法杖 */
    staffModel: StaffModelComp = null!;
    /** 法杖施法的时候的投射物魔法石 */
    projectileStone: BaseMagicStoneComp[] = [];
    /**法杖施法的时候的修正魔法石 */
    modifyStone: BaseMagicStoneComp[] = [];
    //额外组件
    extraModifyStone: BaseMagicStoneComp[] = [];

    init(data: {
        staffModel: StaffModelComp;
        stoneId: number;
        projectileStone: BaseMagicStoneComp[];
        modifyStone: BaseMagicStoneComp[];
    }) {
        this.staffModel = data.staffModel;
        this.stoneId = data.stoneId;
        this.projectileStone = data.projectileStone;
        this.modifyStone = data.modifyStone;
        this.initStone();
    }

    initStone() {}

    reset(): void {
        this.projectileStone.length = 0;
        this.modifyStone.length = 0;
        this.extraModifyStone.length = 0;
        this.stoneId = 0;
        this.staffModel = null!;
    }
}
