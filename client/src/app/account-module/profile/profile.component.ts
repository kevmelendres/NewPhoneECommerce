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
    
  }

  onProvinceSelect() {
    this.http.get<any>(this.apiBaseAddress + "provinces/" + this.selectedProvince.code + "/municipalities").subscribe(data => {
      this.listOfMunicipalities = data;
    });
  }

  onMunicipalitySelect() {
    this.http.get<any>(this.apiBaseAddress + "municipalities/" + this.selectedMunicipality.code + "/barangays").subscribe(data => {
      this.listOfBarangays = data;
    });
  }

}
