import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img {
      width: 100%;
      border-radius: 5px;
       }

    `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe = {
    superhero: '',
    publisher: Publisher.DCComics,
    alter_ego: '',
    first_appearance: '',
    characters: '',
    alt_img: ''
  }

  accion: string = 'Nuevo';
  mySubscription: any;

  constructor( private activatedRoute: ActivatedRoute,
               private heroesService: HeroesService,
               private router: Router,
               private snackBar: MatSnackBar,
               public dialog: MatDialog) {
                //esto es para refrescar el componente y me actualice la imagen:
                this.router.routeReuseStrategy.shouldReuseRoute = function () {
                  return false;
                };
                this.mySubscription = this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    // Trick the Router into believing it's last link wasn't previously loaded
                    this.router.navigated = false;
                  }
                });
               }

  ngOnInit(): void {
    if( !this.router.url.includes('editar') ) { return }
    // this.activatedRoute.params.subscribe( resp => {
    //   this.heroesService.getHeroePorId(resp.id).
    //     subscribe( heroe => {this.heroe = heroe});
    // });
    this.activatedRoute.params.pipe(
      switchMap( ({id}) => this.heroesService.getHeroePorId(id))
    ).subscribe(heroe => {
      this.heroe = heroe;
      this.accion = 'Editar';
    });


    //.subscribe(console.log)
    // this.heroesService.editarHeroe(resp.id)
      // .subscribe(resp => console.log)

  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {return}

    if (this.heroe.id){
      this.heroesService.editarHeroe(this.heroe)
      .subscribe(heroe => {
        console.log('Actualizado', heroe);
        this.mostrarSnackBar('Actualizado', 'Cerrar');
      });
      this.router.navigate(['heroes/editar', this.heroe.id]);

    }else{
      this.accion = 'Nuevo';
      this.heroesService.agregarHeroe(this.heroe)
      .subscribe (heroe => {
        console.log('Guardado', heroe);
        this.mostrarSnackBar('Guardado', 'Cerrar');
        this.router.navigate(['heroes/editar', heroe.id]);
      });
    }
  }

  borrar() {

    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroe
    });

    dialog.afterClosed().subscribe( resp => {
      if(resp) { //resp devuelve true o undefined dependiendo de si le das a cancelar o borrar
        this.heroesService.deleteHeroe(this.heroe.id!)
        .subscribe(resp => {
          this.router.navigate(['heroes']);
          this.mostrarSnackBar('Borrado', 'Cerrar');
        });
      }
    })

  }


  mostrarSnackBar(mensaje: string, action: string) {
    this.snackBar.open(mensaje, action, {
      duration: 2000,
    });
  }




ngOnDestroy() {
  if (this.mySubscription) {
    this.mySubscription.unsubscribe();
  }
}


}
function openDialog() {
  throw new Error('Function not implemented.');
}

