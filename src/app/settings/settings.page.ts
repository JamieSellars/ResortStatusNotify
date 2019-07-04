import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../shared/messaging.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  showNotificationSettings: boolean;
  notificationPermission: any;
  settings: Observable<any>;
  user: User;

  constructor(
    private messagingService: MessagingService,
    private angularFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router      
  ) {}

  ngOnInit() {
    
    this.checkNotificationPermission();

    this.angularFireAuth.authState.subscribe(user => {
 
      this.user = user;

      this.angularFireDatabase.database.ref(`/users/${user.uid}/`)
      .on('value', ( snapshot )=>{      
        this.settings = snapshot.val();        
      });      

    });

  }

  requestPermission() {
    this.messagingService.requestPermission(this.user.uid).then(() => {
      this.checkNotificationPermission();
    }).catch(()=>{
      this.checkNotificationPermission();
    });
  }

  checkNotificationPermission() : void {
    var permission = this.messagingService.getNotificationPermission();
    this.showNotificationSettings = (permission == 'granted');
    this.notificationPermission = permission;      
  }

  onLogout() : void {

    this.angularFireAuth.auth.signOut().then(()=>{
      this.router.navigate(['/home']);
    });

  }

  toHome(): void {
    this.router.navigate(['/home']);
  }

}
