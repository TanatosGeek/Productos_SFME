import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users'; // URL de la API de usuarios
  private apiProducts = 'https://api.escuelajs.co/api/v1/products'; // URL de la API de productos

  private currentUserSubject: BehaviorSubject<any>;
  currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    // Verifica si estamos en un entorno de navegador
    const isBrowser = typeof window !== 'undefined';
    const savedUser = isBrowser ? localStorage.getItem('currentUser') : null;
    
    this.currentUserSubject = new BehaviorSubject<any>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Obtener usuarios desde la API
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener productos desde la API
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiProducts);
  }

  // Establecer el usuario actual y guardarlo en localStorage
  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    // Verifica si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  // Limpiar el usuario actual
  clearCurrentUser() {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  // Obtener el usuario actual
  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  // Obtener productos filtrados por título
  getProductsByTitle(title: string): Observable<any[]> {
  const url = `${this.apiProducts}/?title=${title}`;
  return this.http.get<any[]>(url);
}
}
