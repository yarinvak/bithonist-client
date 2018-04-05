import {Injectable} from "@angular/core";

@Injectable()
export class LocationsService{
  alert: any;
  // cities : string[];
  // region : string;
  setAlert = function(alert){
    this.alert = alert;
  };
  isEquals = function(citiesList)
  {
    if (this.alert.cities == citiesList)
      return true;
    if (this.alert.cities.length!=citiesList.length)
      return false;
    for (let i = 0; i< this.alert.cities.length; i++)
    {
      if (this.alert.cities[i]!=citiesList[i])
        return false;
    }
    return true;
  }
}
