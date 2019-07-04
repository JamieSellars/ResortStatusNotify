import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LiftsubscriptionsPage } from './liftsubscriptions.page';
import { AppPipesModuleModule } from '../shared/app-pipes-module/app-pipes-module.module';

const routes: Routes = [
  {
    path: '',
    component: LiftsubscriptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppPipesModuleModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LiftsubscriptionsPage]
})
export class LiftsubscriptionsPageModule {}
