import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-recupera-contrasena',
  templateUrl: './recupera-contrasena.component.html',
  styleUrls: ['./recupera-contrasena.component.css']
})
export class RecuperaContrasenaComponent implements OnInit {

  public activeLang = 'es';
  recuperaForm: FormGroup;
  submitted = false;
  credentials: TokenPayload = {
    email: '',
    password: ''
  }
  envioRecuperacion = false;
  toggleFlag = false;
  es = true;

  @BlockUI() blockUI!: NgBlockUI;
  constructor(@Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
    this.document.body.style.background = '#000';
    this.recuperaForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
    });
  }

  recuperaContrasena() {
    this.blockUI.start();
    this.submitted = true;
    if (this.recuperaForm.invalid) {
      this.blockUI.stop();
      return;
    }
    this.auth.recupera(this.credentials).subscribe(
      () => {
        this.blockUI.stop();
        this.envioRecuperacion = true;
      },
      err => {
        this.blockUI.stop();
        console.error(err);
      }
    )
  }

  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    if (this.activeLang === 'en') {
      this.es = false;
    } else {
      this.es = true;
    }
    this.translate.use(lang);
  }

  get f() { return this.recuperaForm.controls; }

  showDropdown() { this.toggleFlag = !this.toggleFlag; }

}
