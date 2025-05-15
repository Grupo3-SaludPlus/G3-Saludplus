import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  rut: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private nextId = 1;
  private usersSubject = new BehaviorSubject<User[]>([]);
  
  constructor() {
    // Añadir algunos usuarios de ejemplo
    this.addUser({
      name: 'María González',
      rut: '11.222.333-4'
    });
    
    this.addUser({
      name: 'Carlos Rodríguez',
      rut: '9.876.543-2'
    });
  }
  
  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }
  
  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  addUser(user: User): void {
    const newUser = {
      ...user,
      id: this.nextId++
    };
    
    this.users.push(newUser);
    this.usersSubject.next([...this.users]);
  }
  
  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.usersSubject.next([...this.users]);
  }
  
  // Método para guardar localmente
  saveToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }
  
  // Método para cargar desde almacenamiento local
  loadFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.nextId = Math.max(...this.users.map(u => u.id || 0)) + 1;
      this.usersSubject.next([...this.users]);
    }
  }
}