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
  displayedColumns: string[] = ['title', 'price', 'image', 'edit', 'details', 'delete'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.getProducts().subscribe((data: any[]) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyApiFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    if (filterValue) {
      this.userService
        .getProductsByTitle(filterValue)
        .subscribe((filteredProducts: any[]) => {
          this.dataSource.data = filteredProducts;
        });
    } else {
      // Si no hay filtro, recargar todos los productos
      this.userService.getProducts().subscribe((data: any[]) => {
        this.dataSource.data = data;
      });
    }
  }

  openDeleteDialog(product: any): void {
    const dialogRef = this.dialog.open(ProductDeleteDialog, {
      width: '300px',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Eliminar solo de la tabla, no de la API
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
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
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
  imports: [MatDialogActions, MatDialogContent, MatButtonModule],
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
  imports: [MatDialogActions, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
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
