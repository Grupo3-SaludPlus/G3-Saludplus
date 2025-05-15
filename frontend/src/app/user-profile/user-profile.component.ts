import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../services/user.service';
import { UserFormComponent } from './user-form/user-form.component'; // Camino correcto relativo a user-profile

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: true,
  imports: [CommonModule, UserFormComponent]
})
export class UserProfileComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
    
    // Cargar usuarios desde localStorage si existen
    this.userService.loadFromLocalStorage();
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.userService.deleteUser(id);
      // Guardar cambios en localStorage
      this.userService.saveToLocalStorage();
    }
  }
}