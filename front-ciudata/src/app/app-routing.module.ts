import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecuperaContrasenaComponent } from './recupera-contrasena/recupera-contrasena.component';
import { RolesPermisosComponent } from './roles-permisos/roles-permisos.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "recupera-contrasena", component: RecuperaContrasenaComponent },
  { path: "roles-permisos", component: RolesPermisosComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
