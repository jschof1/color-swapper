// Import stylesheets
import './style.css';

const inputImage = document.getElementById('inputImage');
const sourceColor = document.getElementById('sourceColor');
const targetColor = document.getElementById('targetColor');
const processImage = document.getElementById('processImage');
const imageCanvas = document.getElementById('imageCanvas');
const downloadImage = document.getElementById('downloadImage');
const ctx = imageCanvas.getContext('2d');

inputImage.addEventListener('change', (e) => {
  const img = new Image();
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = () => {
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };
});

function colorDistanceSquared(color1, color2) {
  return Math.pow(color1.r - color2.r, 2) + Math.pow(color1.g - color2.g, 2) + Math.pow(color1.b - color2.b, 2);
}

function replaceColor(source, target, tolerance = 32) {
  const imgData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

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

processImage.addEventListener('click', () => {
  const source = hexToRgb(sourceColor.value);
  const target = hexToRgb(targetColor.value);
  replaceColor(source, target);
});

downloadImage.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'processed_image.png';
  link.href = imageCanvas.toDataURL('image/png');
  link.click();
});