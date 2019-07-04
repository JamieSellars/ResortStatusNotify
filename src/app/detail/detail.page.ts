import { Component, OnInit } from '@angular/core';
import { Lift } from 'src/domain/Lift';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  loading: boolean = true;
  liftId: string;
  liftLocation: string;  
  lift: Lift;

  constructor(private activedRoute: ActivatedRoute) { 

    

  }

  ngOnInit() {

    

  }
  getLiftStatusChip(status: string) : string {

    switch(status)
    {
      case 'Closed':
        return 'danger';
        break;

      case 'Open':
        return 'success';
        break;

      case 'On Hold':
        return 'primary';
        break;
    }      

  }
}
