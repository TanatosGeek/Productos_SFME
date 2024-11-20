import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';  // URL de la API de usuarios
  private apiProducts = 'https://api.escuelajs.co/api/v1/products';  // URL de la API de productos
  
  private currentUserSubject = new BehaviorSubject<any>(null);  // Observable para el usuario actual
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener usuarios desde la API
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener productos desde la API
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiProducts);
  }

  // Establecer el usuario actual
  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}
