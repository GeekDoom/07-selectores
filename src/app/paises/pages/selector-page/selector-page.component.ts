import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators'



import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  })


  regiones: string[] = [];
  paises: Pais[] = [];
  fronteras: PaisSmall[] = [];

  cargando: boolean = false;
  noHayData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ps: PaisesService,
  ) { }

  ngOnInit(): void {

    this.regiones = this.ps.regiones;
    //Cuando selecciona la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.ps.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises
        this.cargando = false;
      })

    //Cuando selecciona el pais

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap(codigo => this.ps.getPaisesPorCodigo(codigo)),
        switchMap(pais => this.ps.getPaisesPorCodigos(pais?.borders!)),
      )
      .subscribe(paises => {
        console.log(paises);
        this.fronteras = paises;
        this.cargando = false;
      });



  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
