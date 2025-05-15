import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  lastRutLength = 0;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Formateo automático de RUT
    this.userForm.get('rut')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar puntos y guiones existentes
        const cleanRut = value.replace(/\./g, '').replace(/-/g, '');
        
        // No hacer nada más si el usuario está borrando caracteres
        if (cleanRut.length <= this.lastRutLength) {
          this.lastRutLength = cleanRut.length;
          return;
        }
        this.lastRutLength = cleanRut.length;
        
        // Formatear RUT: XX.XXX.XXX-X
        if (cleanRut.length > 1) {
          let formattedRut = '';
          const body = cleanRut.slice(0, -1);
          const dv = cleanRut.slice(-1);
          
          // Formatear el cuerpo del RUT
          let bodyWithDots = '';
          for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
            if (j > 0 && j % 3 === 0) {
              bodyWithDots = '.' + bodyWithDots;
            }
            bodyWithDots = body[i] + bodyWithDots;
          }
          
          formattedRut = bodyWithDots + '-' + dv;
          
          // Actualizar el valor sin disparar otro evento valueChanges
          this.userForm.get('rut')?.setValue(formattedRut, { emitEvent: false });
        }
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.valid) {
      const newUser: User = this.userForm.value;
      this.userService.addUser(newUser);
      
      alert('¡Usuario registrado correctamente!');
      this.userForm.reset();
      this.submitted = false;
    }
  }
}