import GetImgList from './get-img-list';

const dirtyList = [];

function latexToImg(quill, notConvertImg) {
  let converting = false;
  if (converting) {
    alert('正在转换中，请勿连续点击'); // eslint-disable-line no-alert
    return;
  }
  converting = true;
  const html = quill
    .getSemanticHTML()
    .replace(/\\\$/g, 'MATHCUSTOM')
    .replace(/\n/g, '');
  if (notConvertImg) {
    quill.root.innerHTML = html
      .replace(/\$(.*?)\$/g, filter)
      .replace(/MATHCUSTOM/g, '\\$');
    converting = false;
  } else {
    GetImgList(html.match(/\$(.*?)\$/g) || []).then(objList => {
      let count = 0;
      quill.root.innerHTML = html
        .replace(/\$(.*?)\$/g, () => {
          const img = `<img class="yk-math-img" data-latex="${
            objList[count].latex
          }" src="${objList[count].src}">`;
          count += 1;
          return img;
        })
        .replace(/MATHCUSTOM/g, '\\$');
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
