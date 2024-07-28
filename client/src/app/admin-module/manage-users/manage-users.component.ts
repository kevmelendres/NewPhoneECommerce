import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { IAdminAppUser } from '../../../Models/adminappuser';
import { Pagination } from '../../../Services/pagination';
import { AdminUserService } from '../../../Services/admin-user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRegion } from '../../../Models/AddressModels/region';
import { IProvince } from '../../../Models/AddressModels/province';
import { IMunicipality } from '../../../Models/AddressModels/municipality';
import { IBarangay } from '../../../Models/AddressModels/barangay';
import { HttpClient } from '@angular/common/http';
import { IEditUserByAdmin } from '../../../Models/edituserbyadmin';
import { AuthService } from '../../../Services/auth-service.service';
import { IAddUserByAdmin } from '../../../Models/adduserbyadmin';
import { IDeleteUserByAdmin } from '../../../Models/deleteuserbyadmin';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit{
  @ViewChild('snackbar') snackbar: ElementRef;
  @ViewChild('showingResultsRemark') showingResultsRemark: ElementRef;
  notifMessage: string;

  userList: IAdminAppUser[];
  pagination: Pagination = new Pagination;

  apiBaseAddress: string = "https://psgc.gitlab.io/api/";

  searchString: string;
  selectedUser: IAdminAppUser;

  formFirstName: string;
  formLastName: string;
  formDisplayName: string;
  formEmail: string;
  formUserRoles: string[] = [];
  formMunicipality: string | undefined;
  formProvince: string | undefined;
  formRegion: string | undefined;
  formBarangay: string | undefined;
  formZipCode: string;
  formStreet: string;

  selectedRegion: IRegion | undefined; 
  selectedProvince: IProvince | undefined;
  selectedMunicipality: IMunicipality | undefined;
  selectedBarangay: IBarangay | undefined;

  listOfRegions: IRegion[];
  listOfProvinces: IProvince[];
  listOfMunicipalities: IMunicipality[];
  listOfBarangays: IBarangay[];

  //New user information
  newUserDisplayName: string;
  newUserEmail: string;
  newUserPassword: string;
  newUserFirstName: string;
  newUserLastName: string;

  newSelectUserRegion: IRegion | undefined;
  newSelectUserProvince: IProvince | undefined;
  newSelectUserMunicipality: IMunicipality | undefined;
  newSelectUserBarangay: IBarangay | undefined;

  newUserRegion: string;
  newUserProvince: string;
  newUserMunicipality: string;
  newUserBarangay: string;

  newUserStreet: string;
  newUserZipCode: string;

  newUserRoles: string[] = []

  searchUserString: string;
  searchUserStringCopy: string;

  @ViewChild('formCompleteLabel') formCompleteLabel: ElementRef;

  constructor(private adminUserService: AdminUserService,
    private modalService: NgbModal, private http: HttpClient,
    private authService: AuthService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.pagination.pageNumber = 1;
    this.pagination.itemsToShow = 15;
    this.populateUserList();
    this.setupPaginationCounts();
  }

  searchRemarks: string;


  onUserClick(user: IAdminAppUser, userDetails: TemplateRef<any>) {

    this.http.get<any>(this.apiBaseAddress + "regions").subscribe(data => {
      this.listOfRegions = data;
    });

    this.selectedUser = user;
    this.resetSelectedAddress();
    this.populateSelectedUserForm();
    this.modalService.open(userDetails, { centered: true, size: 'lg' });
    
  }

  onPrevPaginationClick() {
    this.pagination.onPrevPaginationClick();
  }

  onPageNumberClick(page: number) {
    this.pagination.onPageNumberClick(page);
  }

  onNextPaginationClick() {
    this.pagination.onNextPaginationClick();
  }

  userRollBadgeClass(role: string): string {
    if (role == "Admin") {
      return "text-bg-success";
    }
    return "text-bg-primary";
  }

  populateUserList() {
    this.adminUserService.getUsers(this.pagination.pageNumber, this.pagination.itemsToShow).subscribe(
      data => this.userList = data
    );
  }

  setupPaginationCounts() {
    this.adminUserService.getUsers().subscribe(data => {
      this.pagination.allItemsCount = data.length;
      this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
      this.pagination.resetPaginationNumbering();
      this.pagination.resetPageNumbersBasedOnCurrentPage();
      this.pagination.enableDisableNextPageClick();
    });
  }

  populateSelectedUserForm() {
    if (this.selectedUser) {
      this.formFirstName = this.selectedUser.firstName;
      this.formLastName = this.selectedUser.lastName;
      this.formDisplayName = this.selectedUser.displayName;
      this.formEmail = this.selectedUser.email;
      this.formUserRoles = Array.from(this.selectedUser.userRoles);

      this.formMunicipality = this.selectedUser.municipality;
      this.formProvince = this.selectedUser.province;
      this.formRegion = this.selectedUser.region;
      this.formStreet = this.selectedUser.street;
      this.formZipCode = this.selectedUser.zipCode;
      this.formBarangay = this.selectedUser.barangay;
    }
  }

  removeRole(role: string) {
    const index = this.formUserRoles.indexOf(role, 0);
    if (index > -1) {
      this.formUserRoles.splice(index, 1);
    }
  }

  removeNewUserRole(role: string) {
    const index = this.newUserRoles.indexOf(role, 0);
    if (index > -1) {
      this.newUserRoles.splice(index, 1);
    }
  }

  addRole(role: string) {
    this.formUserRoles.push(role);
  }

  addNewUserRole(role: string) {
    this.newUserRoles.push(role);
  }

  areTheSame(a: string | null, b: string | null) {
    if (a == null && b == "") {
      return true;
    }
    if (b == null && a == "") {
      return true;
    }
    return a === b;
  }

  updateUser() {
    const editUserByAdmin: IEditUserByAdmin = {
      email: this.formEmail,
      firstName: this.formFirstName,
      lastName: this.formLastName,
      displayName: this.formDisplayName,
      userRoles: this.formUserRoles,
      region: this.formRegion,
      province: this.formProvince,
      municipality: this.formMunicipality,
      barangay: this.formBarangay,
      street: this.formStreet,
      zipcode: this.formZipCode
    }

    if (this.authService.currentUser?.token) {

      this.adminUserService.editUser(editUserByAdmin, this.authService.currentUser.token)
        .subscribe(response => {
          if (response = "Success") {
            this.populateUserList();
            this.modalService.dismissAll();
            this.notifMessage = "Successfully edited user.";
            this.openSnackBar();
          } else {
            this.notifMessage = "Something went wrong. Please try again later.";
            this.openSnackBar();
          }
        });
    }
  }

  onRegionSelect() {
    this.http.get<any>(this.apiBaseAddress + "regions/" + this.selectedRegion!.code + "/provinces").subscribe(data => {
      this.listOfProvinces = data;
    });
    this.formRegion = this.selectedRegion!.name;
  }

  onProvinceSelect() {
    this.http.get<any>(this.apiBaseAddress + "provinces/" + this.selectedProvince!.code + "/municipalities").subscribe(data => {
      this.listOfMunicipalities = data;
      this.formProvince = this.selectedProvince!.name;
    });
  }

  onMunicipalitySelect() {
    this.http.get<any>(this.apiBaseAddress + "municipalities/" + this.selectedMunicipality!.code + "/barangays").subscribe(data => {
      this.listOfBarangays = data;
      this.formMunicipality = this.selectedMunicipality!.name;
    });
  }

  onBarangaySelect() {
    this.formBarangay = this.selectedBarangay!.name;
  }

  resetSelectedAddress() {
    this.selectedBarangay = undefined;
    this.selectedMunicipality = undefined;
    this.selectedProvince = undefined;
    this.selectedRegion = undefined;
  }

  openSnackBar() {
    this.renderer.addClass(this.snackbar.nativeElement, 'show');

    setTimeout(() => {
      this.renderer.removeClass(this.snackbar.nativeElement, 'show');
    }, 2000);
  }

  onAddNewUserBtnClick(addNewUserTemplate: TemplateRef<any>) {
    this.http.get<any>(this.apiBaseAddress + "regions").subscribe(data => {
      this.listOfRegions = data;
    });

    this.clearAddNewUserForm();
    this.modalService.open(addNewUserTemplate, { centered: true, size: 'lg' });
  }

  clearAddNewUserForm() {
    this.newUserDisplayName = "";
    this.newUserEmail = "";
    this.newUserPassword = "";
    this.newUserFirstName = "";
    this.newUserLastName = "";

    this.newSelectUserRegion = undefined;
    this.newSelectUserProvince = undefined;
    this.newSelectUserMunicipality = undefined;
    this.newSelectUserBarangay = undefined;
    this.newUserStreet = "";
    this.newUserZipCode = "";
  }

  addNewUserBtnClick() {
    const newUser: IAddUserByAdmin = {
      displayName: this.newUserDisplayName,
      email: this.newUserEmail,
      password: this.newUserPassword,
      firstName: this.newUserFirstName,
      lastName: this.newUserLastName,
      region: this.newUserRegion,
      province: this.newUserProvince,
      municipality: this.newUserMunicipality,
      barangay: this.newUserBarangay,
      street: this.newUserStreet,
      zipcode: this.newUserZipCode.toString(),
      userRoles: this.newUserRoles
    };
    
    if (this.areAllFieldsForNewUserFilled()) {
      if (this.authService.currentUser?.token) {
        this.adminUserService.createNewUser(newUser, this.authService.currentUser.token).subscribe(
          data => {
            if (data = "Success") {
              this.populateUserList();
              this.modalService.dismissAll();
              this.notifMessage = "Successfully added new user.";
              this.openSnackBar();
            } else {
              this.notifMessage = "Something went wrong.";
              this.openSnackBar();
            };
        });
      }
    }
  }

  onNewRegionSelect() {
    this.http.get<any>(this.apiBaseAddress + "regions/" + this.newSelectUserRegion!.code + "/provinces").subscribe(data => {
      this.listOfProvinces = data;
    });
    this.newUserRegion = this.newSelectUserRegion!.name;
  }

  onNewProvinceSelect() {
    this.http.get<any>(this.apiBaseAddress + "provinces/" + this.newSelectUserProvince!.code + "/municipalities").subscribe(data => {
      this.listOfMunicipalities = data;
    });
    this.newUserProvince = this.newSelectUserProvince!.name;
  }

  onNewMunicipalitySelect() {
    this.http.get<any>(this.apiBaseAddress + "municipalities/" + this.newSelectUserMunicipality!.code + "/barangays").subscribe(data => {
      this.listOfBarangays = data;
    });
    this.newUserMunicipality = this.newSelectUserMunicipality!.name;
  }

  onNewBarangaySelect() {
    this.newUserBarangay = this.newSelectUserBarangay!.name;
  }

  areAllFieldsForNewUserFilled(): boolean {

    if (this.newUserDisplayName != "" && this.newUserEmail != "" &&
      this.newUserPassword != "" && this.newUserFirstName != "" &&
      this.newUserLastName != "" && this.newUserRegion != "" &&
      this.newUserProvince != "" && this.newUserMunicipality != "" &&
      this.newUserBarangay != "" && this.newUserStreet != "" &&
      this.newUserZipCode != "" && this.newUserRoles.length > 0) {
        return true;
    }

    return false;
  }

  deleteUser(deleteUserModal: TemplateRef<any>) {
    this.modalService.open(deleteUserModal, { centered: true, size: 'md' });
  }

  confirmDeleteUser() {
    if (this.authService.currentUser?.token) {
      this.adminUserService.deleteUser(this.selectedUser.email, this.authService.currentUser.token)
        .subscribe(data => {
          if (data = "Delete succeeded.") {
            this.populateUserList();
            this.modalService.dismissAll();
            this.notifMessage = "User deletion successfull."
            this.openSnackBar();
          } else {
            this.notifMessage = "Something went wrong.";
            this.openSnackBar();
          }
        })
    }
  }

  searchUser() {
    if (this.authService.currentUser?.token) {
      this.adminUserService.searchUsers(this.searchUserString, this.authService.currentUser.token)
        .subscribe(data => {
          this.searchUserStringCopy = this.searchUserString
          this.userList = data;

          this.pagination.allItemsCount = data.length;
          this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
          this.pagination.resetPaginationNumbering();
          this.pagination.resetPageNumbersBasedOnCurrentPage();
          this.pagination.enableDisableNextPageClick();

          this.renderer.removeClass(this.showingResultsRemark.nativeElement, 'd-none');
          this.renderer.addClass(this.showingResultsRemark.nativeElement, 'd-block');

        });
    }
  }

  onSearchTyping(event: any) {
    if (event.key == "Enter") {
      this.searchUser();
    }
  }

  deleteSearchResults() {
    this.populateUserList();
    this.setupPaginationCounts();
    this.searchUserString = "";
    this.renderer.removeClass(this.showingResultsRemark.nativeElement, 'd-block');
    this.renderer.addClass(this.showingResultsRemark.nativeElement, 'd-none');

  }
}
