import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public activeLang = 'es';
  loginForm!: FormGroup;
  submitted = false;

  @BlockUI() blockUI!: NgBlockUI;
  constructor(@Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private formBuilder: FormBuilder) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
    this.document.body.style.background = '#000';
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required]]
    });
  }

  login() {
    this.blockUI.start();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.blockUI.stop();
      return;
    }
  }

  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }

  get f() { return this.loginForm.controls; }
}
