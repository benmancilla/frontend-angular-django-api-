import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'coolApp',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'res://ic_stat_name', // Personaliza el ícono de la notificación
      iconColor: '#0000FF' // Usa `iconColor` en lugar de `color`
    }
  }
};

export default config;
