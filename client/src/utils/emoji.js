const emojis = {
  ':)': '😊',
  ':-)': '😊',
  ':-]': '😊',
  ':]': '😊',
  ':>': '😊',
  ':->': '😊',
  '=)': '😊',
  ':D': '😄',
  '=D': '😄',
  ':\'D': '😂',
  ':(': '😟',
  ':c': '😟',
  ':<': '😟',
  ':[': '😟',
  ':\'(': '😢',
  'D:': '😩',
  ':P': '😋',
  ':p': '😋',
  ';P': '😜',
  'xP': '😝',
  'XP': '😝',
  ':o': '😯',
  ':O': '😲',
  ';)': '😉',
  ':*': '😚',
  ':x': '😚',
  ';*': '😘',
  ';x': '😘',
  '8)': '😎',
  '(:': '🙃',
  '>:(': '😠',
  '>:[': '😠',
  ':@': '🤬',
  '>:@': '🤬',
  '>:)': '😈',
  '>=)': '😈',
  'x(': '😣',
  'xd': '😆',
  'xD': '😆',
  'XD': '🤣',
  'Dx': '😫',
  ':|': '😐',
  ':/': '😕',
  ':S': '🥴',
  '(y)': '👍',
  '(Y)': '👍',
  '(n)': '👎',
  '(N)': '👎',
  '<3': '❤️',
  '</3': '💔'
}

//eslint-disable-next-line
const regExp = new RegExp(Object.keys(emojis).map(k => {
  return k = k.replace(':', '\\:')
              .replace(')', '\\)')
              .replace(']', '\\]')
              .replace('[', '\\[')
              .replace('-', '\\-')
              .replace('=', '\\=')
              .replace('(', '\\(')
              .replace('*', '\\*')
              .replace('>', '\\>')
              .replace('<', '\\<')
              .replace('|', '\\|')
  }).join('|'), 'g');

function emojify(string) {
  return string.replace(regExp, (matched) => emojis[matched] ? emojis[matched] : false);
}

export { emojify };