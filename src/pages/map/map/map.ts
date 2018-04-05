import {Component} from '@angular/core';

import {} from '@types/googlemaps';

declare let google: any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})

export class MapComponent {
  constructor() {
  }

  cities = [];
  region = '';


}
