import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LOCALE_ID, enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';


platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    providers: [{ provide: LOCALE_ID, useValue: 'pt-BR'}]
  })
  .catch(err => console.error(err));
