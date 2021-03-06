import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert';

import { UsuarioService } from '../services/services.index';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './login.component.css' ]
})
export class RegisterComponent implements OnInit {


  forma: FormGroup;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
  ) { }

  sonIguales( campo1: string, campo2: string) {
    return ( group: FormGroup ) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {sonIguales: true};
    };
  }

  ngOnInit() {
    init_plugins();

    // Para manejar todos los campos del formulario
    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl( false )
    }, { validators:  this.sonIguales('password', 'password2') });
  }

  registrarUsuario() {

    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.condiciones ) {
      console.log('Debe aceptar las condiciones');
      swal('Importante', 'Debe aceptar las condiciones', 'warning');
      return;
    }

    // Aqui el formulario es válido
    // creao un usuario
    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password,
    );

    // llamo al servicio
    this._usuarioService.crearUsuario( usuario )
      .subscribe( resp => {

        console.log(resp);
        this.router.navigate(['/login']);

      });


  }

}
