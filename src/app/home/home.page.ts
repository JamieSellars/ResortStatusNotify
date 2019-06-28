import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiftstatusService } from '../services/liftstatus.service';
import { Lift } from 'src/domain/Lift';
import { Router } from '@angular/router';
import { AppPipesModuleModule } from '../shared/app-pipes-module/app-pipes-module.module';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [AppPipesModuleModule]
})
export class HomePage implements OnInit, OnDestroy {
  
  loading: boolean = true;
  skeletonLifts: any[] = [];
  lifts: Lift[];
  errorMessage: string = '';

  constructor(private liftStatusService: LiftstatusService , private router: Router) {}

  ngOnInit(): void {
    
    this.prepareSkeletonCard();

    this.liftStatusService.getAll().subscribe((data: Lift[]) => {
      this.lifts = data;
      this.loading = false;
    });

  }

  ngOnDestroy(): void {
    
  }

  showDetail(lift: Lift) : void {    
     this.router.navigateByUrl('/detail/' + lift.id + '/' + lift.location);
  }

  prepareSkeletonCard() : void {
    for(var i = 0; i < 10; i++)
      this.skeletonLifts.push(i);
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
