import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from '../../../Models/product';
import { AdminProductService } from '../../../Services/admin-product.service';
import { IAdminManageProductParams } from '../../../Models/AdminManageProductParams';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IEditProduct } from '../../../Models/editproduct';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit{

  productList: IProduct[];

  pageNumber: number = 1;
  itemsToShow: number = 20;
  sortBy: string = "sortProductIdAscending";
  totalNumberOfPages: number = 15;

  enableNextPageClick: boolean = true;
  prevSorter: string;

  selectedProduct: IProduct;
  formModel: string;
  formBrand: string;
  formDeviceOS: string;
  formColor: string;
  formDescription: string;
  formImageURL: string;
  formPrice: number;
  formDiscount: number;
  formAvailableStocks: number;
  formItemsSold: number;
  formReleaseDate: number;
  formRating: number;
  formSeller: string;
  formPrevOwner: string;



  sorterMaps: Map<string, number> = new Map<string, number>([
    ["sortProductId", -1],
    ["sortModel", 0],
    ["sortBrand", 0],
    ["sortColor", 0],
    ["sortPrice", 0],
    ["sortDiscount", 0],
    ["sortDiscountedPrice", 0],
    ["sortAvailableStocks", 0],
    ["sortItemsSold", 0],
  ]);

  pageNumberList: number[] = [...Array(this.totalNumberOfPages).keys()];

  allProductsCount: number;
  maxPossiblePageNumber: number;

  constructor(private adminProductService: AdminProductService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getProducts();
    this.adminProductService.getAllProductsCount().subscribe(data => {
      this.allProductsCount = data;
      this.maxPossiblePageNumber = Math.ceil(this.allProductsCount / this.itemsToShow);
    })
  }

  onPageNumberClick(pageNum: number) {
    this.pageNumber = pageNum;
    this.getProducts();
  }

  onNextPaginationClick() {
    let lastPageNumberShown = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumber = lastPageNumberShown + 1;
    this.resetPageNumbersBasedOnCurrentPage();
    this.enableDisableNextPageClick();
    this.getProducts();
  }

  enableDisableNextPageClick() {
    let newLastPageNumber = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.enableNextPageClick = true

    if (newLastPageNumber >= this.maxPossiblePageNumber) {
      this.enableNextPageClick = false;
    }
  }

  onPrevPaginationClick() {
    let lastPageNumberShown = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumber = lastPageNumberShown - this.totalNumberOfPages * 2 + 1;
    this.resetPageNumbersBasedOnCurrentPage();
    this.enableDisableNextPageClick();
    this.getProducts();
  }

  resetPageNumbersBasedOnCurrentPage() {
    let z: number = Math.ceil(this.pageNumber / this.totalNumberOfPages) * this.totalNumberOfPages;
    this.pageNumberList = this.range(z - this.totalNumberOfPages, z, 1);
  }

  getProducts() {
    let productParams: IAdminManageProductParams = {
      PageNumber: this.pageNumber,
      ItemsToShow: this.itemsToShow,
      SortBy: this.sortBy,
    }

    this.adminProductService.getAllProducts(productParams).subscribe(data => {
      this.productList = data;  
    });
  }

  onSorterClick(sorter: string) {
    this.changeSorting(sorter);
    this.resetOtherSorters(sorter);

    this.pageNumber = 1;
    this.resetPageNumbersBasedOnCurrentPage();

    let sorterKeyWord = sorter + "Ascending";

    if (this.sorterMaps.get(sorter) == 1) {
      sorterKeyWord = sorter + "Descending";
    }

    this.sortBy = sorterKeyWord;
    this.getProducts();
  }

  changeSorting(sorter: string) {
    if (this.sorterMaps.get(sorter) == 0) {
      this.sorterMaps.set(sorter, -1);
      return;
    }

    if (this.sorterMaps.get(sorter) == 1) {
      this.sorterMaps.set(sorter, -1);
      return;
    }

    this.sorterMaps.set(sorter, 1);
  }

  resetOtherSorters(clickedSorter: string) {
    this.sorterMaps.forEach((value: number, key: string) => {
      if (key != clickedSorter) {
        this.sorterMaps.set(key, 0);
      }
    })
  }

  range(start: number, end: number, step: number): number[] {
    let arrayNumbers: number[] = [];

    let i = start;
    while (i < end) {
      arrayNumbers.push(i);
      i += step;
    }
    return arrayNumbers;
  }

  onProductClick(product: IProduct, content: TemplateRef<any>) {
    this.selectedProduct = product;
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.populateSelectedProductForm();
  }

  populateSelectedProductForm(){
    this.formBrand = this.selectedProduct.brand;
    this.formModel = this.selectedProduct.model;
    this.formDeviceOS = this.selectedProduct.deviceOS;
    this.formColor = this.selectedProduct.color;
    this.formDescription = this.selectedProduct.description;
    this.formImageURL = this.selectedProduct.image;
    this.formPrice = this.selectedProduct.price;
    this.formDiscount = this.selectedProduct.discount;
    this.formAvailableStocks = this.selectedProduct.availableStocks;
    this.formItemsSold = this.selectedProduct.soldItems;
    this.formReleaseDate = this.selectedProduct.releaseDate;
    this.formRating = this.selectedProduct.rating;
    this.formSeller = this.selectedProduct.seller;
    this.formPrevOwner = this.selectedProduct.previousOwner;
  }

  disableUpdateBtn(): boolean {
    if (
      this.formBrand != this.selectedProduct.brand ||
      this.formModel != this.selectedProduct.model ||
      this.formDeviceOS != this.selectedProduct.deviceOS ||
      this.formColor != this.selectedProduct.color ||
      this.formDescription != this.selectedProduct.description ||
      this.formImageURL != this.selectedProduct.image ||
      this.formPrice != this.selectedProduct.price ||
      this.formDiscount != this.selectedProduct.discount ||
      this.formAvailableStocks != this.selectedProduct.availableStocks ||
      this.formItemsSold != this.selectedProduct.soldItems ||
      this.formReleaseDate != this.selectedProduct.releaseDate ||
      this.formRating != this.selectedProduct.rating ||
      this.formSeller != this.selectedProduct.seller ||
      this.formPrevOwner != this.selectedProduct.previousOwner) {
        return false;
    }
    return true;
  }

  onUpdateProductClick() {
    let productToEdit = <IEditProduct>{};
    productToEdit.id = this.selectedProduct.id;
    productToEdit.brand = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;

    productToEdit.model = (this.formModel != this.selectedProduct.model) ? this.formModel : null;
    productToEdit.deviceOS = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
    productToEdit.color = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
    productToEdit.description = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
    productToEdit.image = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
    productToEdit.price = (this.formPrice != this.selectedProduct.price) ? this.formPrice : null;
    productToEdit.discount = (this.formDiscount != this.selectedProduct.discount) ? this.formDiscount : null;
    productToEdit.availableStocks = (this.formAvailableStocks != this.selectedProduct.availableStocks) ? this.formAvailableStocks : null;
    productToEdit.soldItems = (this.formItemsSold != this.selectedProduct.soldItems) ? this.formItemsSold : null;
    productToEdit.releaseDate = (this.formReleaseDate != this.selectedProduct.releaseDate) ? this.formReleaseDate : null;
    productToEdit.rating = (this.formRating != this.selectedProduct.rating) ? this.formRating : null;
    productToEdit.seller = (this.formSeller != this.selectedProduct.seller) ? this.formSeller : null;
    productToEdit.previousOwnerFirstName = (this.formPrevOwner != this.selectedProduct.previousOwner) ? this.formPrevOwner : null;
    productToEdit.previousOwnerLastName = null;

    this.adminProductService.editProduct(productToEdit).subscribe(data => console.log(data));
  }
}
