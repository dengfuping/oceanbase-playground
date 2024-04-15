/**
 * 三次贝塞尔曲线字符串分解方法 返回分解后的两个坐标点
 * @param BezierString string
 * @returns [p1,p1]
 */
export function getThreeBezier(bezierString: string): number[][] | false {
  // 不符合要求的直接返回
  if (
    !/^cubic-bezier\(((\d+|(\d*\.\d+))\,){3}(\d+|(\d*\.\d+))\)$/.test(
      bezierString,
    )
  ) {
    return false;
  }

  const p1 = [];
  const p2 = [];

  // @ts-ignore
  bezierString.replace(/(\d|\.)+/g, (v) => {
    p1.length === 2 ? p2.push(Number(v)) : p1.push(Number(v));
  });

  return [p1, p2];
}

/**
 * 计算三次贝塞尔曲线函数 三次贝塞尔曲线需要四个点 [p0,p1,p2,p3]  p0:[0,0] p3:[1,1]
 * @param t 运动占比 [0-1]
 * @param p1 [x,y]
 * @param p2 [x,y]
 * @returns 当前运动到的点 [x,y]
 */
export function threeBezier(t, p1, p2) {
  const [x1, y1] = [0, 0];
  const [x2, y2] = [1, 1];
  const [cx1, cy1] = p1;
  const [cx2, cy2] = p2;
  const x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t;
  const y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t;
  return [x, y];
}

/**
 * 获取贝塞尔曲线新的计算进度
 * @param ratio 进度
 * @param threeBezierResult 三次贝塞尔曲线字符串分解方法结果
 * @returns newRatio
 */
export function getThreeBezierRatio(
  ratio: number,
  threeBezierResult: number[][] | false,
): number {
  if (threeBezierResult) {
    const [p1, p2] = threeBezierResult;
    return threeBezier(ratio, p1, p2)[1];
  }
  return ratio;
}
