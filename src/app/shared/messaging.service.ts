import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { messaging } from 'firebase';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDatabase: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging
  ) { 

    this.angularFireMessaging.messaging.subscribe((messaging) => {
      messaging.onMessage = messaging.onMessage.bind(messaging);
      messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
    });
    
  }
   /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      (user) => {     
        console.log(`${token} will be added to ${user.displayName}'s settings`);
        this.angularFireDatabase.database.ref(`/users/${user.uid}/fcmTokens`).push(token);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId: string): Promise<Boolean> {

    return new Promise<Boolean>((resolve, reject) => {

      this.angularFireMessaging.requestToken.subscribe(
        (token) => {

          console.log(token);

          this.updateToken(userId, token);
  
          return resolve(true);
  
        },
        (err) => {
          console.error('Unable to get permission to notify.', err);
          return reject();
        }
      );

    });
    
    
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

  // Get Browser Notification Status
  getNotificationPermission() : string {

    // Get browsers notification permission
    if( !('Notification' in window )){
      return 'unsupported';
    } 

    return Notification.permission.toString();

  }

}

