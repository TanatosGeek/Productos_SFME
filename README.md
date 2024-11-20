## 1.-Creacion del Login
En base con el anteriro trabajo realizado que fue el de listar desde una API lo acompletaremos con este que sera un login que valide desde la API de usuarios

Abrimos una terminal y crearemos los componentes necesarios 

```bash
ng g c auth/login
```

```bash
ng g c pages/dashboard
```

Inicializaremos el servicio
```bash
ng serve
```

## 2.-Crear el Html del Login/Register

Nos iremos al archivo `src/app/auth/login.html` para generar la vista que vera el usaurio al entrar a nuestra pagina el cuale esta basado en Material.
Lo que se hace basicamente es traer los componetes ya hechos de Material, pero lo que si se debe de tener mucha consideracion en la parte de [(ngModel)] y el name dado que esto nos va permitir conectar con el .ts y darle la funcionalidad.

```html
<div class="center-content">
  <div class="avatar-container">
    <img
      class="avatar mat-elevation-z8"
      src="https://universidadesdemexico.mx/logos/original/logo-instituto-tecnologico-de-oaxaca.webp"
      alt=""
    />
  </div>
  <mat-card class="example-card">
    <mat-card-header>
      <mat-card-title style="align-items: center;">Login/Registro</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <mat-tab-group>
        <!-- Login Tab -->
        <mat-tab label="Login">
          <mat-form-field class="example-full-width">
            <mat-label>Correo</mat-label>
            <input
              type="email"
              matInput
              placeholder="Email"
              [(ngModel)]="email"
              name="email"
              required
            />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Contraseña</mat-label>
            <input
              type="password"
              matInput
              placeholder="Password"
              [(ngModel)]="password"
              name="password"
              required
            />
            <mat-icon matSuffix>vpn_key</mat-icon>
          </mat-form-field>
          <button mat-button color="primary" class="btn-full" (click)="iniciarPagina()">Login</button>
        </mat-tab>

        <!-- Register Tab -->
        <mat-tab label="Registro">
          <mat-form-field class="example-full-width">
            <mat-label>Correo</mat-label>
            <input
              type="email"
              matInput
              placeholder="Email"
              [(ngModel)]="remail"
              name="remail"
              required
            />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Contraseña</mat-label>
            <input
              type="password"
              matInput
              placeholder="Password"
              [(ngModel)]="rpassword"
              name="rpassword"
              required
            />
            <mat-icon matSuffix>vpn_key</mat-icon>
          </mat-form-field>

          <mat-form-field class="example-full-width">
            <mat-label>Confrima tu Contraseña</mat-label>
            <input
              type="password"
              matInput
              placeholder="Confirm Password"
              [(ngModel)]="rconfirmPassword"
              name="rconfirmPassword"
              required
            />
            <mat-icon matSuffix>vpn_key</mat-icon>
          </mat-form-field>
          <button mat-button color="primary" class="btn-full" (click)="iniciarPagina()">Registrarse</button>
        </mat-tab>
      </mat-tab-group>
    </mat-card-content>
  </mat-card>
</div>

```

## 3.-Generar la Funcionalidad del Login/Register

Para darle funcionalidad ingresaremos a `src/app/auth/login.html` en el cual solo importamos lo que ocupamos en el HTML y mandaremos a llamar a `Router` quien nos va a ayudar a movernos entre las diferentes paginas de nuestro proyecto, llamamos a `MatSnackBar` para las alertas si ingreso mal algo el usaurio y tambien a nuestro servicio que creamos en el proyecto pasado dado que los necesitamos apra generar nuestro contructor.

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../services/user.service';  // Importar el servicio
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  remail: string = '';
  rpassword: string = '';
  rconfirmPassword: string = '';

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) {}

  iniciarPagina() {
    // Validación de los campos de correo y contraseña
    if (this.email && this.password) {
      // Llamada al servicio para obtener los usuarios
      this.userService.getUsers().subscribe(
        (users) => {
          // Buscar el usuario que coincida con el correo y la contraseña
          const user = users.find(u => u.email === this.email && u.password === this.password);
          
          if (user) {
            // Si el usuario es válido, navegar al dashboard
            this.router.navigate(['/dashboard']);
          } else {
            // Si no se encuentra un usuario que coincida, mostrar mensaje de error
            this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
          }
        },
        (error) => {
          // Manejo de error en caso de que falle la llamada a la API
          console.error('Error al obtener los usuarios', error);
          this.snackBar.open('Error al obtener los usuarios', 'Cerrar', { duration: 3000 });
        }
      );
    } else {
      // Si no se completan los campos
      this.snackBar.open('Por favor complete los campos', 'Cerrar', { duration: 3000 });
    }
  }
}

```
## 4.-Darlo un diseño agradable a nuestro Login/Register
Ingresaremos a `src/app/auth/login.css` y le daremos a cada componete su diseño agradable y bonito como nostros queramos

```css
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(45deg, #6a1b9a, #8e24aa, #d81b60);
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.example-card {
  width: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #6a1b9a;
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.custom-tab-group {
  width: 100%;
}

.example-full-width {
  width: 100%;
  margin-bottom: 15px;
}

.btn-full {
  width: 100%;
  margin-top: 15px;
  font-weight: bold;
}

mat-card-header {
  background-color: #f3e5f5;
  padding: 16px;
  border-bottom: 1px solid #e1bee7;
}

mat-tab-group {
  background-color: #f5f5f5;
  border-radius: 8px;
}
```

## 5.- Generacion de un Dashboard
Esta parte es a tu gusto en mi caso ocupe Material para desarrollarlo dado que es lo que estamos ocupando.


```html
<mat-toolbar>
  <button mat-icon-button (click)="sidenav.toggle()">
    <mat-icon *ngIf="!sidenav.opened"> menu </mat-icon>
    <mat-icon *ngIf="sidenav.opened"> close </mat-icon>
  </button>
  <span>Programación WE</span>
  <div style="margin-left: 50px;" class="menuss">
  <button mat-button [matMenuTriggerFor]="menu">Menu</button>
  <mat-menu #menu="matMenu">
    <button mat-menu-item>Item 1</button>
    <button mat-menu-item>Item 2</button>
  </mat-menu>
</div>
<div style="margin-left: 50px;" class="menuss">
    <button mat-button [matMenuTriggerFor]="menu">Menu</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>
  </div>
  <div style="margin-left: 50px;" class="menuss">
    <button mat-button [matMenuTriggerFor]="menu">Menu</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>
  </div>
  <div style="margin-left: 50px;" class="menuss">
    <button mat-button [matMenuTriggerFor]="menu">Menu</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>
  </div>
</mat-toolbar>

<mat-sidenav-container class="example-container">
  <mat-sidenav #sidenav="matSidenav" mode="side">
    <div class="avatar-container">
      <img
        class="avatar mat-elevation-z8"
        src="https://universidadesdemexico.mx/logos/original/logo-instituto-tecnologico-de-oaxaca.webp"
        alt=""
      />
    </div>
    <p class="name">Elaborado por:</p>
    <p class="name">Manuel Eduardo Santiago Feria</p>

    <mat-divider></mat-divider>
    <br />

    <button mat-button class="componentes" [matMenuTriggerFor]="menu">
      Componentes Disponibles
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item>Item 1</button>
      <button mat-menu-item>Item 2</button>
    </mat-menu>
  </mat-sidenav>

  <mat-sidenav-content>
    <h1>Bienvenidos</h1>
  </mat-sidenav-content>
</mat-sidenav-container>

```
```css
.example-spacer {
    flex: 1 1 auto;
}

mat-toolbar {
    background-color: #FFA500 !important;
    color: white;
}

.example-container {
    width: auto;
    height: 900px;
    margin: 10px;
    background: #eee;
}

.componentes {
    background-color: white;
    color: black;
    border: 1px solid #ddd;
}

mat-sidenav {
    width: 210px;
    background-color: #FFA500;
    color: black;
    border-radius: 10px;
    text-align: center;
}

.name {
    margin-top: 2px;
    font-family: Arial, Helvetica, sans-serif;
}

.designation {
    margin-top: 2px;
}

.avatar {
    width: 100px;
    height: auto;
    border-radius: 40%;
}

.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15vh;
}
mat-divider {
    border-color:white; 
    opacity: 1; 
}

.menuss{
    color: #ddd;
}
```


## 6.-Configuracion de rutas

Ingresaremos a `app.routes.ts` y defineremos que componete abriremos y que aparecera en el URL, en esta parte identificaremos una ruta por defecto cada vez que abramos nuestra pagina web.

```typescript
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {path:'',redirectTo:'/login', pathMatch:'full'},
    {path:'login',component:LoginComponent},
    {path:'dashboard',component:DashboardComponent}
];
```







Pagina para hacer mas facil el Redme.md:

https://pandao.github.io/editor.md/en.html



# ProyectoEnAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
