function imageToFile(image) {
  const canvas = imageToCanvas(image);
  const base64 = canvasToImage(canvas);
  const file = dataURLtoFile(base64.src, 'file.png');
  return file;
}

function imageToCanvas(image) {
  const canvas = document.createElement('canvas');
  // 需要使用图片原始尺寸，否则会被裁剪
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalheight;
  canvas.getContext('2d').drawImage(image, 0, 0);

  return canvas;
}

function canvasToImage(canvas) {
  const image = new window.Image();
  image.src = canvas.toDataURL('image/png');
  return image;
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export default imageToFile;
