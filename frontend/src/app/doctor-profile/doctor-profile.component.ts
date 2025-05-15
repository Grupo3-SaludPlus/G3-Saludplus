import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DoctorProfileComponent implements OnInit {
  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  deleteDoctor(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este perfil de doctor?')) {
      this.doctorService.deleteDoctor(id);
    }
  }
}