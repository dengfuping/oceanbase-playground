import _ from 'lodash';
import { G2 } from '@oceanbase/charts';
import { getEasing } from './getEasing';
import { getThreeBezier, getThreeBezierRatio } from './threeBezier';

export const ELEMENT_UPDATE = 'my-bar-element-update';

G2.registerAnimation(ELEMENT_UPDATE, (element, animateCfg, cfg) => {
  console.log(element.cfg.name);
  if (element.cfg.name !== 'interval') return;
  const nowPath = element.attr('path');
  const toPath = _.get(cfg, ['toAttrs', 'path']);
  const toWidth = toPath[1][1] - nowPath[1][1];
  const path = toPath;

  const { easing } = animateCfg;
  const result = getThreeBezier(easing);
  // 宽度更新
  element.animate(
    (ratio) => {
      const newRatio = getThreeBezierRatio(ratio, result);

      // 当前变化的宽度
      const changeWidth = newRatio * toWidth;
      path[1][1] = nowPath[1][1] + changeWidth;
      path[2][1] = nowPath[2][1] + changeWidth;

      return {
        path,
      };
    },
    {
      ...animateCfg,
      easing: getEasing(result, easing),
    },
  );
});
