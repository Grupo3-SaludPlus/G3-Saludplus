import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../../services/doctor.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class DoctorFormComponent implements OnInit {
  doctorForm!: FormGroup;
  submitted = false;
  @Output() doctorAdded = new EventEmitter<Doctor>();
  
  // Para la vista previa
  previewPhotoUrl = 'assets/images/doctor-placeholder.jpg';
  customGender = false;
  genderOptions = ['Masculino', 'Femenino', 'No especificar', 'Otro'];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Suscribirse a cambios en el campo photoUrl para actualizar la vista previa
    this.doctorForm.get('photoUrl')?.valueChanges.subscribe(url => {
      this.previewPhotoUrl = url || 'assets/images/doctor-placeholder.jpg';
    });

    // Escuchar cambios en RUT para formatear automáticamente
    this.doctorForm.get('rut')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar puntos y guiones existentes
        const cleanRut = value.replace(/\./g, '').replace(/-/g, '');
        // No hacer nada más si el usuario está borrando caracteres
        if (cleanRut.length <= (this.lastRutLength || 0)) {
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
          this.doctorForm.get('rut')?.setValue(formattedRut, { emitEvent: false });
        }
      }
    });

    // Escuchar cambios en contacto para formatear solo los dígitos que el usuario ingresa
    this.doctorForm.get('contactDigits')?.valueChanges.subscribe(value => {
      if (value) {
        // Eliminar caracteres no numéricos
        const cleanDigits = value.replace(/\D/g, '');
        
        // Formatear número: XXXX XXXX
        let formatted = cleanDigits;
        if (cleanDigits.length > 4) {
          formatted = cleanDigits.substring(0, 4) + ' ' + cleanDigits.substring(4, Math.min(8, cleanDigits.length));
        }
        
        // Actualizar el valor sin disparar otro evento valueChanges
        this.doctorForm.get('contactDigits')?.setValue(formatted, { emitEvent: false });
        
        // Actualizar el campo de contacto completo
        const fullContact = '+56 9 ' + formatted;
        this.doctorForm.get('contact')?.setValue(fullContact, { emitEvent: false });
      } else {
        this.doctorForm.get('contact')?.setValue('+56 9', { emitEvent: false });
      }
    });

    // Escuchar cambios en la selección de género
    this.doctorForm.get('gender')?.valueChanges.subscribe(value => {
      this.customGender = value === 'Otro';
      
      if (this.customGender) {
        this.doctorForm.addControl('customGender', new FormControl('', Validators.required));
      } else if (this.doctorForm.contains('customGender')) {
        this.doctorForm.removeControl('customGender');
      }
    });
  }

  private lastRutLength = 0;

  initForm(): void {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      rut: ['', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)]],
      gender: ['Masculino', Validators.required],
      specialization: ['', Validators.required],
      university: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0), Validators.max(60)]],
      contactDigits: ['', [Validators.required, Validators.pattern(/^\d{4}\s?\d{0,4}$/)]],
      contact: ['+56 9', [Validators.required, Validators.pattern(/^\+56\s9\s\d{4}\s\d{4}$/)]],
      bio: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
      photoUrl: ['assets/images/doctor-placeholder.jpg']
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.doctorForm.valid) {
      const formData = {...this.doctorForm.value};
      
      // Si el género es "Otro", usar el valor personalizado
      if (formData.gender === 'Otro' && formData.customGender) {
        formData.gender = formData.customGender;
        delete formData.customGender;
      }
      
      // Eliminar el campo auxiliar contactDigits
      delete formData.contactDigits;
      
      const newDoctor: Doctor = formData;
      this.doctorService.addDoctor(newDoctor);
      this.doctorAdded.emit(newDoctor);
      
      alert('¡Perfil de doctor creado correctamente!');
      this.doctorForm.reset({
        gender: 'Masculino',
        contact: '+56 9',
        photoUrl: 'assets/images/doctor-placeholder.jpg'
      });
      this.previewPhotoUrl = 'assets/images/doctor-placeholder.jpg';
      this.submitted = false;
    } else {
      console.log('Formulario inválido:', this.doctorForm);
    }
  }
}