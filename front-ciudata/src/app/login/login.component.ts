import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public activeLang = 'es';
  loginForm!: FormGroup;
  submitted = false;
  credentials: TokenPayload = {
    email: '',
    password: ''
  }
  errorLogin: string = '';
  error = false;

  @BlockUI() blockUI!: NgBlockUI;
  constructor(@Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router) {
    this.translate.setDefaultLang(this.activeLang);
  }

  ngOnInit(): void {
    this.document.body.style.background = '#000';
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    this.blockUI.start();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.blockUI.stop();
      return;
    }
    this.auth.login(this.credentials).subscribe((data: any) => {
        this.blockUI.stop();
        if (data.errors) {
          this.error = true;
          this.errorLogin = data.message;
        } else {
          this.router.navigateByUrl('/roles-permisos');
        }
      },
      err => {
        this.blockUI.stop();
        console.error(err);
      }
    )
  }

  public cambiarLenguaje(lang: string) {
    this.activeLang = lang;
    this.translate.use(lang);
  }

  get f() { return this.loginForm.controls; }
}
