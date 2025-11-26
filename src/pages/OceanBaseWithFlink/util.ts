import moment from 'moment';
import { sample } from 'lodash';
import { COLOR_LIST } from './constant';
import { fakerZH_CN, fakerEN_US } from '@faker-js/faker';

import { getLocale } from 'umi';

export function formatTime(value?: string | Date) {
  return moment(value).format('HH:mm:ss');
}

/**
 * 姓名脱敏
 * @param name 脱敏字符串
 * @returns {string}
 */
export function desensitizeName(name?: string) {
  if (!name) {
    return '无';
  }
  // 两个字的姓名，隐藏第一个字
  if (name.length === 2) {
    return name.replace(/^./, '*');
  }
  // 三个字的姓名，隐藏第一个字
  else if (name.length === 3) {
    return name.replace(/^./, '*');
  }
  // 六个字以下，三个字以上，只显示最后两个字
  else if (name.length <= 6 && name.length >= 3) {
    return name.replace(name.substr(0, name.length - 2), '***');
  }
  // 六个字以上，只显示第一个字和最后一个字
  else if (name.length > 6) {
    return name.replace(/^(.).*(.)$/, '$1*****$2');
  }
}

export type Locale = 'en-US' | 'zh-CN';

// 随机生成用户名
export const generateCustomerName = () => {
  const locale = getLocale();
  if (locale === 'zh-CN') {
    return fakerZH_CN.person.fullName();
  } else {
    return fakerEN_US.person.fullName();
  }
};

// 随机生成订单
export const generateCarOrder = (locale: Locale) => {
  return {
    carPrice: sample([215000, 245900, 299900]),
    carColor: sample(COLOR_LIST.map((item) => item.value)) as string,
    saleRegion:
      locale === 'zh-CN'
        ? sample(['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou'])
        : sample(['New York', 'Los Angeles', 'Washington', 'Chicago']),
    saleNation: locale === 'zh-CN' ? 'China' : 'America',
    customerName: generateCustomerName(),
  };
};
