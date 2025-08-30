import { Node, UIOpacity, _decorator, tween } from 'cc';
import BaseAppInit from '../../../extensions/app/assets/base/BaseAppInit';
import { app } from '../../app/app';
const { ccclass, property } = _decorator;

@ccclass('AppInit')
export class AppInit extends BaseAppInit {
    @property(Node)
    private logo: Node = null!;

    AdminBundleName = 'app-admin';
    ModelBundleName = 'app-model';
    ControlBundleName = 'app-control';
    ControllerBundleName = 'app-controller';
    ManagerBundleName = 'app-manager';
    DotReWriteFuncs = ['startInit', 'nextInit'];
    /**
     * 获得用户资源总量，这里返回几，就需要用户自行调用几次nextInit
     */
    protected getUserAssetNum(): number {
        return 0;
    }

    protected onLoad() {
        // 执行初始化操作
        const opacity = this.logo.getComponent(UIOpacity)!;
        opacity.opacity = 0;
        tween(opacity)
            .to(0.5, { opacity: 255 })
            .delay(1)
            .to(0.5, { opacity: 0 })
            .call(() => {})
            .start();
        this.initData();
    }

    protected start() {}

    /**初始化数据 */
    initData() {
        app.lib.task
            .createAny()
            .add((next, retry) => {
                app.manager.loader.loadBundle({
                    bundle: 'base',
                    onComplete: () => {
                        console.log('base 加载完成');
                        next();
                    },
                });
            })
            .start(() => {
                this.startInit();
            });
    }

    onUserInit() {
        app.store.game.init();
    }

    protected onProgress(completed: number, total: number): any {
        return completed / total;
    }

    protected onFinish() {
        app.lib.task
            .createAny()
            .add((next, retry) => {
                app.manager.loader.loadBundle({
                    bundle: 'start',
                    onComplete: () => {
                        console.log('start 加载完成');
                        next();
                    },
                });
            })
            .add((next, retry) => {
                app.manager.loader.loadBundle({
                    bundle: 'dungeon',
                    onComplete: () => {
                        console.log('dungeon 加载完成');
                        next();
                    },
                });
            })
            .start(() => {
                app.store.game.init();
                // 执行完成操作
                this.node.destroy();
            });
    }
}
