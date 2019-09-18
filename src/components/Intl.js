import { getStorage } from '../util/storage.js'

import { languages } from '../intl/index.js'

const language = getStorage('language') || 'english'

const _intl = (word, language) => languages[language][word]

const intl = (word) => languages[language][word] || ''

const Intl = ({ children, word, language_overwrite }) => _intl(children ? children : word, language_overwrite ? language_overwrite : language) || ''

export {
  Intl,
  intl,
  _intl
}
