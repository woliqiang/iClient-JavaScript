/**
 * @private
 * @class  SuperMap.LevelRenderer.Tool.Matrix
 * LevelRenderer 工具-3x2矩阵操作类
 *
 */
export class Matrix {


    /**
     * Constructor: SuperMap.LevelRenderer.Tool.Matrix
     * 构造函数。
     *
     */
    constructor() {
        /**
         * Property: ArrayCtor
         * {Object} 数组类型控制
         */
        this.ArrayCtor = typeof Float32Array === 'undefined'
            ? Array
            : Float32Array;

        this.CLASS_NAME = "SuperMap.LevelRenderer.Tool.Matrix";
    }


    /**
     * APIMethod: create
     * 创建一个单位矩阵。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 单位矩阵。
     */
    create() {
        var ArrayCtor = this.ArrayCtor;

        var out = new ArrayCtor(6);
        this.identity(out);

        return out;
    }


    /**
     * APIMethod: identity
     * 设置矩阵为单位矩阵。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 单位矩阵。
     */
    identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        return out;
    }


    /**
     * APIMethod: copy
     * 复制矩阵。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * m - {Float32Array|Array.<Number>} 原始矩阵。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 克隆矩阵。
     */
    copy(out, m) {
        out[0] = m[0];
        out[1] = m[1];
        out[2] = m[2];
        out[3] = m[3];
        out[4] = m[4];
        out[5] = m[5];
        return out;
    }


    /**
     * APIMethod: mul
     * 矩阵相乘。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * m1 - {Float32Array|Array.<Number>} 矩阵m1。
     * m2- {Float32Array|Array.<Number>} 矩阵m2。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    mul(out, m1, m2) {
        out[0] = m1[0] * m2[0] + m1[2] * m2[1];
        out[1] = m1[1] * m2[0] + m1[3] * m2[1];
        out[2] = m1[0] * m2[2] + m1[2] * m2[3];
        out[3] = m1[1] * m2[2] + m1[3] * m2[3];
        out[4] = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
        out[5] = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
        return out;
    }


    /**
     * APIMethod: translate
     * 平移变换。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * a - {Float32Array|Array.<Number>} 矩阵。
     * v- {Float32Array|Array.<Number>} 平移参数。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    translate(out, a, v) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4] + v[0];
        out[5] = a[5] + v[1];
        return out;
    }


    /**
     * APIMethod: rotate
     * 旋转变换。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * a - {Float32Array|Array.<Number>} 矩阵。
     * rad- {Float32Array|Array.<Number>} 旋转参数。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    rotate(out, a, rad) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];
        var st = Math.sin(rad);
        var ct = Math.cos(rad);

        out[0] = aa * ct + ab * st;
        out[1] = -aa * st + ab * ct;
        out[2] = ac * ct + ad * st;
        out[3] = -ac * st + ct * ad;
        out[4] = ct * atx + st * aty;
        out[5] = ct * aty - st * atx;
        return out;
    }


    /**
     * APIMethod: scale
     * 缩放变换。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * a - {Float32Array|Array.<Number>} 矩阵。
     * v- {Float32Array|Array.<Number>} 缩放参数。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    scale(out, a, v) {
        var vx = v[0];
        var vy = v[1];
        out[0] = a[0] * vx;
        out[1] = a[1] * vy;
        out[2] = a[2] * vx;
        out[3] = a[3] * vy;
        out[4] = a[4] * vx;
        out[5] = a[5] * vy;
        return out;
    }


    /**
     * APIMethod: invert
     * 求逆矩阵。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * a - {Float32Array|Array.<Number>} 矩阵。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    invert(out, a) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];

        var det = aa * ad - ab * ac;
        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
    }


    /**
     * APIMethod: mulVector
     * 矩阵左乘向量。
     *
     * Parameters:
     * out - {Float32Array|Array.<Number>} 单位矩阵。
     * a - {Float32Array|Array.<Number>} 矩阵。
     * v- {Float32Array|Array.<Number>} 缩放参数。
     *
     * Returns:
     * {Float32Array|Array.<Number>} 结果矩阵。
     */
    mulVector(out, a, v) {
        var aa = a[0];
        var ac = a[2];
        var atx = a[4];
        var ab = a[1];
        var ad = a[3];
        var aty = a[5];

        out[0] = v[0] * aa + v[1] * ac + atx;
        out[1] = v[0] * ab + v[1] * ad + aty;

        return out;
    }

}