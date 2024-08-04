import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { IProduct } from '../../../Models/product';
import { AdminProductService } from '../../../Services/admin-product.service';
import { IAdminManageProductParams } from '../../../Models/AdminManageProductParams';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IEditProduct } from '../../../Models/editproduct';
import { ISeller } from '../../../Models/seller';
import { IPreviousOwner } from '../../../Models/previousowner';
import { IAddNewProduct } from '../../../Models/addnewproduct';
import { AuthService } from '../../../Services/auth-service.service';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent implements OnInit{

  productList: IProduct[];
  sellerList: ISeller[];
  previousOwnerList: IPreviousOwner[];

  isAddNewSeller: boolean = false;
  isAddNewPrevOwner: boolean = false;

  pageNumber: number = 1;
  itemsToShow: number = 20;
  sortBy: string = "sortProductIdAscending";
  totalNumberOfPages: number = 15;

  @ViewChild('snackbar') snackbar: ElementRef;
  notifMessage: string;


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

  formAddModel: string;
  formAddBrand: string;
  formAddDeviceOS: string;
  formAddColor: string;
  formAddDescription: string;
  formAddImageURL: string;
  formAddPrice: number;
  formAddDiscount: number;
  formAddAvailableStocks: number;
  formAddItemsSold: number;
  formAddReleaseDate: number;
  formAddRating: number;

  formAddNewSeller: string;
  formAddSelectedSeller: ISeller;

  formAddNewPrevOwnerFirstName: string;
  formAddNewPrevOwnerLastName: string;
  formAddSelectedPrevOwner: IPreviousOwner;

  searchString: string = "";

  loadingImage: boolean = true
  onImageLoad() {
    this.loadingImage = false;
  }

  searchRemarks: string;

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

  isEditProduct: boolean = false;

  adminToken: string;
  constructor(private adminProductService: AdminProductService,
    private modalService: NgbModal, private renderer: Renderer2,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.adminToken = this.authService.currentUser?.token!;
    this.getProducts();
    this.adminProductService.getAllProductsCount().subscribe(data => {
      this.allProductsCount = data;
      this.maxPossiblePageNumber = Math.ceil(this.allProductsCount / this.itemsToShow);
    })

    this.adminProductService.getAllSellers().subscribe(data => this.sellerList = data);
    this.adminProductService.getAllPreviousOwners().subscribe(data => this.previousOwnerList = data);
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

    if (newLastPageNumber < this.totalNumberOfPages) {
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
      SearchString: this.searchString ? this.searchString : undefined
    }

    this.adminProductService.getAllProducts(productParams).subscribe(data => {
      this.productList = data;

      this.adminProductService.getCountWithSearchString(this.searchString).subscribe(count => {
        this.allProductsCount = count;
        this.maxPossiblePageNumber = Math.ceil(this.allProductsCount / this.itemsToShow);
      })
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

  populateSelectedProductForm() {
    if (this.selectedProduct) {
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
  }

  disableUpdateBtn(): boolean {
    if (this.selectedProduct) {
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
    }
    return true;

  }

  onUpdateProductClick() {
      this.loadingImage = true;
      let productToEdit = <IEditProduct>{};
      productToEdit.id = this.selectedProduct.id;
      productToEdit.brand = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;

      productToEdit.model = (this.formModel != this.selectedProduct.model) ? this.formModel : null;
      productToEdit.deviceOS = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
      productToEdit.color = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
      productToEdit.description = (this.formBrand != this.selectedProduct.brand) ? this.formBrand : null;
      productToEdit.image = (this.formImageURL != this.selectedProduct.image) ? this.formImageURL : null;
      productToEdit.price = (this.formPrice != this.selectedProduct.price) ? this.formPrice : null;
      productToEdit.discount = (this.formDiscount != this.selectedProduct.discount) ? this.formDiscount : null;
      productToEdit.availableStocks = (this.formAvailableStocks != this.selectedProduct.availableStocks) ? this.formAvailableStocks : null;
      productToEdit.soldItems = (this.formItemsSold != this.selectedProduct.soldItems) ? this.formItemsSold : null;
      productToEdit.releaseDate = (this.formReleaseDate != this.selectedProduct.releaseDate) ? this.formReleaseDate : null;
      productToEdit.rating = (this.formRating != this.selectedProduct.rating) ? this.formRating : null;
      productToEdit.seller = (this.formSeller != this.selectedProduct.seller) ? this.formSeller : null;
      productToEdit.previousOwnerFirstName = (this.formPrevOwner != this.selectedProduct.previousOwner) ? this.formPrevOwner : null;
      productToEdit.previousOwnerLastName = null;

      if (this.adminToken) {
        this.adminProductService.editProduct(productToEdit, this.adminToken).subscribe(resp => {
          if (resp == "Success") {
            this.modalService.dismissAll();
            this.notifMessage = "Successfully edited product."
            this.openSnackBar();
            this.getProducts();
          } else {
            this.modalService.dismissAll();
            this.notifMessage = "Something went wrong. Please try again."
            this.openSnackBar();
          }
        });
      }
    }

  searchProduct() {
    this.searchRemarks = this.searchString;
    this.pageNumber = 1;

    let productParams: IAdminManageProductParams = {
      PageNumber: this.pageNumber,
      ItemsToShow: this.itemsToShow,
      SortBy: this.sortBy,
      SearchString: this.searchString
    }

    this.adminProductService.getAllProducts(productParams).subscribe(data => {
      this.productList = data;
    });

    this.adminProductService.getCountWithSearchString(this.searchString).subscribe(count => {
      this.enableNextPageClick = true;

      this.allProductsCount = count;
      this.maxPossiblePageNumber = Math.ceil(this.allProductsCount / this.itemsToShow);

      if (this.maxPossiblePageNumber <= this.totalNumberOfPages) {
        this.enableNextPageClick = false;
      }
    })
  }

  onSearchTyping(event: any) {
    if (event.key == "Enter") {
      this.searchProduct();
    }
  }

  deleteSearchString() {
    this.searchString = "";
    this.searchRemarks = "";
    this.pageNumber = 1;
    this.getProducts();
  }

  openSnackBar() {
    this.renderer.addClass(this.snackbar.nativeElement, 'show');

    setTimeout(() => {
      this.renderer.removeClass(this.snackbar.nativeElement, 'show');
    }, 3000);
  }

  showNoItemsToShowDiv() {
    if (this.productList) {
      if (this.productList.length == 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  onAddProductBtnClick(content: TemplateRef<any>) {
    this.isEditProduct = false;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onSellerSelect(seller: ISeller) {
    this.formAddSelectedSeller = seller;
  }

  onPrevOwnerSelect(prevOwner: IPreviousOwner) {
    this.formAddSelectedPrevOwner = prevOwner;
  }

  onAddProduct() {
    let seller: string = !this.isAddNewSeller ? this.formAddSelectedSeller.name : this.formAddNewSeller;
    let prevOwnerFirstName: string;
    let prevOwnerLastName: string;

    if (!this.isAddNewPrevOwner) {
      prevOwnerFirstName = this.formAddSelectedPrevOwner.firstName;
      prevOwnerLastName = this.formAddSelectedPrevOwner.lastName;
    } else {
      prevOwnerFirstName = this.formAddNewPrevOwnerFirstName;
      prevOwnerLastName = this.formAddNewPrevOwnerLastName;
    }

    let newProduct: IAddNewProduct = {
      brand: this.formAddBrand,
      model: this.formAddModel,
      deviceOS: this.formAddDeviceOS,
      releaseDate: this.formAddReleaseDate,
      price: this.formAddPrice,
      color: this.formAddColor,
      description: this.formAddDescription,
      image: this.formAddImageURL,
      rating: this.formAddRating,
      discount: this.formAddDiscount,
      availableStocks: this.formAddAvailableStocks,
      soldItems: this.formAddItemsSold,
      seller: seller,
      previousOwnerFirstName: prevOwnerFirstName,
      previousOwnerLastName: prevOwnerLastName,
    }

    if (this.adminToken) {
      this.adminProductService.addNewProduct(newProduct, this.adminToken).subscribe(resp => {
        if (resp != "Failed") {
          this.modalService.dismissAll();
          this.notifMessage = "Successfully added product."
          this.openSnackBar();
          this.getProducts();
        } else {
          this.modalService.dismissAll();
          this.notifMessage = "Something went wrong. Please try again."
          this.openSnackBar();
        }
      });
    }
  }

  disableAddNewProductBtn(): boolean {
    if (this.formAddBrand == "" || this.formAddBrand == undefined) {
      return true;
    }
    if (this.formAddModel == "" || this.formAddModel == undefined) {
      return true;
    }
    if (this.formAddDeviceOS == "" || this.formAddDeviceOS == undefined) {
      return true;
    }
    if (this.formAddReleaseDate == undefined) {
      return true;
    }
    if (this.formAddPrice == undefined) {
      return true;
    }
    if (this.formAddColor == "" || this.formAddColor == undefined) {
      return true;
    }
    if (this.formAddDescription == "" || this.formAddDescription == undefined) {
      return true;
    }
    if (this.formAddImageURL == "" || this.formAddImageURL == undefined) {
      return true;
    }
    if (this.formAddRating == undefined) {
      return true;
    }
    if (this.formAddDiscount == undefined) {
      return true;
    }
    if (this.formAddAvailableStocks == undefined) {
      return true;
    }
    if (this.formAddItemsSold == undefined) {
      return true;
    }

    if (!this.isAddNewSeller) {
      if (this.formAddSelectedSeller == undefined ) {
        return true;
      } 
    } else {
      if (this.formAddNewSeller == undefined || this.formAddNewSeller == "") {
        return true
      }
    }

    if (!this.isAddNewPrevOwner) {
      if (this.formAddSelectedPrevOwner == undefined) {
        return true;
      }
    } else {
      if ((this.formAddNewPrevOwnerFirstName == undefined || this.formAddNewPrevOwnerFirstName == "") ||
        (this.formAddNewPrevOwnerLastName == undefined || this.formAddNewPrevOwnerLastName == "")) {
        return true
      }
    }

    return false;
  }

  onDeleteProductClick(content: TemplateRef<any>) {
    let selectedProductId: number = this.selectedProduct.id;
    this.modalService.open(content, { centered: true});
  }


  confirmDeleteProduct() {
    if (this.adminToken) {
      this.adminProductService.deleteProduct(this.selectedProduct.id, this.adminToken).subscribe(resp => {
        if (resp == "Success") {
          this.modalService.dismissAll();
          this.notifMessage = "Successfully deleted product."
          this.openSnackBar();

          this.getProducts();

        } else {
          this.modalService.dismissAll();
          this.notifMessage = "Something went wrong. Please try again."
          this.openSnackBar();
        }
      });
    }
  }
}
