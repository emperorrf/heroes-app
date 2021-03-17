import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  : Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.verificaAutenticacion()
    .pipe(
      tap((autenticado) => {
        if(!autenticado) { this.router.navigate(['./auth/login']) }
      })
    );
  }

  //   if ( this.authService.auth.id ){
  //     return true;
  //   }
  //   console.log ('Bloqueado por el AuthGuard - CanActivated');
  // return false;
  //}

  canLoad(
    // si puede cargar un módulo
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.verificaAutenticacion()
    .pipe(
      tap((autenticado) => {
        if(!autenticado) { this.router.navigate(['./auth/login']) }
      })
    );
  }
    // if (this.authService.auth.id) {
    //   return true;
    // }
    // console.log('Bloqueado por el AuthGuard');
    // return false;}

}
