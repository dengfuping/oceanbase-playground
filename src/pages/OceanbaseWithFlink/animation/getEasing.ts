import _ from 'lodash';

// d3-ease 中的缓动字符串
export const effects = [
  'easeLinear',
  'easeQuadIn',
  'easeQuadOut',
  'easeQuadInOut',
  'easeCubicIn',
  'easeCubicOut',
  'easeCubicInOut',
  'easePolyIn',
  'easePolyOut',
  'easePolyInOut',
  'easeSinIn',
  'easeSinOut',
  'easeSinInOut',
  'easeExpIn',
  'easeExpOut',
  'easeExpInOut',
  'easeCircleIn',
  'easeCircleOut',
  'easeCircleInOut',
  'easeElasticIn',
  'easeElasticOut',
  'easeElasticInOut',
  'easeBounceIn',
  'easeBounceOut',
  'easeBounceInOut',
  'easeBackIn',
  'easeBackOut',
  'easeBackInOut',
];

export const getEasing = (result: any, easing: string) =>
  result || !_.includes(effects, easing) ? effects[0] : easing;
