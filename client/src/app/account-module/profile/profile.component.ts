import { Component, OnChanges, OnInit, SimpleChange, SimpleChanges, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { IRegion } from '../../../Models/AddressModels/region';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IProduct } from '../../../Models/product';
import { IProvince } from '../../../Models/AddressModels/province';
import { IMunicipality } from '../../../Models/AddressModels/municipality';
import { IBarangay } from '../../../Models/AddressModels/barangay';
import { AuthService } from '../../../Services/auth-service.service';
import { ICurrentUserProfile, ICurrentUserProfileC } from '../../../Models/currentuserprofile';
import { IEditCurrentUserProfile } from '../../../Models/editcurrentuserprofile';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  apiBaseAddress: string = "https://psgc.gitlab.io/api/";
  baseUrlIdentity: string = 'http://localhost:5064/api/Identity/';

  userIsAuthenticated: boolean = false;

  renderPage: boolean = false;

  @ViewChild('notification') public notification: TemplateRef<any>;
  notificationHeader: string;
  notificationMessage: string;

  currentUserProfile: ICurrentUserProfileC | null;

  selectedRegion: IRegion;
  selectedProvince: IProvince;
  selectedMunicipality: IMunicipality;
  selectedBarangay: IBarangay;

  listOfRegions: IRegion[];
  listOfProvinces: IProvince[];
  listOfMunicipalities: IMunicipality[];
  listOfBarangays: IBarangay[];

  formEmail: string | null | undefined;
  formDisplayName: string | null | undefined;
  formPassword: string;
  formConfirmPassword: string;

  formFirstName: string | undefined | null;
  formLastName: string | undefined | null;

  formRegion: string | undefined | null;
  formProvince: string | undefined | null;
  formMunicipality: string | undefined | null;
  formBarangay: string | undefined | null;

  formStreet: string | undefined | null;
  formZipCode: number | undefined | null;

  agreeToTerms: boolean = false;

  passwordMessages: string[] = [];

  confirmPasswordShow: boolean = false;
  agreeTermsWarningShow: boolean = false;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.initializeComponentLogin().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.renderPage = true;
        this.http.get<any>(this.apiBaseAddress + "regions").subscribe(data => {
          this.listOfRegions = data;
        });

        this.authService.currentUserProfileBS.subscribe(data => {
          this.currentUserProfile = data;
          if (this.currentUserProfile) {
            this.initializeFields();
          }
        });
      } else {
        this.router.navigateByUrl("/home");
      }
    });
  }

  onRegionSelect() {
    this.http.get<any>(this.apiBaseAddress + "regions/" + this.selectedRegion.code + "/provinces").subscribe(data => {
      this.listOfProvinces = data;
    });
    this.formRegion = this.selectedRegion.name;
  }

  onProvinceSelect() {
    this.http.get<any>(this.apiBaseAddress + "provinces/" + this.selectedProvince.code + "/municipalities").subscribe(data => {
      this.listOfMunicipalities = data;
      this.formProvince = this.selectedProvince.name;
    });
  }

  onMunicipalitySelect() {
    this.http.get<any>(this.apiBaseAddress + "municipalities/" + this.selectedMunicipality.code + "/barangays").subscribe(data => {
      this.listOfBarangays = data;
      this.formMunicipality = this.selectedMunicipality.name;
    });
  }

  onBarangaySelect() {
    this.formBarangay = this.selectedBarangay.name;
  }


  //VALIDATIONS

  checkConfirmPassword() {
    if (this.formConfirmPassword != "" && this.formConfirmPassword != null) {
      if (this.formConfirmPassword != this.formPassword) {
        this.confirmPasswordShow = true;
        return;
      }
      this.confirmPasswordShow = false;
    };
    this.confirmPasswordShow = false;
  }

  checkPasswordInput() {
    setTimeout(() => {
      if (this.formPassword != "" && this.formPassword != null) {
        this.checkPasswordContainsDigit();
        this.checkPasswordHasLowerCaseLetters();
        this.checkPasswordHasUpperCaseLetters();
        this.checkPasswordHasAlphanumericChar();
        this.checkPasswordLength();
      } else {
        this.passwordMessages.length = 0;
      };

    }, 1000);
  }

  containsNumber(str: string): boolean {
      return /\d/.test(str);
  }

  checkPasswordContainsDigit() {
    if (!this.containsNumber(this.formPassword)) {
      var message = "Password must contain number/s.";
      if (!this.passwordMessages.includes(message)) {
        this.passwordMessages.push(message)
      }
    } else {
      var message = "Password must contain number/s.";
      const index = this.passwordMessages.indexOf(message);
      if (index > -1) {
        this.passwordMessages.splice(index, 1);
      }
    }
  }

  checkPasswordHasLowerCaseLetters() {
    if (this.formPassword.toUpperCase() == this.formPassword) {
      var message = "Password must have lowercase letters.";
      if (!this.passwordMessages.includes(message)) {
        this.passwordMessages.push(message)
      }
    } else {
      var message = "Password must have lowercase letters.";
      const index = this.passwordMessages.indexOf(message);
      if (index > -1) {
        this.passwordMessages.splice(index, 1);
      }
    }
  }

  checkPasswordHasUpperCaseLetters() {
    if (this.formPassword.toLowerCase() == this.formPassword) {
      var message = "Password must have uppercase letters.";
      if (!this.passwordMessages.includes(message)) {
        this.passwordMessages.push(message)
      }
    } else {
      var message = "Password must have uppercase letters.";
      const index = this.passwordMessages.indexOf(message);
      if (index > -1) {
        this.passwordMessages.splice(index, 1);
      }
    }
  }

  checkPasswordHasAlphanumericChar() {
    if (!/[^a-zA-Z0-9]/.test(this.formPassword)) {
      var message = "Password must have non-alphanumeric characters.";
      if (!this.passwordMessages.includes(message)) {
        this.passwordMessages.push(message)
      }
    } else {
      var message = "Password must have non-alphanumeric characters.";
      const index = this.passwordMessages.indexOf(message);
      if (index > -1) {
        this.passwordMessages.splice(index, 1);
      }
    }
  }

  checkPasswordLength() {
    if (this.formPassword.length < 6 ) {
      var message = "Password must have more than 5 characters.";
      if (!this.passwordMessages.includes(message)) {
        this.passwordMessages.push(message)
      }
    } else {
      var message = "Password must have more than 5 characters.";
      const index = this.passwordMessages.indexOf(message);
      if (index > -1) {
        this.passwordMessages.splice(index, 1);
      }
    }
  }

  onFormSubmit() {
    if (!this.agreeToTerms) {
      this.agreeTermsWarningShow = true;
      return;
    }
    this.agreeTermsWarningShow = false;

    const userToEdit: IEditCurrentUserProfile = {
      displayName: this.formDisplayName,
      email: this.formEmail,
      firstName: this.formFirstName,
      lastName: this.formLastName,
      municipality: this.formMunicipality,
      province: this.formProvince,
      region: this.formRegion,
      street: this.formStreet,
      zipcode: this.formZipCode?.toString(),
      barangay: this.formBarangay,
      password: this.formPassword,
    };

    const userToSendForEdit = JSON.stringify(userToEdit);
    console.log(userToSendForEdit);
    console.log("SUBMITTING");

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getCurrentUser()?.token}`
    });

    let options = { headers: headers };

    this.http.post<ICurrentUserProfileC>(this.baseUrlIdentity + "edit-user", userToSendForEdit, options).subscribe({
      next: (updatedUser) => {
        console.log(updatedUser);
        this.notificationHeader = "Success";
        this.notificationMessage = "Profile update successful. Redirecting to homepage.";
        this.authService.updateUserDetails(updatedUser);
        this.runModalNotifServices();
        
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.notificationHeader = "Update Failed";
        this.notificationMessage = "Profile update failed. Redirecting to homepage.";
        this.runModalNotifServices();
      }
    });
  }

  initializeFields() {
    this.formEmail = this.currentUserProfile?.Email;
    this.formDisplayName = this.currentUserProfile?.DisplayName;
    this.formFirstName = this.currentUserProfile?.FirstName;
    this.formLastName = this.currentUserProfile?.LastName;
    this.formRegion = this.currentUserProfile?.Region;
    this.formProvince = this.currentUserProfile?.Province;
    this.formMunicipality = this.currentUserProfile?.Municipality;
    this.formBarangay  = this.currentUserProfile?.Barangay;
    this.formStreet = this.currentUserProfile?.Street;
    this.formZipCode = this.currentUserProfile?.Zipcode;
  }

  convertRegionToFormat(region: IRegion): string {
    return region.regionName.toString() + " - " + region.name.toString();
  }

  openModalNotif(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  closeModalNotif(content: TemplateRef<any>) {
    this.modalService.dismissAll(content);
  }

  runModalNotifServices() {
    this.openModalNotif(this.notification);
    setTimeout(() => {
      this.router.navigateByUrl("/home");
      this.closeModalNotif(this.notification);
    }, 2000);
  }

}
