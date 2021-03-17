import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth(){
    return { ...this._auth}
  }

  constructor( private http: HttpClient ) { }

  login() {
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap( resp => this._auth = resp ),
        tap( resp => localStorage.setItem('token', resp.id) )
      );
  }

  logout() {
    console.log('Estoy en el logout-service')
    this._auth = undefined;
    localStorage.removeItem('token');
  }

  verificaAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('token')){
      return of(false);
    }
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap( usuario => this._auth = usuario ),
        map( usuario => {
          console.log('map', usuario);
          return true;
        } )
      );
  }

}
