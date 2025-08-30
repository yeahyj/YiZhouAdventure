import { Vec3 } from 'cc';
import { Agent } from './Agent';
import { cBody } from './Body';
import { Dirty, Trigger, cObject } from './Object';
import { ShapeType, ShapeSupport } from './Shape';

export class cCollider {
    private id: number = 0;
    private pools: Array<cBody> = [];

    private static _inst: cCollider = null!;
    static get inst() {
        if (this._inst == null) {
            this._inst = new cCollider();
        }
        return this._inst;
    }

    private axis: number = -1;
    private frameID: number = 0;
    private insertID: number = 0;
    private bodys: Array<cBody> = [];
    private isDirty: boolean = false;
    private pairs: Map<number, any> = new Map();

    create(obj: cObject) {
        let body = this.pools.pop();
        if (!body) {
            body = new cBody(obj);
            body.id = this.id++;
            return body;
        }

        body.object = obj;
        return body;
    }

    //插入 body, force 强制更新数据
    insert(body: cBody, force: boolean = false) {
        if (!body) return;

        if (!body.inCollider) {
            //不在列表,重新插入
            this.bodys.push(body);
            body.inCollider = true;
        }

        //复位状态
        body.isRemove = false;
        body.isRetrieve = false;
        body.fid = this.insertID++;

        //强制刷新body数据
        if (force && body.object) {
            body.object.isDirty = Dirty.RTS;
            // body.updateBound(Dirty.RTS);
        }
    }

    //删除 body: 提前标记删除 , update中执行移除
    remove(body: cBody, retrieve: boolean = false, immediate: boolean = false) {
        if (!body) return;

        if (immediate) {
            // 立即从bodys中删除
            const index = this.bodys.indexOf(body);
            if (index !== -1) {
                this.bodys.splice(index, 1);
                body.inCollider = false;

                // 如果需要回收，则加入到pools中
                if (retrieve) {
                    this.pools.push(body);
                    body.clear();
                }
            }
        } else {
            body.isRemove = true; //标记移除body
            body.isRetrieve = retrieve; //是否回收复用body?
        }
    }

    //重置回收bodys
    reset() {
        this.axis = -1;
        this.frameID = 0;
        this.isDirty = true;

        //回收bodys
        let bodys = this.bodys;
        for (let i = bodys.length - 1; i >= 0; i--) {
            let body = bodys[i];
            this.pools.push(body);
            body.clear();
        }
        bodys.length = 0;
    }

    //退出释放bodys
    clear() {
        this.id = 0;
        this.axis = -1;
        this.frameID = 0;
        this.isDirty = true;
        this.pools.length = 0;

        //清空bodys
        let bodys = this.bodys;
        for (let i = bodys.length - 1; i >= 0; i--) {
            bodys[i].clear();
        }
        bodys.length = 0;
    }

    update(dt: number) {
        this.reBuild();
        this.triggers();
        Agent.inst.process(this.bodys);
    }

    updateTrigger(dt: number) {
        this.reBuild();
        this.triggers();
    }

    updateAgent(dt: number) {
        Agent.inst.process(this.bodys);
    }

    //相交碰撞测试
    private triggers(): void {
        //resultCB: (a: Body, b: Body) => void

        ++this.frameID;

        let axis = this.axis,
            n = (axis >> 2) & 0x3,
            m = (axis >> 4) & 0x3;

        let bodys = this.bodys;
        let agentMgr = Agent.inst;
        let i = 0,
            j = 0,
            N = bodys.length;
        for (i = 0; i < N; i++) {
            let bi = bodys[i];
            if (bi.isRemove) continue;

            let A = bi.aabb,
                an = A[n],
                am = A[m],
                mask = bi.mask,
                group = bi.group,
                upper = bi.upper,
                objA = bi.object;

            for (j = i + 1; j < N; j++) {
                let bj = bodys[j];
                if (bj.isRemove) continue;

                if (upper <= bj.lower) {
                    break;
                }

                let B = bj.aabb,
                    objB = bj.object;
                let a2b = mask & bj.group,
                    b2a = bj.mask & group;

                if (!(an > B[n + 3] || B[n] > A[n + 3] || am > B[m + 3] || B[m] > A[m + 3])) {
                    if (bi.isAgent && bj.isAgent) {
                        agentMgr.check(bi, bj);
                        agentMgr.check(bj, bi);
                    }

                    if (a2b || b2a) {
                        let at = objA.shape.type;
                        let bt = objB.shape.type;
                        if (at > bt) {
                            if (!ShapeSupport[bt | at](bj, bi)) continue;
                        } else {
                            if (!ShapeSupport[at | bt](bi, bj)) continue;
                        }

                        if (bi.id < bj.id) this.onTrigger(bj, bi, (b2a ? 1 : 0) | (a2b ? 2 : 0));
                        else this.onTrigger(bi, bj, (a2b ? 1 : 0) | (b2a ? 2 : 0));
                    }
                }
            }
        }

        this.endTrigger();
    }

    private onTrigger(bi: cBody, bj: cBody, state: number) {
        let trigger = 0;
        let id = ((bi.id * (bi.id + 1)) >> 1) + bj.id - 1;

        //计算碰撞点
        bi.hasCollisionPoint = true;
        bj.hasCollisionPoint = true;

        //获取形状类型
        const shapeTypeA = bi.object.shape.type;
        const shapeTypeB = bj.object.shape.type;

        //临时世界坐标点
        const worldPoint = new Vec3();

        //根据不同形状计算碰撞点
        if (shapeTypeA === ShapeType.Box && shapeTypeB === ShapeType.Box) {
            // Box 和 Box 的碰撞点计算
            // 获取两个 Box 的中心点和半尺寸
            const centerA = bi.getCenter();
            const centerB = bj.getCenter();
            const halfSizeA = bi.getHalfSize();
            const halfSizeB = bj.getHalfSize();

            // 计算两个 Box 的相交区域
            const minX = Math.max(centerA.x - halfSizeA.x, centerB.x - halfSizeB.x);
            const maxX = Math.min(centerA.x + halfSizeA.x, centerB.x + halfSizeB.x);
            const minY = Math.max(centerA.y - halfSizeA.y, centerB.y - halfSizeB.y);
            const maxY = Math.min(centerA.y + halfSizeA.y, centerB.y + halfSizeB.y);
            const minZ = Math.max(centerA.z - halfSizeA.z, centerB.z - halfSizeB.z);
            const maxZ = Math.min(centerA.z + halfSizeA.z, centerB.z + halfSizeB.z);

            // 计算世界坐标下的碰撞点
            worldPoint.x = (minX + maxX) * 0.5;
            worldPoint.y = (minY + maxY) * 0.5;
            worldPoint.z = (minZ + maxZ) * 0.5;
        } else if (
            (shapeTypeA === ShapeType.Box && shapeTypeB === ShapeType.Sphere) ||
            (shapeTypeA === ShapeType.Sphere && shapeTypeB === ShapeType.Box)
        ) {
            // Box 和 Sphere 的碰撞点计算
            const boxBody = shapeTypeA === ShapeType.Box ? bi : bj;
            const sphereBody = shapeTypeA === ShapeType.Box ? bj : bi;

            const boxCenter = boxBody.getCenter();
            const boxHalfSize = boxBody.getHalfSize();
            const sphereCenter = sphereBody.getCenter();

            // 计算球心到 Box 最近的点
            worldPoint.x = Math.max(boxCenter.x - boxHalfSize.x, Math.min(sphereCenter.x, boxCenter.x + boxHalfSize.x));
            worldPoint.y = Math.max(boxCenter.y - boxHalfSize.y, Math.min(sphereCenter.y, boxCenter.y + boxHalfSize.y));
            worldPoint.z = Math.max(boxCenter.z - boxHalfSize.z, Math.min(sphereCenter.z, boxCenter.z + boxHalfSize.z));
        } else if (shapeTypeA === ShapeType.Sphere && shapeTypeB === ShapeType.Sphere) {
            // Sphere 和 Sphere 的碰撞点计算
            const centerA = bi.getCenter();
            const centerB = bj.getCenter();
            const radiusA = bi.getRaidus();
            const radiusB = bj.getRaidus();

            // 计算两球心连线的单位向量
            const dx = centerB.x - centerA.x;
            const dy = centerB.y - centerA.y;
            const dz = centerB.z - centerA.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance > 0) {
                // 碰撞点在两球心连线上，距离第一个球心的距离为其半径
                const ratio = radiusA / distance;
                worldPoint.x = centerA.x + dx * ratio;
                worldPoint.y = centerA.y + dy * ratio;
                worldPoint.z = centerA.z + dz * ratio;
            } else {
                // 如果两球心重合，取第一个球的表面点
                worldPoint.x = centerA.x + radiusA;
                worldPoint.y = centerA.y;
                worldPoint.z = centerA.z;
            }
        } else {
            // 其他形状组合使用默认的中点计算方式
            const centerA = bi.getCenter();
            const centerB = bj.getCenter();
            worldPoint.x = (centerA.x + centerB.x) * 0.5;
            worldPoint.y = (centerA.y + centerB.y) * 0.5;
            worldPoint.z = (centerA.z + centerB.z) * 0.5;
        }

        // 将世界坐标转换为物体父节点下的本地坐标
        bi.object.node.parent!.inverseTransformPoint(bi.collisionPoint, worldPoint);
        bj.object.node.parent!.inverseTransformPoint(bj.collisionPoint, worldPoint);

        let pairs = this.pairs;
        let data = pairs.get(id);
        if (data !== undefined) {
            trigger = Trigger.stay;
            if (data.fida != bi.fid || data.fidb != bj.fid) {
                trigger = Trigger.enter;
                data.fida = bi.fid;
                data.fidb = bj.fid;
            }
            data.frameID = this.frameID;
            data.state = state;
        } else {
            trigger = Trigger.enter;
            pairs.set(id, { id: id, a: bi, b: bj, fida: bi.fid, fidb: bj.fid, frameID: this.frameID, state: state });
        }

        let objA = bi.object;
        if (state & 1 && objA && objA.trigger && !bi.isRemove) {
            objA.onTrigger(bj, trigger);
        }

        let objB = bj.object;
        if (state & 2 && objB && objB.trigger && !bj.isRemove) {
            objB.onTrigger(bi, trigger);
        }
    }

    private endTrigger() {
        let deletes = [];
        let pairs = this.pairs;

        let length = pairs.size;
        let frameID = this.frameID;
        let entries = pairs.values();
        for (let i = 0; i < length; i++) {
            let data = entries.next().value;
            let bi = data.a;
            let bj = data.b;

            if (data.frameID != frameID || bi.isRemove || bj.isRemove) {
                if (data.fida == bi.fid && data.fidb == bj.fid) {
                    let objA = bi.object;
                    if (objA && objA.trigger && !bi.isRemove) objA.onTrigger(bj, Trigger.exit);

                    let objB = bj.object;
                    if (objB && objB.trigger && !bj.isRemove) objB.onTrigger(bi, Trigger.exit);
                }

                deletes.push(data.id);
            }
        }

        length = deletes.length - 1;
        while (length >= 0) {
            pairs.delete(deletes[length--]);
        }
        deletes.length = 0;
    }

    private reBuild(): void {
        let change = false;
        let axis = this.preBuildAxis();
        if ((axis & 0x3) != (this.axis & 0x3) || this.axis < 0) {
            this.axis = axis;
            change = true;
        }

        if (change || this.isDirty) {
            this.isDirty = false;

            let bodys = this.bodys;
            axis = this.axis & 0x3;
            for (let i = 0, N = bodys.length; i !== N; i++) {
                let bi = bodys[i];
                let aabb = bi.aabb;
                bi.lower = aabb[axis];
                bi.upper = aabb[axis + 3];
            }

            if (!change) this.sort(bodys);
            else bodys.sort((a: cBody, b: cBody) => a.lower - b.lower);
        }
    }

    private sort(a: Array<cBody>): void {
        let i = 0,
            j = 0,
            l = 0;
        for (i = 1, l = a.length; i < l; i++) {
            let v = a[i];
            let lower = v.lower;
            for (j = i - 1; j >= 0; j--) {
                let w = a[j];
                if (w.lower <= lower) {
                    break;
                }
                a[j + 1] = w;
            }

            if (j + 1 != i) {
                a[j + 1] = v;
            }
        }
    }

    private preBuildAxis(): number {
        let axis = 0,
            sumX = 0,
            sumX2 = 0,
            sumY = 0,
            sumY2 = 0,
            sumZ = 0,
            sumZ2 = 0,
            x = 0.0,
            y = 0.0,
            z = 0.0;

        let bodys = this.bodys;
        let N = bodys.length;

        let length = 0;
        let isDirty = false;
        for (let i = 0; i < N; i++) {
            let body = bodys[i];

            //删除body
            if (body.isRemove) {
                //是否回收body
                if (body.isRetrieve) {
                    this.pools.push(body);
                    body.clear();
                }
                //已从collider移除
                body.inCollider = false;
                continue;
            }

            if (++length <= i) {
                bodys[length - 1] = body;
            }
            if (body.updateBound()) isDirty = true;

            let s = body.aabb,
                sx = s[3] - s[0],
                sy = s[4] - s[1],
                sz = s[5] - s[2];
            x += sx * sx;
            y += sy * sy;
            z += sz * sz;

            let cX = (s[3] + s[0]) * 0.5;
            sumX += cX;
            sumX2 += cX * cX;

            let cY = (s[4] + s[1]) * 0.5;
            sumY += cY;
            sumY2 += cY * cY;

            let cZ = (s[5] + s[2]) * 0.5;
            sumZ += cZ;
            sumZ2 += cZ * cZ;
        }

        this.bodys.length = length;
        this.isDirty = isDirty;

        let invN = 1.0 / length;
        x = x > 0 ? length / x : 0;
        y = y > 0 ? length / y : 0;
        z = z > 0 ? length / z : 0;

        let X = (sumX2 - sumX * sumX * invN) * x;
        let Y = (sumY2 - sumY * sumY * invN) * y;
        let Z = (sumZ2 - sumZ * sumZ * invN) * z;

        if (X == 0) X = x;
        if (Y == 0) Y = y;
        if (Z == 0) Z = z;

        if (X > Y) {
            if (X > Z) {
                axis = 0;
                axis |= Y > Z ? (1 << 2) | (2 << 4) : (1 << 4) | (2 << 2); //yz:zy;
            } else {
                axis = 2;
                axis |= X > Y ? (0 << 2) | (1 << 4) : (0 << 4) | (1 << 2); //xy:yx;
            }
        } else if (Y > Z) {
            axis = 1;
            axis |= X > Z ? (0 << 2) | (2 << 4) : (0 << 4) | (2 << 2); //xz:zx;
        } else {
            axis = 2;
            axis |= X > Y ? (0 << 2) | (1 << 4) : (0 << 4) | (1 << 2); //xy:yx;
        }

        return axis;
    }
}
