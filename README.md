## 1.-Creacion de los Dialog
En este caso ulilizaremos Material para hacer mas facil este proceso, en este punto necesitaremos crear 3 .html para cada ventana modal, con su respectivo .css
`product-delete.html`
`product-delete.css`
`product-details.html`
`product-details.css`
`product-mod.html`
`product-mod.css`

## 2.-Solicitudes a la API
En este caso iremso a documento `user.service.ts` para agregar la funcionalidad que sera necesaria para hacer las peticiones a la API

```typescript
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
```

## 3.-Creacion de la vista de cada Venta Modal
Como estamos modificando a la tabla no a la API entonces todos los cambios los haremos hacia el localstorage, y el estilo lo puedes hacer a tu gusto.

Nos iremos al archivo `product-delete.html` 

```html
<h3 mat-dialog-title class="dialog-title">Confirmación</h3>
<mat-dialog-content class="dialog-content">
  ¿Está seguro de que desea eliminar este producto?
</mat-dialog-content>
<mat-dialog-actions align="end" class="dialog-actions">
  <button mat-button (click)="onNoClick()" class="no-button">No</button>
  <button mat-button color="warn" (click)="onConfirm()" class="yes-button">Sí</button>
</mat-dialog-actions>
```

Nos iremos al archivo `product-details.html` 

```html
<mat-dialog-content class="dialog-content">
  <p class="product-detail">
    <strong>Price:</strong> <span class="price">MXN ${{ data.product?.price }}.00</span>
  </p>
  <p class="product-detail">
    <strong>Description:</strong> {{ data.product?.description }}
  </p>
  <p class="product-detail">
    <strong>Category:</strong> {{ data.product?.category?.name }}
  </p>
</mat-dialog-content>

<mat-dialog-actions align="end" class="dialog-actions">
  <button mat-button (click)="onClose()" class="close-button">Close</button>
</mat-dialog-actions>
```

Nos iremos al archivo `product-mod.html` 

```html
<h2 class="dialog-title">Editar Producto</h2>
<div mat-dialog-content class="dialog-content">
  <mat-form-field appearance="fill" class="form-field">
    <mat-label>Título</mat-label>
    <input matInput [(ngModel)]="data.title" placeholder="Ej. Producto A" />
  </mat-form-field>
  <mat-form-field appearance="fill" class="form-field">
    <mat-label>Precio</mat-label>
    <input matInput type="number" [(ngModel)]="data.price" placeholder="Ej. 199.99" />
  </mat-form-field>
  <mat-form-field appearance="fill" class="form-field">
    <mat-label>Detalles</mat-label>
    <input matInput [(ngModel)]="data.description" placeholder="This is a new product" />
  </mat-form-field>
  <mat-form-field appearance="fill" class="form-field">
    <mat-label>Categoria</mat-label>
    <input matInput [(ngModel)]="data.category.name" placeholder="This is a new product" />
  </mat-form-field>
</div>
<div mat-dialog-actions align="center" class="dialog-actions">
  <button mat-button (click)="cancel()" class="cancel-button">Cancelar</button>
  <button mat-button (click)="save()" color="primary" class="save-button">Guardar</button>
</div>
```

## 4.-Generar la Funcionalidad de los Dialog y la Tabla

Para darle funcionalidad ingresaremos a `product-list.component.ts` en el cual crearemos un componente por cada Dialog 

```typescript
import { Component, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatPaginator,
    MatSort,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  displayedColumns: string[] = ['id', 'title', 'price', 'image', 'edit', 'details', 'delete'];
  dataSource = new MatTableDataSource<any>([]);
  private currentId: number = 0; // Variable para manejar el ID auto-incrementable

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) {}
  // Solicitamos el contenido de la API de Productos y los guardamos con uso de una funcion flecha
  ngOnInit(): void {
    this.userService.getProducts().subscribe((data: any[]) => {
      this.dataSource.data = this.assignIds(data);
    });
  }

  // Inicializamos nuestro paginador
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Método para asignar IDs auto-incrementables a los productos
  private assignIds(products: any[]): any[] {
    return products.map((product) => ({ ...product, id: ++this.currentId }));
  }

  applyApiFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      // Realiza la búsqueda por título
      this.userService.getProductsByTitle(filterValue).subscribe((filteredProducts: any[]) => {
        this.currentId = 0; // Reinicia el contador de IDs para evitar duplicados
        this.dataSource.data = this.assignIds(filteredProducts); // Reasigna IDs únicos
      });
    } else {
      // Si no hay filtro, carga todos los productos
      this.userService.getProducts().subscribe((data: any[]) => {
        this.currentId = 0; // Reinicia el contador de IDs
        this.dataSource.data = this.assignIds(data);
      });
    }
  }

  // Metodo para abrir una pantalla extra cuando presione el bote de basura
  openDeleteDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductDeleteDialog, {
      width: '300px',
      data: { product },
    });

    //Cuando se cierre va a ejecutar el metodo para eliminar el producto de la tabla 
    //con el id selecionado
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex((p) => p.id === product.id);
        if (index >= 0) {
          this.dataSource.data.splice(index, 1);
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }

  openDetailsDialog(product: any): void {
    if (!product || !product.images || !Array.isArray(product.images)) {
      console.error('Product data is invalid:', product);
      return;
    }

    this.dialog.open(ProductDetailsDialog, {
      width: '500px',
      data: { product },
    });
  }

  openEditDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductEditDialog, {
      width: '400px',
      data: { ...product },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const index = this.dataSource.data.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource.data = [...this.dataSource.data];
        }
      }
    });
  }
}

@Component({
  selector: 'app-product-delete-dialog',
  standalone: true,
  templateUrl: './product-delete.html',
  styleUrls: ['./product-delete.css'],
  imports: [MatDialogActions, 
    MatDialogContent, 
    MatButtonModule],
})
export class ProductDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-product-details-dialog',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [MatDialogActions, 
    MatDialogContent, 
    MatButtonModule],
})
export class ProductDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  templateUrl: './product-mod.html',
  styleUrls: ['./product-mod.css'],
  imports: [MatDialogActions, 
    MatDialogContent, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule],
})
export class ProductEditDialog {
  constructor(
    public dialogRef: MatDialogRef<ProductEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save(): void {
    this.dialogRef.close(this.data);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}


```
## 5.-Creacion de la vista de Tabla
Ingresaremos a `product-list.component.html` y le daremos como se presentaran los datos al usuario

```html
<div class="container">
  <mat-card class="product-card">
    <mat-toolbar color="primary">
      <span class="toolbar-title">Lista de Productos</span>
    </mat-toolbar>

    <div class="filter-container">
      <mat-form-field appearance="fill" class="filter-field">
        <mat-label>Buscar productos</mat-label>
        <input matInput (input)="applyApiFilter($event)" placeholder="Ingrese el título" />
      </mat-form-field>
    </div>

    <table mat-table [dataSource]="dataSource" matSort class="product-table">
      <!-- Columna de ID -->
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Número</th>
        <td mat-cell *matCellDef="let product">{{ product.id }}</td>
      </ng-container>

      <!-- Columna de Título -->
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Titulo</th>
        <td mat-cell *matCellDef="let product">{{ product.title }}</td>
      </ng-container>

      <!-- Columna de Precio -->
      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
        <td mat-cell *matCellDef="let product">MXN ${{ product.price }}.00</td>
      </ng-container>

      <!-- Columna de Imagen -->
      <ng-container matColumnDef="image">
        <th mat-header-cell *matHeaderCellDef>Imagen</th>
        <td mat-cell *matCellDef="let product">
          <img [src]="product.images[0]" alt="{{ product.title }}" class="product-image" />
        </td>
      </ng-container>

      <!-- Columna de Editar -->
      <ng-container matColumnDef="edit">
        <th mat-header-cell *matHeaderCellDef>Editar</th>
        <td mat-cell *matCellDef="let product">
          <button mat-icon-button class="edit-icon" (click)="openEditDialog(product)">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>

      <!-- Columna de Detalles -->
      <ng-container matColumnDef="details">
        <th mat-header-cell *matHeaderCellDef>Detalles</th>
        <td mat-cell *matCellDef="let product">
          <button mat-icon-button class="details-icon" (click)="openDetailsDialog(product)">
            <mat-icon>visibility</mat-icon>
          </button>
        </td>
      </ng-container>

      <!-- Columna de Eliminar -->
      <ng-container matColumnDef="delete">
        <th mat-header-cell *matHeaderCellDef>Eliminar</th>
        <td mat-cell *matCellDef="let product">
          <button mat-icon-button class="delete-icon" (click)="openDeleteDialog(product)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 25]" aria-label="Select page"></mat-paginator>
  </mat-card>
</div>

```

## 6.-Insercion del usuario en el Dashboard
Entraremos al dashboard que se encuentra en `dashboard.component.html`
```html
<mat-toolbar>
  <button mat-icon-button (click)="sidenav.toggle()">
    <mat-icon *ngIf="!sidenav.opened">menu</mat-icon>
    <mat-icon *ngIf="sidenav.opened">close</mat-icon>
  </button>
  <span>Programación WE</span>

  <div *ngIf="user" class="user-container">
    <img
      class="avatar-usuario"
      [src]="user?.avatar || 'https://default-avatar-url.com/default-avatar.png'"
      alt="Avatar"
    />
  </div>
  
  <div *ngIf="user" class="user-container">
    <span>{{ user?.name || 'Invitado' }}</span>
  </div>

</mat-toolbar>
```

Entraremos al archivo `dashboard.component.ts` para poder guardar el ultimo usuario y no se perdieran los datos de este
```typescript
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ProductListComponent } from "../../components/product-list/product-list.component";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatMenuModule,
    ProductListComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('Usuario actual:', this.user);
    });
  }

  logout() {
    this.userService.clearCurrentUser();
  }
}
```

## Resultados
### Ontencion de los datos del usaurio para el Dashboard
![image](https://github.com/user-attachments/assets/48506624-2355-4574-9a56-d90e080121d5)
### Creación de la Tabla
![image](https://github.com/user-attachments/assets/c75ef837-770c-4fbe-997a-9f81c76b2f9c)
### Filtro directo a la API 
![image](https://github.com/user-attachments/assets/d9ca09e0-7d21-48e3-874b-d8da34c8ac49)
### Vista de Editar
![image](https://github.com/user-attachments/assets/1e712163-02db-479c-b2ac-fdde91b78124)
### Vista de Detalles
![image](https://github.com/user-attachments/assets/a4787518-f7f7-4eb0-aff8-52e7560f0272)
### Vista de eliminar
![image](https://github.com/user-attachments/assets/17510e27-d176-47ce-862a-3a89a8e455af)









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
