import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para representar la estructura de datos de un doctor
export interface Doctor {
  id?: number;
  name: string;
  rut: string;
  gender: string;
  specialization: string;
  university: string;
  experience: number;
  contact: string;
  bio: string;
  photoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctors: Doctor[] = [];
  private nextId = 1;
  private doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  
  constructor() {
    // Añadir un doctor de ejemplo inicial
    this.addDoctor({
          name: 'Dr. Juan Pérez',
          rut: '12.345.678-9',
          gender: 'Masculino',
          specialization: 'Cardiología',
          university: 'Universidad de Chile',
          experience: 12,
          contact: '+56 9 8765 4321',
          bio: 'Especialista en tratamientos cardiovasculares con más de 10 años de experiencia. Egresado de la Universidad de Chile con múltiples publicaciones en revistas médicas internacionales.',
          photoUrl: 'assets/images/doctor-placeholder.jpg'
        });
  }
  
  getDoctors(): Observable<Doctor[]> {
    return this.doctorsSubject.asObservable();
  }
  
  getDoctorById(id: number): Doctor | undefined {
    return this.doctors.find(doctor => doctor.id === id);
  }
  
  addDoctor(doctor: Doctor): void {
    const newDoctor = {
      ...doctor,
      id: this.nextId++,
      photoUrl: doctor.photoUrl || 'assets/images/doctor-placeholder.jpg'
    };
    
    this.doctors.push(newDoctor);
    this.doctorsSubject.next([...this.doctors]);
    console.log('Doctor added:', newDoctor);
  }
  
  updateDoctor(doctor: Doctor): void {
    const index = this.doctors.findIndex(d => d.id === doctor.id);
    if (index !== -1) {
      this.doctors[index] = doctor;
      this.doctorsSubject.next([...this.doctors]);
      console.log('Doctor updated:', doctor);
    } else {
      console.error('Doctor not found for update:', doctor);
    }
  }
  
  deleteDoctor(id: number): void {
    this.doctors = this.doctors.filter(doctor => doctor.id !== id);
    this.doctorsSubject.next([...this.doctors]);
    console.log('Doctor deleted, id:', id);
  }
  
  // Método para guardar localmente
  saveToLocalStorage(): void {
    localStorage.setItem('doctors', JSON.stringify(this.doctors));
  }
  
  // Método para cargar desde almacenamiento local
  loadFromLocalStorage(): void {
    const storedDoctors = localStorage.getItem('doctors');
    if (storedDoctors) {
      this.doctors = JSON.parse(storedDoctors);
      // Establecer el siguiente ID basado en el máximo ID existente
      this.nextId = Math.max(...this.doctors.map(d => d.id || 0)) + 1;
      this.doctorsSubject.next([...this.doctors]);
    }
  }
}