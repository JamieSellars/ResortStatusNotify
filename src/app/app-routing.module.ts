import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { 
    path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule', 
    canActivate: [AngularFireAuthGuard], data: {  
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },   
  { path: 'liftsubscriptions', loadChildren: './liftsubscriptions/liftsubscriptions.module#LiftsubscriptionsPageModule', 
    canActivate: [AngularFireAuthGuard], data: {  
      authGuardPipe: redirectUnauthorizedToLogin
    } 
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
