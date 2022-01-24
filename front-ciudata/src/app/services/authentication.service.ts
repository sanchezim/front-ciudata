import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
}

export interface Register {
  id: number;
  correo: string;
  nombre: string;
  apellidos: string;
  contrasena: string;
  id_perfil: number;
}

export interface Contacto {
  correo: string;
  nombre: string;
  mensaje: string;
}

@Injectable()
export class AuthenticationService {
  private token: string;
  urlLogin: string;
  apiUrl: string;
  urlRegistro: string;
  urlProfile: string;
  urlRecupera: string;
  urlContacto: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.urlLogin = this.apiUrl + environment.URI_LOGIN;
    this.urlRegistro = this.apiUrl + environment.URI_REGISTRO;
    this.urlProfile = this.apiUrl + environment.URI_PROFILE;
    this.urlRecupera = this.apiUrl + environment.URI_RECUPERA;
    this.urlContacto = this.apiUrl + environment.URI_CONTACTO_BUZON;
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

  public isLoggedIn(): boolean {
    const user = this.getUserDetails()
    if (user) {
      return user.exp > Date.now() / 1000
    } else {
      return false
    }
  }

  public register(user: Register): Observable<any> {
    return this.http.post(this.urlRegistro, user)
  }

  public contacto(contacto: Contacto): Observable<any> {
    return this.http.post(this.urlContacto, contacto)
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

  public profile(): Observable<any> {
    return this.http.get(this.urlProfile, {
      headers: { Authorization: ` ${this.getToken()}` }
    })
  }

  public logout(): void {
    this.token = ''
    window.localStorage.removeItem('usertoken')
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
  });
  }
}