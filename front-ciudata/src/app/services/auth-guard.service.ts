import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    estaLogueado = false;
    constructor(private router: Router,
        private auth: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.auth.isLoggedIn().subscribe((data: any) => {
            if (data.tokenValidate) {
                this.estaLogueado = true;
            } else {
                this.router.navigate(['/login']);
            }
          },
          (error) => {
            console.log(error)
          });
          return this.estaLogueado;
    }

}
