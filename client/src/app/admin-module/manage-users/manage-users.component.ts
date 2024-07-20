import { Component, OnInit, TemplateRef } from '@angular/core';
import { IAdminAppUser } from '../../../Models/adminappuser';
import { Pagination } from '../../../Services/pagination';
import { AdminUserService } from '../../../Services/admin-user.service';
import { IAdminManageUsersParams } from '../../../Models/AdminManageUsersParams';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRegion } from '../../../Models/AddressModels/region';
import { IProvince } from '../../../Models/AddressModels/province';
import { IMunicipality } from '../../../Models/AddressModels/municipality';
import { IBarangay } from '../../../Models/AddressModels/barangay';
import { HttpClient } from '@angular/common/http';
import { IEditUserByAdmin } from '../../../Models/edituserbyadmin';
import { zip } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent implements OnInit{

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

  constructor(private adminUserService: AdminUserService,
    private modalService: NgbModal, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.pagination.pageNumber = 1;
    this.pagination.itemsToShow = 15;
    this.populateUserList();
    this.setPaginationCount();

    this.pagination.maxPossiblePageNumber = Math.ceil(this.pagination.allItemsCount / this.pagination.itemsToShow);
    this.pagination.resetPaginationNumbering();
    this.pagination.resetPageNumbersBasedOnCurrentPage();
    this.pagination.enableDisableNextPageClick();

    this.http.get<any>(this.apiBaseAddress + "regions").subscribe(data => {
      this.listOfRegions = data;
    });

    console.log(this.selectedBarangay);
  }

  searchRemarks: string;


  onUserClick(user: IAdminAppUser, userDetails: TemplateRef<any>) {
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

  setPaginationCount() {
    this.adminUserService.getUsers().subscribe(data => {
      this.pagination.allItemsCount = data.length
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

  addRole(role: string) {
    this.formUserRoles.push(role);
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
}
