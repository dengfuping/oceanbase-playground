import { formatMessage as umiFormatMessage } from 'umi';

const formatMessage = umiFormatMessage || (() => undefined);

export const COLOR_LIST = [
  {
    value: 'blue',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Blue',
      defaultMessage: '蓝色',
    }),
    color: '#217eff',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*hB4NTKz2bGcAAAAAAAAAAAAADmfOAQ/original',
  },
  {
    value: 'gray',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Gray',
      defaultMessage: '灰色',
    }),
    color: '#7f95ae',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*chD1QIsM6LkAAAAAAAAAAAAADmfOAQ/original',
  },
  {
    value: 'green',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Green',
      defaultMessage: '绿色',
    }),
    color: '#4ed46c',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*qzZZTZIumG0AAAAAAAAAAAAADmfOAQ/original',
  },
  {
    value: 'purple',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Purple',
      defaultMessage: '紫色',
    }),
    color: '#aa7de0',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*iTKnS5ydYp8AAAAAAAAAAAAADmfOAQ/original',
  },
  {
    value: 'orange',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Yellow',
      defaultMessage: '橙色',
    }),
    color: '#ff8f05',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*gHoGTrkZSPQAAAAAAAAAAAAADmfOAQ/original',
  },
  {
    value: 'cyan',
    label: formatMessage({
      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Cyan',
      defaultMessage: '青蓝色',
    }),
    color: '#30c6ff',
    image:
      'https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*0I5HQ4TxMhcAAAAAAAAAAAAADmfOAQ/original',
  },
];
