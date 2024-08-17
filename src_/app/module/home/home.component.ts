import { Component, NgModule, OnInit ,AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import $ from "jquery";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../shared/cart.service';
import { NgIf, NgFor } from '@angular/common';
import { error } from 'console';
import { UserService } from '../../shared/user.service';
import { ProductService } from '../../shared/product.service';
import { TranslatePipe } from '../../shared/translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { json } from 'body-parser';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SharedModule } from '../../shared/shared.module';
import { PageEvent } from '@angular/material/paginator';
import { SpinnerService } from '../../shared/spin.service';
//declare var $: any;
//declare var document: any;
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers:[SpinnerService],
  imports: [
    FormsModule,
    NgFor,
    NgIf,
    SharedModule,
    TranslateModule,
    TranslatePipe,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
})
export class HomeComponent implements OnInit,AfterViewInit {
  totalProducts = 100;
  productsPerPage = 1000;
  currentPage = 1;
  filterValues: any = '';
  pageSizeOptions = [1, 2, 5, 10, 50, 100, 200, 500, 1000];
  items: any[] = [];
  values: any[] = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ];
  selectedValue: any;
  products: any[] = [];
  searchItems: any = '';
  isLoad: boolean = false;

  // ["electronics","jewelery","men's clothing","women's clothing"]
  // items: any[] = [];
  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient,
    private productService: ProductService
  ) {}
  ngAfterViewInit():void{
 
  }
  ngOnInit(): void {
   /*  var doc: any = $(document);
    console.log($(document))
    doc.ready(() => {
      $('.mat-mdc-paginator-page-size-label')[0].innerText =
        'S-cart Products per page';
    }); */
    this.loadProducts();
    /*     this.http.get<any[]>('https://fakestoreapi.com/products').subscribe(
      (items) => {
        this.items = items;
        this.products = items;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    ); */
    /*     setTimeout(() => {
      this.productService.getallProductsList( this.currentPage,this.productsPerPage,this.filterValues).subscribe((response) => {
        if (response && Array.isArray(response.data)) {
          this.items = response.data;
          this.products = response.data;
          this.totalProducts = response.totalElements;
          this.isLoad =false;
        }
      });
    }, 100); */
  }
  loadProducts() {
    this.productService
      .getallProductsList(
        this.currentPage,
        this.productsPerPage,
        this.filterValues
      )
      .subscribe((response) => {
        if (response && Array.isArray(response.data)) {
          this.items = response.data;
          // this.products = response.data;
          this.totalProducts = response.totalElements;
          this.isLoad = false;
        }
      });
  }
  goToPage(pageData: PageEvent) {
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.loadProducts();
  }
  filterItems() {
    this.currentPage = 1;
    this.filterValues = this.searchItems.toLocaleLowerCase();
    this.loadProducts();
    this.items = this.items.filter((item) =>
      item.title
        .toLocaleLowerCase()
        .toString()
        .includes(this.searchItems.toLocaleLowerCase())
    );
  }
  /*   async fetchData() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
   
      return this.items =data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  } */
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  addToCart(item: any) {
    this.cartService.addToCart(item);
  }
  alert() {
    alert('Search filter');
  }
  filter(value: any) {
    let values = [
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ];
    this.currentPage = 1;
    this.filterValues = value;
    this.loadProducts();
    /*    if (!values.includes(value)) {
      this.items = this.items;
    } else {
      this.items = this.items.filter((item) => item.category == value);
    } */
    /*    this.userService.filterData(value).subscribe((items)=>{
    this.items = items;

    }) */
  }
}
