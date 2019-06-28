import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { AppPipesModuleModule } from '../shared/app-pipes-module/app-pipes-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppPipesModuleModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
