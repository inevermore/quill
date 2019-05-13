function getMathImgSrcList(latexArr) {
  const BASE64_MAP = {
    ykparallelogram:
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjEycHgiIHZpZXdCb3g9IjAgMCAxOCAxMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT7lhazlvI8vNy9qaWhlLTE2IGNvcHk8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0i5YWs5byPLzcvamloZS0xNi1jb3B5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJHcm91cC00MyIgZmlsbD0iIzAwMDAwMCI+ICAgICAgICAgICAgPHBhdGggZD0iTTQuMjg3ODA3MTEsMS42NTE2ODUzOSBMMi4xMTIzMTQ5NywxMC4zNDgzMTQ2IEwxMy44MTM4MjU3LDEwLjM0ODMxNDYgTDE1Ljk4OTMxNzksMS42NTE2ODUzOSBMNC4yODc4MDcxMSwxLjY1MTY4NTM5IFogTTE1LjAzMzQxOTgsMTIgTDAsMTIgTDIuOTY5MzI3MDMsMCBMMTgsMCBMMTUuMDMzNDE5OCwxMiBaIiBpZD0iRmlsbC0yMyI+PC9wYXRoPiAgICAgICAgPC9nPiAgICA8L2c+PC9zdmc+',
    ykrectangle:
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjEycHgiIHZpZXdCb3g9IjAgMCAyMCAxMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT7lhazlvI8vNy9qaWhlLTE1IGNvcHk8L3RpdGxlPiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4gICAgPGRlZnM+PC9kZWZzPiAgICA8ZyBpZD0i5YWs5byPLzcvamloZS0xNS1jb3B5IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxnIGlkPSJHcm91cC00MyIgZmlsbD0iIzAwMDAwMCI+ICAgICAgICAgICAgPHBhdGggZD0iTTEuNzk3NjQ5OTMsMTAuMTYyNTc2NyBMMTguMjA1NDAyMSwxMC4xNjI1NzY3IEwxOC4yMDU0MDIxLDEuODAzNjgwOTggTDEuNzk3NjQ5OTMsMS44MDM2ODA5OCBMMS43OTc2NDk5MywxMC4xNjI1NzY3IFogTTAsMTIgTDIwLDEyIEwyMCwwIEwwLDAgTDAsMTIgWiIgaWQ9IkZpbGwtMjIiPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==',
    ykcong:
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIzMnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAzMiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT4xeHVndWFueGktMTIgY29weUAyeDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZGVmcz48L2RlZnM+ICAgIDxnIGlkPSIxeHVndWFueGktMTItY29weSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iMXh1Z3VhbnhpLTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgMC4wMDAwMDApIiBmaWxsPSIjMjkyQzMzIj4gICAgICAgICAgICA8cGF0aCBkPSJNMCwxMy44MTU0Mjk3IEwxNiwxMy44MTU0Mjk3IEwxNiwxNS40NzA3MDMxIEwwLDE1LjQ3MDcwMzEgTDAsMTMuODE1NDI5NyBaIE03LjIzNzYwMjY5LDMuNjUyODIwMTggQzguNDM2Njc3MSwwLjk0NDg1MjUzMyAxMC4xNjI3OTU4LDQuOTczNjM3NTZlLTE1IDEyLjExMTU1MTIsMy4xMDg2MjQ0N2UtMTUgQzE0LjI4NTY2MzEsNi44NDg4NTI1OWUtMTUgMTYsMS43NzkwNTAwNSAxNiw0LjAwMDU2NjM2IEMxNiw2LjE4OTI4Mzg0IDE0LjMzNjkzMTgsNy44ODM0MDI1NyAxMi4xNTM5OTM3LDggTDEyLjA2OTEwODcsNi4zMTc4MTY0NiBDMTMuNDAzMzgwMyw2LjI0NjU0ODkxIDE0LjM2Mjc1ODQsNS4yNjkyNTg2OSAxNC4zNjI3NTg0LDQuMDAwNTY2MzYgQzE0LjM2Mjc1ODQsMi43MDYxMDc4OSAxMy4zNzgyNjI1LDEuNjg0NDQ5IDEyLjExMTU1MTIsMS42ODQ0NDkgQzEwLjc1NTg3MjQsMS42ODQ0NDkgOS42Mjg0MTIzLDIuMzAyNDQ5MzIgOC43MTgxNTgxNCw0LjM3MDQ1Mjg4IEw4LjcxNzA4MzI5LDQuMzY5OTUxMzggQzcuNTE4Mjc2MzksNy4wNzcxNjU0MyA1LjgzNzAwNzIyLDggMy44ODg0NDg4Miw4IEMxLjcxNDMzNjg5LDggMCw2LjIyMDk0OTk1IDAsMy45OTk0MzM2NCBDMCwxLjgxMDcxNjE2IDEuNjYzMDY4MjQsMC4xMTY1OTc0MzIgMy44NDYwMDYzNCwxLjMzMjI2NzYzZS0xNSBMMy45MzA4OTEzMSwxLjY4MjE4MzU0IEMyLjU5NjYxOTY3LDEuNzUzNDUxMDkgMS42MzcyNDE2MSwyLjczMDc0MTMxIDEuNjM3MjQxNjEsMy45OTk0MzM2NCBDMS42MzcyNDE2MSw1LjI5Mzg5MjExIDIuNjIxNzM3NTQsNi4zMTU1NTEgMy44ODg0NDg4Miw2LjMxNTU1MSBDNS4yNDQxMjc2Miw2LjMxNTU1MSA2LjMyNTU3ODgyLDUuNzE5OTk5MjIgNy4yMzU4MzI5NywzLjY1MTk5NTY2IEw3LjIzNzYwMjY5LDMuNjUyODIwMTggWiBNMCwxMCBMMTYsMTAgTDE2LDExLjY1NTI3MzQgTDAsMTEuNjU1MjczNCBMMCwxMCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=='
  };
  // 因为公式编辑器已经在编辑过滤，所有这里不做filter

  return new Promise(resolve => {
    latexToSvg(latexArr).then(svgs => {
      const list = [];
      const promises = Array.from(svgs).map((svg, index) => {
        return new Promise(res => {
          Array.from(svg.querySelectorAll('image')).forEach(img => {
            const href = img.getAttribute('href') || '';
            img.setAttribute(
              'xlink:href',
              BASE64_MAP[
                href.slice(href.lastIndexOf('/') + 1, href.lastIndexOf('.'))
              ] || '',
            );
            img.removeAttribute('href');
          });
          const area = document.createElement('canvas');
          area.setAttribute('width', '500px');
          area.setAttribute('height', '500px');
          area.setAttribute('style', 'display: none');
          // 转换
          if (window.canvg === undefined) {
            throw new Error('canvg is needed. Please refer to demo');
          }
          window.canvg(area, svg.outerHTML, {
            ignoreClear: false,
            renderCallback: () => {
              // 找到自己的位置
              list[index] = {
                src: area.toDataURL('image/png'),
                latex: latexArr[index]
                  .slice(1, latexArr[index].length - 1)
                  .replace(/&gt;/g, '>')
                  .replace(/&lt;/g, '<'),
              };
              res();
            },
          });
        });
      });
      Promise.all(promises).then(() => {
        resolve(list);
      });
    });
  });
}

function latexToSvg(latexArr) {
  return new Promise(resolve => {
    const container = document.createElement('div');
    latexArr.forEach(latex => {
      const div = document.createElement('div');
      div.innerHTML = latex.replace(/>/g, '&gt;').replace(/</g, '&lt;');
      container.appendChild(div);
    });
    if (window.MathJax === undefined) {
      throw new Error('MathJax is needed. Please refer to demo');
    }
    window.MathJax.Hub.Queue(
      ['Typeset', window.MathJax.Hub, container],
      [
        () => {
          const svgs = container.querySelectorAll('svg');
          resolve(svgs);
        },
      ],
    );
  });
}

export { getMathImgSrcList as default, latexToSvg };
