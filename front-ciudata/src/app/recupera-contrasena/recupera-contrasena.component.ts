import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recupera-contrasena',
  templateUrl: './recupera-contrasena.component.html',
  styleUrls: ['./recupera-contrasena.component.css']
})
export class RecuperaContrasenaComponent implements OnInit {

  public activeLang = 'es';
  envioRecuperacion = false;

  constructor(@Inject(DOCUMENT) private document: Document,
  private translate: TranslateService) {
    this.translate.setDefaultLang(this.activeLang);
   }

  ngOnInit(): void {
    this.document.body.style.background = '#000';
  }

  recuperaContrasena() {
    this.envioRecuperacion = true;
  }

  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }
  
}
