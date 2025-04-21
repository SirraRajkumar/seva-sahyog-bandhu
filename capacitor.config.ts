
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eb1154e6c6cf493c8c3bcecc7633c974',
  appName: 'seva-sahyog-bandhu',
  webDir: 'dist',
  server: {
    // On mobile, leave url as empty string. For hot-reload/dev, use your preview URL.
    url: '',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#9b87f5",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;

