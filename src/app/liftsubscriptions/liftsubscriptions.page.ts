import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { LiftSubscription } from 'src/domain/LiftSubscription';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { Lift } from 'src/domain/Lift';
import { take } from 'rxjs/operators';
import { GroupbyPipe } from '../pipes/groupby.pipe';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-liftsubscriptions',
  templateUrl: './liftsubscriptions.page.html',
  styleUrls: ['./liftsubscriptions.page.scss'],
  providers: [GroupbyPipe]
})
export class LiftsubscriptionsPage implements OnInit {

  subscriptions: LiftSubscription[] = [];
  subscriptionList: LiftSubscription[] = [];
  lifts: Lift[] = [];
  user: User;

  constructor(

    private angularFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router

  ) { }

  ngOnInit() {

    this.angularFireDatabase.database.ref('/users').once('value').then((users)=>{
      const liftId = 1;
      const userArray = users.val();
      
      const subscribers: string[] = [];
      Object.keys(userArray).forEach((key: string) => {
  
          const subscriptions = userArray[key].subscriptions;
      
          console.log(subscriptions);

          for(let i = 0; i < subscriptions.length; i++)    
            if( subscriptions[i].id == liftId ){
              Object.keys(userArray[key].fcmTokens).forEach((tokenKey)=>{
                subscribers.push(userArray[key].fcmTokens[tokenKey]);
              });
            }      
              
      });
      
      console.log(subscribers);
      console.log('send notification');
     // sendNotification(subscribers, message);
  
  }).catch((err)=>{console.error(err)});

    this.angularFireAuth.user.pipe(take(1)).subscribe((user) => {
      
      // Get available lifts
      this.user = user;
     
      return this.angularFireDatabase.database.ref('liftstatus').once('value').then((snapshot)=>{

        this.lifts = snapshot.val();
        return this.angularFireDatabase.database.ref(`/users/${user.uid}/subscriptions`).once('value');

      }).then((snapshot) => {
        this.subscriptions = snapshot.val();

      }).finally(()=>{
        this.prepareSubscriptionList();
        
      });
  
     

    });

    
  }

  prepareSubscriptionList() : void {
  
    this.lifts.forEach(lift => {
      
      var liftSubscription: LiftSubscription = {
        id: lift.id,
        name: lift.name,
        location: lift.location,
        subscribed: false
      };
      
      if( this.subscriptions != null){

        this.subscriptions.forEach(subscription => {

          if(subscription.id == lift.id)
            liftSubscription.subscribed = true;

        })
       
      }
      
      this.subscriptionList.push(liftSubscription);

    });    

  }

  saveSubscriptions() : void {

    this.subscriptions = this.subscriptionList.filter((subscription: LiftSubscription) => {

      return subscription.subscribed;

    });

    this.angularFireDatabase.database.ref(`/users/${this.user.uid}/subscriptions/`).set(this.subscriptions).then((res)=>{
      this.router.navigate(['/settings']);
    });

  }

  toSettings(): void {
    this.router.navigate(['/settings']);
  }

}
