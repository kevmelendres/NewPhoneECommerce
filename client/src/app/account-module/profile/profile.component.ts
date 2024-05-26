import { Component, OnInit } from '@angular/core';
import { IRegion } from '../../../Models/AddressModels/region';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../../../Models/product';
import { IProvince } from '../../../Models/AddressModels/province';
import { IMunicipality } from '../../../Models/AddressModels/municipality';
import { IBarangay } from '../../../Models/AddressModels/barangay';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  apiBaseAddress: string = "https://psgc.gitlab.io/api/";

  selectedRegion: IRegion;
  selectedProvince: IProvince;
  selectedMunicipality: IMunicipality;
  selectedBarangay: IBarangay;

  listOfRegions: IRegion[];
  listOfProvinces: IProvince[];
  listOfMunicipalities: IMunicipality[];
  listOfBarangays: IBarangay[];

  formDisplayName: string;
  formPassword: string;
  formConfirmPassword: string;

  formFirstName: string;
  formLastName: string;

  formRegion: string;
  formProvince: string;
  formMunicipality: string;
  formBarangay: string;

  formStreet: string;
  formZipCode: string;

  passwordMessages: string[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(this.apiBaseAddress + "regions").subscribe(data => {

      this.listOfRegions = data;
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

  checkConfirmPassword(): boolean {
    if (this.formConfirmPassword != this.formPassword) {
      return true;
    }

    return false;
  }

  checkPasswordInput() {
    setTimeout(() => {
      if (this.formPassword != "" && this.formPassword != null) {
        this.checkPasswordContainsDigit();


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
}
