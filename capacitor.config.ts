import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.umsaeed.recipes',
  appName: 'وصفات ام سعيد',
  webDir: 'out',
  server: {
    url: 'https://arabic-recipe-website.vercel.app/',  // حطي رابط موقعك هنا
    cleartext: true
  }
};

export default config;