import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router,
    public loadingController: LoadingController) { }

  ngOnInit() {
  }

  async login() {
    
    try {
    
      const loading = await this.loadingController.create({
        spinner: null,
        message: 'Signing in with Google',
        translucent: true
      });

      await loading.present();
      await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    } catch(err) {
      console.error();
    }

  }

  skipLogin() : void {
    this.router.navigateByUrl('/home');
  }

}
