/* eslint-disable no-alert */
import QlMathjax from '../formats/mathjax';

const SYMBOL_LATEX_MAP = {
  '°': '^\\circ ',
  '∵': '\\because ',
  '∴': '\\therefore ',
  '△': '\\triangle ',
  '÷': '\\div ',
  '⊥': '\\bot ',
  '∠': '\\angle ',
};

export default async function latexToSvg(
  quill,
  { noConvert = false, noAlert = false } = {},
) {
  const html = quill.getContent().replace(/\\\$/g, 'MATHCUSTOM');
  if (noConvert) {
    quill.setContent(
      html.replace(/\$(.*?)\$/g, filter).replace(/MATHCUSTOM/g, '\\$'),
    );
  } else {
    const latexArr = html.match(/\$(.*?)\$/g) || [];
    const objList = await mathjaxRender(latexArr);
    const errSvg = [];
    let count = 0;
    quill.setContent(
      html
        .replace(/\$(.*?)\$/g, () => {
          const obj = objList[count];
          let svg = '';
          if (obj.isRight) {
            const math = QlMathjax.create({
              latex: obj.latex
                .slice(1, -1)
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<'),
              innerHTML: obj.html,
            });
            svg = math.outerHTML;
          } else {
            svg = obj.html;
            errSvg.push(obj.latex.slice(1, -1));
          }
          count += 1;
          return svg;
        })
        .replace(/MATHCUSTOM/g, '\\$'),
    );
    if (errSvg.length && !noAlert) {
      alert(`不识别的LaTex码，请检查以下LaTex是否正确：${errSvg.join('、')}`);
    }
  }
}

export function mathjaxRender(latexArr) {
  latexArr = latexArr.map(filter);
  return new Promise(resolve => {
    const container = document.createElement('div');
    latexArr.forEach(latex => {
      const div = document.createElement('div');
      div.innerHTML = latex
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/MATHCUSTOM/g, '\\$');
      container.appendChild(div);
    });
    if (window.MathJax === undefined) {
      throw new Error('MathJax is needed. Please refer to demo');
    }
    window.MathJax.Hub.Queue(
      ['Typeset', window.MathJax.Hub, container],
      [
        () => {
          const svgContainerList = container.querySelectorAll('.MathJax_SVG');
          const svgs = Array.from(svgContainerList).map((svg, index) => {
            const child = svg.children[0];
            if (child.tagName === 'svg') {
              return {
                isRight: true,
                html: child.outerHTML,
                latex: latexArr[index],
              };
            }
            return {
              isRight: false,
              html: latexArr[index],
              latex: latexArr[index],
            };
          });
          resolve(svgs);
        },
      ],
    );
  });
}

function filter(latex) {
  const WHITE_LIST = /[0-9a-zA-Z\u4e00-\u9fa5%\\()[\]{}|^_/*+-<>=!.&,'↲:$ ①②③④⑤⑥⑦⑧⑨⑩，。@‐—ⒶⒷ‰♀♂Ⓥ▴◆⚫∎⬛]+/;
  latex = latex
    .replace(/&nbsp;/g, ' ')
    .replace(/\/\//g, '\\ykparallel ')
    .trim();
  const tempArr = latex.split('');
  // eslint-disable-next-line prettier/prettier
  return tempArr.map((v, i) => {
      let hasRed = false;
      const redString = 'color{red}{';
      if (i >= redString.length) {
        // eslint-disable-next-line prettier/prettier
        hasRed = tempArr.slice(i - redString, i).join('').indexOf(redString) >= 0;
      }
      if (
        WHITE_LIST.test(v) ||
        (v === '#' && tempArr.slice(i - 1, i + 4).join('') === '&#39;') ||
        hasRed
      ) {
        return v;
      }
      return SYMBOL_LATEX_MAP[v] ? SYMBOL_LATEX_MAP[v] : `\\${redString}${v}}`;
    })
    .join('');
}
