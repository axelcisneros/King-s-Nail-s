import images from '@assets/images';

const imagesUrl = Object.keys(images).map(key => images[key]);
console.log(imagesUrl);
export { imagesUrl };