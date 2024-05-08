import { formatMessage as umiFormatMessage } from 'umi';

const formatMessage = umiFormatMessage || (() => undefined);

export const COLOR_LIST = [
  {
    value: 'blue',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Blue',
      defaultMessage: '海湾蓝',
    }),
    color: 'linear-gradient(90deg, #002DFF 0%, rgba(0,45,255,0.60) 100%)',
    image:
      'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  },
  // {
  //   value: 'gray',
  //   label: '雅灰',
  //   color: 'linear-gradient(90deg, #B5C1D9 0%, rgba(181,193,217,0.60) 100%)',
  //   image:
  //     'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  // },
  {
    value: 'green',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Green',
      defaultMessage: '橄榄绿',
    }),
    color: 'linear-gradient(90deg, #07C846 0%, rgba(7,200,70,0.60) 100%)',
    image:
      'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  },
  {
    value: 'purple',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Purple',
      defaultMessage: '霞光紫',
    }),
    color: 'linear-gradient(90deg, #B229FD 2%, rgba(178,41,253,0.60) 100%)',
    image:
      'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  },
  {
    value: 'orange',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Yellow',
      defaultMessage: '熔岩橙',
    }),
    color: 'linear-gradient(90deg, #FFA005 0%, rgba(255,160,5,0.60) 100%)',
    image:
      'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  },
  // {
  //   value: 'white',
  //   label: formatMessage({
  //     id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.White',
  //     defaultMessage: '珍珠白',
  //   }),
  //   color:
  //     'linear-gradient(90deg, rgba(249,249,249,0.80) 2%, rgba(255,255,255,0.00) 100%)',
  //   image:
  //     'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  // },
  {
    value: 'black',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Black',
      defaultMessage: '钻石黑',
    }),
    color: 'linear-gradient(90deg, rgba(0,0,0,0.80) 2%, rgba(0,0,0,0.60) 100%)',
    image:
      'https://mdn.alipayobjects.com/huamei_wspxri/afts/file/A*1ifxTp05Ti8AAAAAAAAAAAAADnh5AQ',
  },
  {
    value: 'red',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Red',
      defaultMessage: '玫瑰红',
    }),
    color: 'linear-gradient(90deg, #FF4D4F 2%, rgba(255,77,79,0.60) 100%)',
  },
];
