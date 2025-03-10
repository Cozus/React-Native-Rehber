import { createIconSet } from 'react-native-vector-icons';

console.log('Loading AkademikIcon with:', require('./akademik-icons.json')); // JSON kontrolü

const AkademikIcon = createIconSet(
  require('./akademik-icons.json'), // JSON dosyasının yolu
  'akademik-icons',                // Font ailesi adı
  './assets/fonts/akademik-icons.ttf'             // Font dosyasının adı
);

export default AkademikIcon;