import moment from 'moment';

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
