import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../shared/messaging.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserSettings } from 'src/domain/UserSettings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  showNotificationSettings: boolean;
  notificationPermission: any;
  settings: any;
  user: User;

  constructor(
    private messagingService: MessagingService,
    private angularFireAuth: AngularFireAuth,
    private angularFireDatabase: AngularFireDatabase,
    public loadingController: LoadingController,
    private router: Router      
  ) {}

  ngOnInit() {
    
    this.checkNotificationPermission();

    this.angularFireAuth.authState.subscribe(user => {
 
      this.user = user;

      if( user ){
        this.angularFireDatabase.database.ref(`/users/${user.uid}/`)
        .on('value', ( snapshot )=>{      
          this.settings = snapshot.val();        
        });      
      } else {
        this.router.navigate(['/home']);
      }

    });

  }

  async requestPermission() {

    const loading = await this.loadingController.create({
      spinner: null,
      message: 'Setting up notification permissions',
      translucent: true
    });

    loading.present();

    this.messagingService.requestPermission(this.user.uid).then(() => {
      this.checkNotificationPermission();
    }).catch(()=>{
      this.checkNotificationPermission();
    }).finally(()=>{
      loading.dismiss();
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
