import Editor from '../../index';

const box = document.querySelector('#editor');
const editor = new Editor({
  container: '#editor',
  theme: 'handout',
  toolbar: {
    container: 'default',
  },
  events: {
    openFormula,
    getFormat,
  },
  options: [
    {
      font: ['sans-serif', 'Arial'],
    },
    {
      bold: ['normal'],
    },
    {
      italic: ['normal'],
    },
    {
      dotted: ['normal'],
    },
    {
      strike: ['normal'],
    },
    'color',
    'background',
    {
      script: ['super', 'sub'],
    },
    {
      list: ['ordered'],
    },
    {
      'paragraph-bottom-space': ['normal'],
    },
    {
      align: ['left', 'center', 'right'],
    },
    // {
    //   indent: [-1 ,+1],
    // },
    // {
    //   underline: ['normal'],
    // },
    {indent: [1,2,3,4,5,6,7,8]},
    {'text-indent': 'normal'}
  ],
});

function openFormula(latex = '') {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  showFormula(true);
  const formula = formulaContainer.querySelector('#formulaEditor');
  formula.contentWindow.latexEditor.set(latex);
}

function getFormat(format) {
  // console.log(format);
}

function showFormula(boolean) {
  const formulaContainer = document.querySelector('#formulaEditorContainer');
  formulaContainer.style.visibility = boolean ? 'visible' : 'hidden';
}

const table = editor.quill.getModule('table');
window.editor = editor;

function query(selector) {
  return document.querySelector(selector);
}
// query('#insertTable').addEventListener('click', () => table.insertTable(Number(rowNumber.value), Number(columnNumber.value)));
// query('#insertRowAbove').addEventListener('click', () => table.insertRowAbove());
// query('#insertRowBelow').addEventListener('click', () => table.insertRowBelow());
// query('#insertColumnLeft').addEventListener('click', () => table.insertColumnLeft());
// query('#insertColumnRight').addEventListener('click', () => table.insertColumnRight());

document.querySelector('#formulaEditorClose').addEventListener('click', () => {
  showFormula(false);
});

[{font: 'Arial'},{bold: 'normal'}, {italic: 'normal'}, {dotted: 'normal'},{strike: 'normal'}, {script: 'sub'}, 
 {color: 'red'}, {background: 'gray'}, {align: 'center'}, {indent: 'normal'}, {list: 'ordered'}].forEach(item => {
  Object.entries(item).forEach(([key, val]) => {
    const button = document.createElement('button');
    button.innerHTML = `${key}: ${val}`;
    button.addEventListener('click', () => {
      editor.format(key, val);
    });
    document.body.appendChild(button);
  });
});
const button1 = document.createElement('button');
button1.innerHTML = 'split';
button1.addEventListener('click', () => {
  console.log(editor.splitContent());
});

document.body.appendChild(button1);
var button2 = document.createElement('button');
button2.innerHTML = 'enable single line';
let flag = false;
button2.addEventListener('click', () => {
  flag = !flag;
  if (flag) {
    editor.setKeyboardBindings({
      handleEnter: {
        key: 'Enter',
        metaKey: null,
        ctrlKey: null,
        shiftKey: null,
        altKey: null,
        handler: function() {
          console.log('enter')
        }
      },
      // 禁止 shift + Enter 按键
      handleAnotherEnter: {
        key: 'Enter',
        shiftKey: true,
        handler: function() {
          console.log('shift + enter')

        }
      }
    });
  } else {
    editor.setKeyboardBindings();
  }
});
document.body.appendChild(button2);

var button2 = document.createElement('button');
button2.innerHTML = 'insert formula';
button2.addEventListener('click', () => {
  window.editor.insertEmbed(window.editor.getSelection().index, 'ql-mathjax', {
    latex: '1234',
    innerHTML: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" width="5.669ex" height="8.719ex" viewBox="0 -2970.7 2441 3754" role="img" focusable="false" style="vertical-align: -1.819ex;"><defs><path stroke-width="1" id="E11-MJMAIN-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path stroke-width="1" id="E11-MJMAIN-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><g transform="translate(120,0)"><rect stroke="none" width="2201" height="60" x="0" y="220"></rect><g transform="translate(60,2010)"><g transform="translate(120,0)"><rect stroke="none" width="1340" height="60" x="0" y="220"></rect><use transform="scale(0.707)" xlink:href="#E11-MJMAIN-31" x="697" y="577"></use><g transform="translate(60,-577)"><g transform="translate(120,0)"><rect stroke="none" width="980" height="60" x="0" y="146"></rect><g transform="translate(240,334)"><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-31"></use><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-32" x="500" y="0"></use></g><g transform="translate(60,-598)"><g transform="translate(120,0)"><rect stroke="none" width="620" height="60" x="0" y="95"></rect><g transform="translate(60,283)"><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-31"></use><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-32" x="500" y="0"></use></g><g transform="translate(60,-367)"><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-31"></use><use transform="scale(0.5)" xlink:href="#E11-MJMAIN-32" x="500" y="0"></use></g></g></g></g></g></g><use xlink:href="#E11-MJMAIN-32" x="1580" y="0"></use></g><use xlink:href="#E11-MJMAIN-32" x="850" y="-686"></use></g></g></svg>',
    mathid: 1234123,
    // innerHTML: '<svg xmlns:xlink="http://www.w3.org/1999/xlink" width="68.813ex" height="2.671ex" viewBox="0 -835.3 29627.7 1149.8" role="img" focusable="false" style="vertical-align: -0.73ex;"><defs><path stroke-width="1" id="E25-MJMATHI-61" d="M33 157Q33 258 109 349T280 441Q331 441 370 392Q386 422 416 422Q429 422 439 414T449 394Q449 381 412 234T374 68Q374 43 381 35T402 26Q411 27 422 35Q443 55 463 131Q469 151 473 152Q475 153 483 153H487Q506 153 506 144Q506 138 501 117T481 63T449 13Q436 0 417 -8Q409 -10 393 -10Q359 -10 336 5T306 36L300 51Q299 52 296 50Q294 48 292 46Q233 -10 172 -10Q117 -10 75 30T33 157ZM351 328Q351 334 346 350T323 385T277 405Q242 405 210 374T160 293Q131 214 119 129Q119 126 119 118T118 106Q118 61 136 44T179 26Q217 26 254 59T298 110Q300 114 325 217T351 328Z"></path><path stroke-width="1" id="E25-MJMATHI-77" d="M580 385Q580 406 599 424T641 443Q659 443 674 425T690 368Q690 339 671 253Q656 197 644 161T609 80T554 12T482 -11Q438 -11 404 5T355 48Q354 47 352 44Q311 -11 252 -11Q226 -11 202 -5T155 14T118 53T104 116Q104 170 138 262T173 379Q173 380 173 381Q173 390 173 393T169 400T158 404H154Q131 404 112 385T82 344T65 302T57 280Q55 278 41 278H27Q21 284 21 287Q21 293 29 315T52 366T96 418T161 441Q204 441 227 416T250 358Q250 340 217 250T184 111Q184 65 205 46T258 26Q301 26 334 87L339 96V119Q339 122 339 128T340 136T341 143T342 152T345 165T348 182T354 206T362 238T373 281Q402 395 406 404Q419 431 449 431Q468 431 475 421T483 402Q483 389 454 274T422 142Q420 131 420 107V100Q420 85 423 71T442 42T487 26Q558 26 600 148Q609 171 620 213T632 273Q632 306 619 325T593 357T580 385Z"></path><path stroke-width="1" id="E25-MJMATHI-65" d="M39 168Q39 225 58 272T107 350T174 402T244 433T307 442H310Q355 442 388 420T421 355Q421 265 310 237Q261 224 176 223Q139 223 138 221Q138 219 132 186T125 128Q125 81 146 54T209 26T302 45T394 111Q403 121 406 121Q410 121 419 112T429 98T420 82T390 55T344 24T281 -1T205 -11Q126 -11 83 42T39 168ZM373 353Q367 405 305 405Q272 405 244 391T199 357T170 316T154 280T149 261Q149 260 169 260Q282 260 327 284T373 353Z"></path><path stroke-width="1" id="E25-MJMATHI-66" d="M118 -162Q120 -162 124 -164T135 -167T147 -168Q160 -168 171 -155T187 -126Q197 -99 221 27T267 267T289 382V385H242Q195 385 192 387Q188 390 188 397L195 425Q197 430 203 430T250 431Q298 431 298 432Q298 434 307 482T319 540Q356 705 465 705Q502 703 526 683T550 630Q550 594 529 578T487 561Q443 561 443 603Q443 622 454 636T478 657L487 662Q471 668 457 668Q445 668 434 658T419 630Q412 601 403 552T387 469T380 433Q380 431 435 431Q480 431 487 430T498 424Q499 420 496 407T491 391Q489 386 482 386T428 385H372L349 263Q301 15 282 -47Q255 -132 212 -173Q175 -205 139 -205Q107 -205 81 -186T55 -132Q55 -95 76 -78T118 -61Q162 -61 162 -103Q162 -122 151 -136T127 -157L118 -162Z"></path><path stroke-width="1" id="E25-MJMAIN-31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path stroke-width="1" id="E25-MJMAIN-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path><path stroke-width="1" id="E25-MJMAIN-33" d="M127 463Q100 463 85 480T69 524Q69 579 117 622T233 665Q268 665 277 664Q351 652 390 611T430 522Q430 470 396 421T302 350L299 348Q299 347 308 345T337 336T375 315Q457 262 457 175Q457 96 395 37T238 -22Q158 -22 100 21T42 130Q42 158 60 175T105 193Q133 193 151 175T169 130Q169 119 166 110T159 94T148 82T136 74T126 70T118 67L114 66Q165 21 238 21Q293 21 321 74Q338 107 338 175V195Q338 290 274 322Q259 328 213 329L171 330L168 332Q166 335 166 348Q166 366 174 366Q202 366 232 371Q266 376 294 413T322 525V533Q322 590 287 612Q265 626 240 626Q208 626 181 615T143 592T132 580H135Q138 579 143 578T153 573T165 566T175 555T183 540T186 520Q186 498 172 481T127 463Z"></path><path stroke-width="1" id="E25-MJMAIN-73" d="M295 316Q295 356 268 385T190 414Q154 414 128 401Q98 382 98 349Q97 344 98 336T114 312T157 287Q175 282 201 278T245 269T277 256Q294 248 310 236T342 195T359 133Q359 71 321 31T198 -10H190Q138 -10 94 26L86 19L77 10Q71 4 65 -1L54 -11H46H42Q39 -11 33 -5V74V132Q33 153 35 157T45 162H54Q66 162 70 158T75 146T82 119T101 77Q136 26 198 26Q295 26 295 104Q295 133 277 151Q257 175 194 187T111 210Q75 227 54 256T33 318Q33 357 50 384T93 424T143 442T187 447H198Q238 447 268 432L283 424L292 431Q302 440 314 448H322H326Q329 448 335 442V310L329 304H301Q295 310 295 316Z"></path><path stroke-width="1" id="E25-MJMAIN-69" d="M69 609Q69 637 87 653T131 669Q154 667 171 652T188 609Q188 579 171 564T129 549Q104 549 87 564T69 609ZM247 0Q232 3 143 3Q132 3 106 3T56 1L34 0H26V46H42Q70 46 91 49Q100 53 102 60T104 102V205V293Q104 345 102 359T88 378Q74 385 41 385H30V408Q30 431 32 431L42 432Q52 433 70 434T106 436Q123 437 142 438T171 441T182 442H185V62Q190 52 197 50T232 46H255V0H247Z"></path><path stroke-width="1" id="E25-MJMAIN-6E" d="M41 46H55Q94 46 102 60V68Q102 77 102 91T102 122T103 161T103 203Q103 234 103 269T102 328V351Q99 370 88 376T43 385H25V408Q25 431 27 431L37 432Q47 433 65 434T102 436Q119 437 138 438T167 441T178 442H181V402Q181 364 182 364T187 369T199 384T218 402T247 421T285 437Q305 442 336 442Q450 438 463 329Q464 322 464 190V104Q464 66 466 59T477 49Q498 46 526 46H542V0H534L510 1Q487 2 460 2T422 3Q319 3 310 0H302V46H318Q379 46 379 62Q380 64 380 200Q379 335 378 343Q372 371 358 385T334 402T308 404Q263 404 229 370Q202 343 195 315T187 232V168V108Q187 78 188 68T191 55T200 49Q221 46 249 46H265V0H257L234 1Q210 2 183 2T145 3Q42 3 33 0H25V46H41Z"></path><path stroke-width="1" id="E25-MJMAIN-28" d="M94 250Q94 319 104 381T127 488T164 576T202 643T244 695T277 729T302 750H315H319Q333 750 333 741Q333 738 316 720T275 667T226 581T184 443T167 250T184 58T225 -81T274 -167T316 -220T333 -241Q333 -250 318 -250H315H302L274 -226Q180 -141 137 -14T94 250Z"></path><path stroke-width="1" id="E25-MJMAIN-29" d="M60 749L64 750Q69 750 74 750H86L114 726Q208 641 251 514T294 250Q294 182 284 119T261 12T224 -76T186 -143T145 -194T113 -227T90 -246Q87 -249 86 -250H74Q66 -250 63 -250T58 -247T55 -238Q56 -237 66 -225Q221 -64 221 250T66 725Q56 737 55 738Q55 746 60 749Z"></path><path stroke-width="1" id="E25-MJMATHI-6D" d="M21 287Q22 293 24 303T36 341T56 388T88 425T132 442T175 435T205 417T221 395T229 376L231 369Q231 367 232 367L243 378Q303 442 384 442Q401 442 415 440T441 433T460 423T475 411T485 398T493 385T497 373T500 364T502 357L510 367Q573 442 659 442Q713 442 746 415T780 336Q780 285 742 178T704 50Q705 36 709 31T724 26Q752 26 776 56T815 138Q818 149 821 151T837 153Q857 153 857 145Q857 144 853 130Q845 101 831 73T785 17T716 -10Q669 -10 648 17T627 73Q627 92 663 193T700 345Q700 404 656 404H651Q565 404 506 303L499 291L466 157Q433 26 428 16Q415 -11 385 -11Q372 -11 364 -4T353 8T350 18Q350 29 384 161L420 307Q423 322 423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 181Q151 335 151 342Q154 357 154 369Q154 405 129 405Q107 405 92 377T69 316T57 280Q55 278 41 278H27Q21 284 21 287Z"></path><path stroke-width="1" id="E25-MJMATHI-6F" d="M201 -11Q126 -11 80 38T34 156Q34 221 64 279T146 380Q222 441 301 441Q333 441 341 440Q354 437 367 433T402 417T438 387T464 338T476 268Q476 161 390 75T201 -11ZM121 120Q121 70 147 48T206 26Q250 26 289 58T351 142Q360 163 374 216T388 308Q388 352 370 375Q346 405 306 405Q243 405 195 347Q158 303 140 230T121 120Z"></path><path stroke-width="1" id="E25-MJMAIN-3B" d="M78 370Q78 394 95 412T138 430Q162 430 180 414T199 371Q199 346 182 328T139 310T96 327T78 370ZM78 60Q78 85 94 103T137 121Q202 121 202 8Q202 -44 183 -94T144 -169T118 -194Q115 -194 106 -186T95 -174Q94 -171 107 -155T137 -107T160 -38Q161 -32 162 -22T165 -4T165 4Q165 5 161 4T142 0Q110 0 94 18T78 60Z"></path><path stroke-width="1" id="E25-MJMATHI-6A" d="M297 596Q297 627 318 644T361 661Q378 661 389 651T403 623Q403 595 384 576T340 557Q322 557 310 567T297 596ZM288 376Q288 405 262 405Q240 405 220 393T185 362T161 325T144 293L137 279Q135 278 121 278H107Q101 284 101 286T105 299Q126 348 164 391T252 441Q253 441 260 441T272 442Q296 441 316 432Q341 418 354 401T367 348V332L318 133Q267 -67 264 -75Q246 -125 194 -164T75 -204Q25 -204 7 -183T-12 -137Q-12 -110 7 -91T53 -71Q70 -71 82 -81T95 -112Q95 -148 63 -167Q69 -168 77 -168Q111 -168 139 -140T182 -74L193 -32Q204 11 219 72T251 197T278 308T289 365Q289 372 288 376Z"></path><path stroke-width="1" id="E25-MJMAIN-6C" d="M42 46H56Q95 46 103 60V68Q103 77 103 91T103 124T104 167T104 217T104 272T104 329Q104 366 104 407T104 482T104 542T103 586T103 603Q100 622 89 628T44 637H26V660Q26 683 28 683L38 684Q48 685 67 686T104 688Q121 689 141 690T171 693T182 694H185V379Q185 62 186 60Q190 52 198 49Q219 46 247 46H263V0H255L232 1Q209 2 183 2T145 3T107 3T57 1L34 0H26V46H42Z"></path><path stroke-width="1" id="E25-MJMATHI-6C" d="M117 59Q117 26 142 26Q179 26 205 131Q211 151 215 152Q217 153 225 153H229Q238 153 241 153T246 151T248 144Q247 138 245 128T234 90T214 43T183 6T137 -11Q101 -11 70 11T38 85Q38 97 39 102L104 360Q167 615 167 623Q167 626 166 628T162 632T157 634T149 635T141 636T132 637T122 637Q112 637 109 637T101 638T95 641T94 647Q94 649 96 661Q101 680 107 682T179 688Q194 689 213 690T243 693T254 694Q266 694 266 686Q266 675 193 386T118 83Q118 81 118 75T117 65V59Z"></path><path stroke-width="1" id="E25-MJMATHI-68" d="M137 683Q138 683 209 688T282 694Q294 694 294 685Q294 674 258 534Q220 386 220 383Q220 381 227 388Q288 442 357 442Q411 442 444 415T478 336Q478 285 440 178T402 50Q403 36 407 31T422 26Q450 26 474 56T513 138Q516 149 519 151T535 153Q555 153 555 145Q555 144 551 130Q535 71 500 33Q466 -10 419 -10H414Q367 -10 346 17T325 74Q325 90 361 192T398 345Q398 404 354 404H349Q266 404 205 306L198 293L164 158Q132 28 127 16Q114 -11 83 -11Q69 -11 59 -2T48 16Q48 30 121 320L195 616Q195 629 188 632T149 637H128Q122 643 122 645T124 664Q129 683 137 683Z"></path><path stroke-width="1" id="E25-MJMATHI-6B" d="M121 647Q121 657 125 670T137 683Q138 683 209 688T282 694Q294 694 294 686Q294 679 244 477Q194 279 194 272Q213 282 223 291Q247 309 292 354T362 415Q402 442 438 442Q468 442 485 423T503 369Q503 344 496 327T477 302T456 291T438 288Q418 288 406 299T394 328Q394 353 410 369T442 390L458 393Q446 405 434 405H430Q398 402 367 380T294 316T228 255Q230 254 243 252T267 246T293 238T320 224T342 206T359 180T365 147Q365 130 360 106T354 66Q354 26 381 26Q429 26 459 145Q461 153 479 153H483Q499 153 499 144Q499 139 496 130Q455 -11 378 -11Q333 -11 305 15T277 90Q277 108 280 121T283 145Q283 167 269 183T234 206T200 217T182 220H180Q168 178 159 139T145 81T136 44T129 20T122 7T111 -2Q98 -11 83 -11Q66 -11 57 -1T48 16Q48 26 85 176T158 471L195 616Q196 629 188 632T149 637H144Q134 637 131 637T124 640T121 647Z"></path><path stroke-width="1" id="E25-MJMATHI-6E" d="M21 287Q22 293 24 303T36 341T56 388T89 425T135 442Q171 442 195 424T225 390T231 369Q231 367 232 367L243 378Q304 442 382 442Q436 442 469 415T503 336T465 179T427 52Q427 26 444 26Q450 26 453 27Q482 32 505 65T540 145Q542 153 560 153Q580 153 580 145Q580 144 576 130Q568 101 554 73T508 17T439 -10Q392 -10 371 17T350 73Q350 92 386 193T423 345Q423 404 379 404H374Q288 404 229 303L222 291L189 157Q156 26 151 16Q138 -11 108 -11Q95 -11 87 -5T76 7T74 17Q74 30 112 180T152 343Q153 348 153 366Q153 405 129 405Q91 405 66 305Q60 285 60 284Q58 278 41 278H27Q21 284 21 287Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)"><use xlink:href="#E25-MJMATHI-61" x="0" y="0"></use><use xlink:href="#E25-MJMATHI-77" x="529" y="0"></use><use xlink:href="#E25-MJMATHI-65" x="1246" y="0"></use><use xlink:href="#E25-MJMATHI-66" x="1712" y="0"></use><g transform="translate(2263,0)"><use xlink:href="#E25-MJMAIN-31"></use><use xlink:href="#E25-MJMAIN-32" x="500" y="0"></use><use xlink:href="#E25-MJMAIN-33" x="1001" y="0"></use><use xlink:href="#E25-MJMAIN-31" x="1501" y="0"></use><use xlink:href="#E25-MJMAIN-32" x="2002" y="0"></use><use xlink:href="#E25-MJMAIN-33" x="2502" y="0"></use></g><use xlink:href="#E25-MJMATHI-61" x="5266" y="0"></use><use xlink:href="#E25-MJMATHI-77" x="5795" y="0"></use><use xlink:href="#E25-MJMATHI-65" x="6512" y="0"></use><use xlink:href="#E25-MJMATHI-66" x="6978" y="0"></use><use xlink:href="#E25-MJMATHI-61" x="7529" y="0"></use><use xlink:href="#E25-MJMATHI-77" x="8058" y="0"></use><use xlink:href="#E25-MJMATHI-65" x="8775" y="0"></use><use xlink:href="#E25-MJMATHI-66" x="9241" y="0"></use><g transform="translate(9958,0)"><use xlink:href="#E25-MJMAIN-73"></use><use xlink:href="#E25-MJMAIN-69" x="394" y="0"></use><use xlink:href="#E25-MJMAIN-6E" x="673" y="0"></use></g><g transform="translate(11188,0)"><use xlink:href="#E25-MJMAIN-28" x="0" y="0"></use><use xlink:href="#E25-MJMAIN-29" x="389" y="0"></use></g><g transform="translate(11967,0)"><use xlink:href="#E25-MJMAIN-31"></use><use xlink:href="#E25-MJMAIN-32" x="500" y="0"></use><use xlink:href="#E25-MJMAIN-33" x="1001" y="0"></use></g><use xlink:href="#E25-MJMATHI-6D" x="13468" y="0"></use><use xlink:href="#E25-MJMATHI-6F" x="14347" y="0"></use><use xlink:href="#E25-MJMAIN-3B" x="14832" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="15277" y="0"></use><use xlink:href="#E25-MJMATHI-6F" x="15690" y="0"></use><use xlink:href="#E25-MJMAIN-3B" x="16175" y="0"></use><g transform="translate(16621,0)"><use xlink:href="#E25-MJMAIN-6C"></use><use xlink:href="#E25-MJMAIN-6E" x="278" y="0"></use></g><use xlink:href="#E25-MJMATHI-6C" x="17622" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="17921" y="0"></use><use xlink:href="#E25-MJMATHI-68" x="18333" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="18910" y="0"></use><use xlink:href="#E25-MJMATHI-6B" x="19322" y="0"></use><use xlink:href="#E25-MJMATHI-6C" x="19844" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="20142" y="0"></use><use xlink:href="#E25-MJMATHI-6B" x="20555" y="0"></use><use xlink:href="#E25-MJMATHI-68" x="21076" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="21653" y="0"></use><use xlink:href="#E25-MJMATHI-6E" x="22065" y="0"></use><use xlink:href="#E25-MJMATHI-6A" x="22666" y="0"></use><use xlink:href="#E25-MJMATHI-6B" x="23078" y="0"></use><g transform="translate(23600,0)"><use xlink:href="#E25-MJMAIN-31"></use><use xlink:href="#E25-MJMAIN-32" x="500" y="0"></use><use xlink:href="#E25-MJMAIN-33" x="1001" y="0"></use></g><use xlink:href="#E25-MJMATHI-61" x="25101" y="0"></use><use xlink:href="#E25-MJMATHI-77" x="25631" y="0"></use><use xlink:href="#E25-MJMATHI-65" x="26347" y="0"></use><use xlink:href="#E25-MJMATHI-66" x="26814" y="0"></use><use xlink:href="#E25-MJMATHI-61" x="27364" y="0"></use><use xlink:href="#E25-MJMATHI-77" x="27894" y="0"></use><use xlink:href="#E25-MJMATHI-65" x="28610" y="0"></use><use xlink:href="#E25-MJMATHI-66" x="29077" y="0"></use></g></svg>',
  });
});
document.body.appendChild(button2);


let lastEditedBox = null;
document.body.addEventListener('click', e => {
  let node = e.target;
  while (node !== document.body) {
    if (node.classList.contains('edited-box')) {
      if (lastEditedBox !== node) {
        if (lastEditedBox != null) {
          lastEditedBox.innerHTML = editor.getContent();
          lastEditedBox.appendChild(box);
          setTimeout(() => {
            // editor.quill.setSelection(0, 0);
          }, 0)
        }
        lastEditedBox = node;
        editor.setContent(node.innerHTML.trim());
        node.innerHTML = '';
        box.style.display = 'block';
        lastEditedBox.appendChild(box);
        setTimeout(() => {
          editor.quill.setSelection(0, 0);
          editor.format('paragraph-bottom-space', 'normal');

        }, 0)
        return;
      }
      break;
    } else {
      node = node.parentNode;
    }
  }
  // editor.hide();
});
