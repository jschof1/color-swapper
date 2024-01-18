const inputImages = document.getElementById('inputImages');
const sourceColor = document.getElementById('sourceColor');
const targetColor = document.getElementById('targetColor');
const processImages = document.getElementById('processImages');
const imageContainer = document.getElementById('imageContainer');
const downloadImages = document.getElementById('downloadImages');

inputImages.addEventListener('change', (e) => {
  imageContainer.innerHTML = '';
  for (const file of e.target.files) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.border = '1px solid';
      canvas.style.margin = '5px';
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      imageContainer.appendChild(canvas);
    };
  }
});

function colorDistanceSquared(color1, color2) {
  return (
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2)
  );
}

function replaceColor(canvas, source, target, tolerance = 32) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imgData.data.length; i += 4) {
    const r = imgData.data[i];
    const g = imgData.data[i + 1];
    const b = imgData.data[i + 2];

    if (colorDistanceSquared({ r, g, b }, source) <= tolerance * tolerance) {
      imgData.data[i] = target.r;
      imgData.data[i + 1] = target.g;
      imgData.data[i + 2] = target.b;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

processImages.addEventListener('click', () => {
  const source = hexToRgb(sourceColor.value);
  const target = hexToRgb(targetColor.value);
  const canvases = imageContainer.getElementsByTagName('canvas');
  for (const canvas of canvases) {
    replaceColor(canvas, source, target);
  }
});

downloadImages.addEventListener('click', () => {
  const canvases = imageContainer.getElementsByTagName('canvas');
  const canvasArray = Array.from(canvases); // Convert the HTMLCollection to an array
  for (const [index, canvas] of canvasArray.entries()) {
    const link = document.createElement('a');
    link.download = `processed_image_${index + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
});
