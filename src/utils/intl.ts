import { createIntl } from 'react-intl';
import { getLocale } from '@@/plugin-locale/localeExports';
import en_US from '@/locale/en-US';
import zh_CN from '@/locale/zh-CN';
import zh_TW from '@/locale/zh-TW';

const messages = {
  'en-US': en_US,
  'zh-CN': zh_CN,
  'zh-TW': zh_TW,
};

const locale = getLocale();

const intl = createIntl({
  locale,
  messages: messages[locale],
});

export const { formatMessage } = intl;
export default intl;
