const imagesUrl = [
  new URL('/src/assets/images/works1.jpg', import.meta.url).href,
  new URL('/src/assets/images/works2.jpg', import.meta.url).href,
  new URL('/src/assets/images/works3.jpg', import.meta.url).href,
  new URL('/src/assets/images/works4.jpg', import.meta.url).href,
  new URL('/src/assets/images/works5.jpg', import.meta.url).href,
  new URL('/src/assets/images/works6.jpg', import.meta.url).href,
  new URL('/src/assets/images/works7.jpg', import.meta.url).href,
  new URL('/src/assets/images/works8.jpg', import.meta.url).href,
  new URL('/src/assets/images/works9.jpg', import.meta.url).href,
  new URL('/src/assets/images/works10.jpg', import.meta.url).href,
  new URL('/src/assets/images/works11.jpg', import.meta.url).href,
  new URL('/src/assets/images/works12.jpg', import.meta.url).href,
  new URL('/src/assets/images/works13.jpg', import.meta.url).href,
  new URL('/src/assets/images/works14.jpg', import.meta.url).href,
  new URL('/src/assets/images/works15.jpg', import.meta.url).href,
  new URL('/src/assets/images/works16.jpg', import.meta.url).href,
  new URL('/src/assets/images/works17.jpg', import.meta.url).href,
  new URL('/src/assets/images/works18.jpg', import.meta.url).href,
  new URL('/src/assets/images/works19.jpg', import.meta.url).href,
  new URL('/src/assets/images/works20.jpg', import.meta.url).href,
  new URL('/src/assets/images/works21.jpg', import.meta.url).href,
  new URL('/src/assets/images/works22.jpg', import.meta.url).href,
  new URL('/src/assets/images/works23.jpg', import.meta.url).href,
  new URL('/src/assets/images/works24.jpg', import.meta.url).href,
  new URL('/src/assets/images/works25.jpg', import.meta.url).href,
  new URL('/src/assets/images/works26.jpg', import.meta.url).href,
  new URL('/src/assets/images/works27.jpg', import.meta.url).href,
  new URL('/src/assets/images/works28.jpg', import.meta.url).href,
  new URL('/src/assets/images/works29.jpg', import.meta.url).href,
  new URL('/src/assets/images/works30.jpg', import.meta.url).href,
  new URL('/src/assets/images/works31.jpg', import.meta.url).href,
  new URL('/src/assets/images/works32.jpg', import.meta.url).href,
  new URL('/src/assets/images/works33.jpg', import.meta.url).href,
  new URL('/src/assets/images/works34.jpg', import.meta.url).href,
  new URL('/src/assets/images/works35.jpg', import.meta.url).href,
  new URL('/src/assets/images/works36.jpg', import.meta.url).href,
  new URL('/src/assets/images/works37.jpg', import.meta.url).href,
  new URL('/src/assets/images/works38.jpg', import.meta.url).href,
  new URL('/src/assets/images/works39.jpg', import.meta.url).href,
  new URL('/src/assets/images/works40.jpg', import.meta.url).href,
  new URL('/src/assets/images/works41.jpg', import.meta.url).href,
  new URL('/src/assets/images/works42.jpg', import.meta.url).href,
  new URL('/src/assets/images/works43.jpg', import.meta.url).href,
  new URL('/src/assets/images/works44.jpg', import.meta.url).href,
  new URL('/src/assets/images/works45.jpg', import.meta.url).href,
  new URL('/src/assets/images/works46.jpg', import.meta.url).href,
  new URL('/src/assets/images/works47.jpg', import.meta.url).href,
  new URL('/src/assets/images/works48.jpg', import.meta.url).href,
  new URL('/src/assets/images/works49.jpg', import.meta.url).href,
  new URL('/src/assets/images/works50.jpg', import.meta.url).href,
  new URL('/src/assets/images/works51.jpg', import.meta.url).href,
  new URL('/src/assets/images/works52.jpg', import.meta.url).href,
  new URL('/src/assets/images/works53.jpg', import.meta.url).href,
  new URL('/src/assets/images/works54.jpg', import.meta.url).href,
  new URL('/src/assets/images/works55.jpg', import.meta.url).href,
  new URL('/src/assets/images/works56.jpg', import.meta.url).href,
  new URL('/src/assets/images/works57.jpg', import.meta.url).href,
  new URL('/src/assets/images/works58.jpg', import.meta.url).href,
  new URL('/src/assets/images/works59.jpg', import.meta.url).href,
  new URL('/src/assets/images/works60.jpg', import.meta.url).href,
  new URL('/src/assets/images/works61.jpg', import.meta.url).href,
  new URL('/src/assets/images/works62.jpg', import.meta.url).href,
  new URL('/src/assets/images/works63.jpg', import.meta.url).href,
  new URL('/src/assets/images/works64.jpg', import.meta.url).href,
  new URL('/src/assets/images/works65.jpg', import.meta.url).href,
  new URL('/src/assets/images/works66.jpg', import.meta.url).href,
  new URL('/src/assets/images/works67.jpg', import.meta.url).href,
  new URL('/src/assets/images/works68.jpg', import.meta.url).href,
  new URL('/src/assets/images/works69.jpg', import.meta.url).href,
  new URL('/src/assets/images/works70.jpg', import.meta.url).href,
  new URL('/src/assets/images/works71.jpg', import.meta.url).href,
  new URL('/src/assets/images/works72.jpg', import.meta.url).href,
  new URL('/src/assets/images/works73.jpg', import.meta.url).href,
  new URL('/src/assets/images/works74.jpg', import.meta.url).href,
  new URL('/src/assets/images/works75.jpg', import.meta.url).href,
  new URL('/src/assets/images/works76.jpg', import.meta.url).href,
  new URL('/src/assets/images/works77.jpg', import.meta.url).href,
  new URL('/src/assets/images/works78.jpg', import.meta.url).href,
  new URL('/src/assets/images/works79.jpg', import.meta.url).href,
  new URL('/src/assets/images/works80.jpg', import.meta.url).href,
  new URL('/src/assets/images/works81.jpg', import.meta.url).href,
  new URL('/src/assets/images/works82.jpg', import.meta.url).href,
  new URL('/src/assets/images/works83.jpg', import.meta.url).href,
  new URL('/src/assets/images/works84.jpg', import.meta.url).href,
  new URL('/src/assets/images/works85.jpg', import.meta.url).href,
  new URL('/src/assets/images/works86.jpg', import.meta.url).href,
  new URL('/src/assets/images/works87.jpg', import.meta.url).href,
  new URL('/src/assets/images/works88.jpg', import.meta.url).href,
  new URL('/src/assets/images/works89.jpg', import.meta.url).href,
  new URL('/src/assets/images/works90.jpg', import.meta.url).href,
  new URL('/src/assets/images/works91.jpg', import.meta.url).href,
  new URL('/src/assets/images/works92.jpg', import.meta.url).href,
  new URL('/src/assets/images/works93.jpg', import.meta.url).href,
  new URL('/src/assets/images/works94.jpg', import.meta.url).href,
  new URL('/src/assets/images/works95.jpg', import.meta.url).href,
  new URL('/src/assets/images/works96.jpg', import.meta.url).href,
  new URL('/src/assets/images/works97.jpg', import.meta.url).href,
  new URL('/src/assets/images/works98.jpg', import.meta.url).href,
  new URL('/src/assets/images/works99.jpg', import.meta.url).href,
  new URL('/src/assets/images/works100.jpg', import.meta.url).href,
  new URL('/src/assets/images/works101.jpg', import.meta.url).href,
  new URL('/src/assets/images/works102.jpg', import.meta.url).href,
  new URL('/src/assets/images/works103.jpg', import.meta.url).href,
  new URL('/src/assets/images/works104.jpg', import.meta.url).href,
  new URL('/src/assets/images/works105.jpg', import.meta.url).href,
  new URL('/src/assets/images/works106.jpg', import.meta.url).href,
  new URL('/src/assets/images/works107.jpg', import.meta.url).href,
  new URL('/src/assets/images/works108.jpg', import.meta.url).href,
  new URL('/src/assets/images/works109.jpg', import.meta.url).href,
  new URL('/src/assets/images/works110.jpg', import.meta.url).href,
  new URL('/src/assets/images/works111.jpg', import.meta.url).href,
  new URL('/src/assets/images/works112.jpg', import.meta.url).href,
  new URL('/src/assets/images/works113.jpg', import.meta.url).href,
  new URL('/src/assets/images/works114.jpg', import.meta.url).href,
  new URL('/src/assets/images/works115.jpg', import.meta.url).href,
  new URL('/src/assets/images/works116.jpg', import.meta.url).href,
  new URL('/src/assets/images/works117.jpg', import.meta.url).href,
  new URL('/src/assets/images/works118.jpg', import.meta.url).href,
  new URL('/src/assets/images/works119.jpg', import.meta.url).href,
  new URL('/src/assets/images/works120.jpg', import.meta.url).href,
  new URL('/src/assets/images/works121.jpg', import.meta.url).href,
  new URL('/src/assets/images/works122.jpg', import.meta.url).href,
  new URL('/src/assets/images/works123.jpg', import.meta.url).href,
];

export { imagesUrl };