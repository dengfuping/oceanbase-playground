// import { G2 } from '@ant-design/charts';
// import type { IShape } from '@ant-design/charts';
// import type { GAnimateCfg } from '@antv/g2/esm/interface';
// import type { AnimateExtraCfg } from '@antv/g2/esm/animate/interface';
// import type { PathCommand } from '@antv/g2/esm/dependents';

// export function pathToString(path: PathCommand[]) {
//   return path
//     .map((command) => `${command[0]}${command.slice(1).join(',')}`)
//     .join(' ');
// }

// /**
//  * @ignore
//  * 时序图更新动画
//  * @param shape 图形
//  * @param animateCfg
//  * @param cfg
//  */
// export function customUpdate(
//   shape: IShape,
//   animateCfg: GAnimateCfg,
//   cfg: AnimateExtraCfg,
// ) {
//   const { toAttrs } = cfg;
//   const { path = [], ...restToAttrs } =
//     (toAttrs as { path: PathCommand[] }) || {};
//   console.log(shape);
//   console.log('=======');
//   //   if (shape.get('type') === 'path') {
//   //     // update path to fromPath
//   //     shape.attr({
//   //       path: fromPath,
//   //     });
//   //     // animate to toPath
//   //     shape.animate(
//   //       {
//   //         path: toPath,
//   //       },
//   //       {
//   //         ...animateCfg,
//   //         callback: () => {
//   //           // Remove prepend command when animation is completed
//   //           const restoreToPath = toPath.slice(1);
//   //           restoreToPath[0] = restoreToFirstCommand;
//   //           console.log(restoreToPath);
//   //           shape.attr({
//   //             path: restoreToPath,
//   //           });
//   //           if (animateCfg.callback) {
//   //             animateCfg.callback();
//   //           }
//   //         },
//   //       },
//   //     );
//   //   }

//   shape.animate(restToAttrs, animateCfg);
// }

// G2.registerAnimation('custom-update', customUpdate);
