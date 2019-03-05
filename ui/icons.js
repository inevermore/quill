import alignLeftIcon from '../assets/icons/align-left.svg';
import alignCenterIcon from '../assets/icons/align-center.svg';
import alignRightIcon from '../assets/icons/align-right.svg';
import backgroundIcon from '../assets/icons/background.svg';
import blockquoteIcon from '../assets/icons/blockquote.svg';
import boldIcon from '../assets/icons/bold.svg';
import cleanIcon from '../assets/icons/clean.svg';
import codeIcon from '../assets/icons/code.svg';
import colorIcon from '../assets/icons/color.svg';
import directionLeftToRightIcon from '../assets/icons/direction-ltr.svg';
import directionRightToLeftIcon from '../assets/icons/direction-rtl.svg';
import formulaIcon from '../assets/icons/formula.svg';
import headerIcon from '../assets/icons/header.svg';
import header2Icon from '../assets/icons/header-2.svg';
import italicIcon from '../assets/icons/italic.svg';
import imageIcon from '../assets/icons/image.svg';
import indentIcon from '../assets/icons/indent.svg';
import linkIcon from '../assets/icons/link.svg';
import listBulletIcon from '../assets/icons/list-bullet.svg';
import listCheckIcon from '../assets/icons/list-check.svg';
import listOrderedIcon from '../assets/icons/list-ordered.svg';
import subscriptIcon from '../assets/icons/subscript.svg';
import superscriptIcon from '../assets/icons/superscript.svg';
import strikeIcon from '../assets/icons/strike.svg';
import tableIcon from '../assets/icons/table.svg';
import underlineIcon from '../assets/icons/underline.svg';
import videoIcon from '../assets/icons/video.svg';
import dottedIcon from '../assets/icons/dotted.svg';
import selectAllIcon from '../assets/icons/select-all.svg';
import redoIcon from '../assets/icons/redo.svg';
import undoIcon from '../assets/icons/undo.svg';
import wavyIcon from '../assets/icons/wavy.svg';
import piIcon from '../assets/icons/pi.svg';
import fillBlankUnderlineIcon from '../assets/icons/fill-blank-underline.svg';
import svgToLatexIcon from '../assets/icons/svg-to-latex.svg';
import latexToSvgIcon from '../assets/icons/latex-to-svg.svg';
import pinyinIcon from '../assets/icons/pinyin.svg';
import closeIcon from '../assets/icons/close.svg';
import fillBlankBracketsIcon from '../assets/icons/fill-blank-brackets.svg';

export default {
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  clean: cleanIcon,
  code: codeIcon,
  'code-block': codeIcon,
  color: colorIcon,
  direction: {
    '': directionLeftToRightIcon,
    rtl: directionRightToLeftIcon,
  },
  formula: formulaIcon,
  header: {
    '1': headerIcon,
    '2': header2Icon,
  },
  image: imageIcon,
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon,
  },
  script: {
    sub: subscriptIcon,
    super: superscriptIcon,
  },
  table: tableIcon,
  video: videoIcon,
  all: selectAllIcon,
  undo: undoIcon,
  redo: redoIcon,
  wavy: wavyIcon,
  pi: piIcon,
  underline: {
    normal: underlineIcon,
    wavy: wavyIcon,
  },
  svgToLatex: svgToLatexIcon,
  latexToSvg: latexToSvgIcon,
  'fill-blank-underline': fillBlankUnderlineIcon,
  pinyin: pinyinIcon,
  align: {
    left: alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
  },
  indent: indentIcon,
  strike: strikeIcon,
  bold: boldIcon,
  italic: italicIcon,
  dotted: dottedIcon,
  close: closeIcon,
  'fill-blank-brackets': fillBlankBracketsIcon,
};
