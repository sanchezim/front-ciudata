import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface UserDetails {
  id: number;
  correo: string;
  nombre: string;
  apellidos: string;
  contrasena: string;
  id_perfil: number;
  exp: number;
}

export interface TokenPayload {
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  urlLogin: string;
  apiUrl: string;
  urlRecupera: string;
  urlValidarLogin: string;
  estaLogueado = false;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.urlLogin = environment.URI_LOGIN;
    this.urlRecupera = environment.URI_RECUPERA;
    this.urlValidarLogin = environment.URI_VALIDAR_LOGIN;
    /*this.urlLogin = this.apiUrl + environment.URI_LOGIN;
    this.urlRecupera = this.apiUrl + environment.URI_RECUPERA;
    this.urlValidarLogin = this.apiUrl + environment.URI_VALIDAR_LOGIN;*/
  }

  private saveToken(token: string): void {
    localStorage.setItem('usertoken', token)
    this.token = token
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('usertoken')!
    }
    return this.token
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken()
    let payload
    if (token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null!
    }
  }

  public isLoggedIn(): Observable<any> {
    return this.http.get(this.urlValidarLogin, this.getHttpHeaders());
  }

  public recupera(user: TokenPayload): Observable<any> {
    return this.http.post(this.urlRecupera, user)
  }

  public login(user: TokenPayload): Observable<any> {
    const base = this.http.post(this.urlLogin, user)

    const request = base.pipe(
      map((data: any) => {
        if (data.accessToken) {
          this.saveToken(data.accessToken)
        }
        return data
      })
    )

    return request
  }

  getHttpHeaders() {
    console.log(this.getToken())
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    };
    return httpOptions;
  }

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('usertoken')
    this.router.navigateByUrl('/login')
  }
}