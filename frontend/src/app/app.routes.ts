import { Routes } from '@angular/router';
import { DoctorProfileComponent } from './doctor-profile/doctor-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ahora la ruta raíz muestra el HomeComponent
  { path: 'doctors', component: DoctorProfileComponent },
  { path: 'users', component: UserProfileComponent },
  { path: '**', redirectTo: '' } // Redirige cualquier ruta desconocida a la página de inicio
];
