import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styles: [
    `
    img {
      width: 100%;
      border-radius: 5px;
    }
    `
  ]
})
export class HeroeComponent implements OnInit {

  heroe!: Heroe;

  constructor( private activatedRoute: ActivatedRoute,
               private heroesService: HeroesService,
               private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params
    // .subscribe ( params => console.log (params.id))
    // .subscribe ( ({id}) => console.log (id))
    // .subscribe ( params => {
    //   this.heroesService.getHeroePorId( params.id)
    //   .subscribe ( resp => {
    //     this.heroe = resp;
    //   })
    // })
    .pipe(
      switchMap( ({id}) => this.heroesService.getHeroePorId( id ) )
    )
    .subscribe( resp => this.heroe = resp )
  }


  regresar() {
    this.router.navigate(['/heroes/listado'])
  }

}


