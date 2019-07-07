import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Lift } from 'src/domain/Lift';
import { Router } from '@angular/router';
import { AppPipesModuleModule } from '../shared/app-pipes-module/app-pipes-module.module';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [AppPipesModuleModule]
})
export class HomePage implements OnInit, OnDestroy {
  
  statusCount: any = {};
  showOpenOnly: boolean = true;
  liftStatuses: Observable<Lift[]>;

  constructor(private firestore: AngularFireDatabase, private router: Router) {}

  ngOnInit(): void {

    this.getShowOpenOnly();

    this.getLifts();
  }

  ngOnDestroy(): void {    
  }

  getLifts(event?) {
    
    this.liftStatuses = this.firestore.list<Lift>('liftstatus')
      .valueChanges()
      .pipe(

        map(items => {

          if( !this.showOpenOnly )
            return items;

          if( this.showOpenOnly ){
            return items.filter(item => item.status == 'Open')
          }          

        }),
        filter(items => { 
          return items && items.length > 0
        })
      );

    
    if( event )
      event.target.complete();
    
  }

  toggleOpenOnlyFilter(){
    setTimeout(()=>{
      window.localStorage.setItem('showOpenOnly', this.showOpenOnly.toString());      
    },100);
    this.getLifts();
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

  getShowOpenOnly() {
    if( window.localStorage.getItem('showOpenOnly') ){

      if((/true/i).test(window.localStorage.getItem('showOpenOnly')))
        this.showOpenOnly = true;
      else
        this.showOpenOnly = false;

    } else {
      window.localStorage.setItem('showOpenOnly', this.showOpenOnly.toString());
    }
  }

}
