import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lift } from 'src/domain/Lift';
import { Router } from '@angular/router';
import { AppPipesModuleModule } from '../shared/app-pipes-module/app-pipes-module.module';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [AppPipesModuleModule]
})
export class HomePage implements OnInit, OnDestroy {
  
  showClosed: boolean = false;
  liftStatuses: Observable<Lift[]>;

  constructor(private firestore: AngularFireDatabase, private router: Router) {}

  ngOnInit(): void {
    this.liftStatuses = this.firestore.list<Lift>('liftstatus').valueChanges();    
  }

  ngOnDestroy(): void {
    
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

  openSettings() {   
    this.router.navigateByUrl("/settings");
  }

}
