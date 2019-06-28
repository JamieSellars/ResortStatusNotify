import { Component, OnInit } from '@angular/core';
import { LiftstatusService } from '../services/liftstatus.service';
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

  constructor(private liftStatusService: LiftstatusService, private activedRoute: ActivatedRoute) { 

    activedRoute.params.subscribe( params => {

      this.liftId = params["id"];
      this.liftLocation = params["location"];

    });

  }

  ngOnInit() {

    this.liftStatusService.getSingle(this.liftId, this.liftLocation).subscribe((data: Lift) => {
      this.lift = data;
      this.loading = false;
    });

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
