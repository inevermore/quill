import { latexToSvg } from './get-img-list';
import QlMathjax from '../formats/mathjax';

const dirtyList = [];

function latexToImg(editor, notConvertImg) {
  let converting = false;
  if (converting) {
    alert('正在转换中，请勿连续点击'); // eslint-disable-line no-alert
    return;
  }
  converting = true;
  const html = editor
    .getContent()
    .replace(/\\\$/g, 'MATHCUSTOM')
    .replace(/\n/g, '');
  if (notConvertImg) {
    editor.setContent(
      html.replace(/\$(.*?)\$/g, filter).replace(/MATHCUSTOM/g, '\\$'),
    );
    converting = false;
  } else {
    const latexArr = html.match(/\$(.*?)\$/g) || [];
    latexToSvg(latexArr).then(objList => {
      let count = 0;
      editor.setContent(
        html
          .replace(/\$(.*?)\$/g, () => {
            const math = QlMathjax.create({
              latex: latexArr[count].slice(1, -1),
              innerHTML: objList[count].outerHTML,
            });
            count += 1;
            return math.outerHTML;
          })
          .replace(/MATHCUSTOM/g, '\\$'),
      );
      converting = false;
    });
  }
}

function filter(latex) {
  const WHITE_LIST = /[0-9a-zA-Z\u4e00-\u9fa5%\\()[\]{}|^_/*+-<>=!.&,'↲:$ ①②③④⑤⑥⑦⑧⑨⑩]+/;
  latex = latex
    .replace(/&nbsp;/g, '')
    .replace(/\/\//g, '\\ykparallel ')
    .trim();
  const tempArr = latex.split('');
  // eslint-disable-next-line prettier/prettier
  return tempArr.map((v, i) => {
      if (
        WHITE_LIST.test(v) ||
        (v === '#' && tempArr.slice(i - 1, i + 4).join('') === '&#39;')
      ) {
        return v;
      }
      dirtyList.push(v);
      return '';
    })
    .join('');
}

export default latexToImg;
