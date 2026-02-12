import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Carregar favicon dinâmico do config.json
async function loadFavicon() {
  try {
    const response = await fetch('/config.json', { cache: 'no-cache' });
    const config = await response.json();
    
    // Usar faviconUrl se existir, senão usa logoUrl como fallback
    const iconUrl = config.faviconUrl || config.logoUrl;
    
    if (iconUrl) {
      const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (favicon) {
        favicon.href = iconUrl;
      }
    }
  } catch (error) {
    // Ignora erro silenciosamente
  }
}

// Carregar favicon antes de iniciar a aplicação
loadFavicon().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
});
