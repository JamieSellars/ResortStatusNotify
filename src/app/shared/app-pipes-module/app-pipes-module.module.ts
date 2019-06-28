import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupbyPipe } from 'src/app/pipes/groupby.pipe';
import {TimeAgoPipe} from 'time-ago-pipe';

@NgModule({
  declarations: [GroupbyPipe,TimeAgoPipe],
  imports: [
    CommonModule
  ],
  exports: [
    GroupbyPipe,
    TimeAgoPipe
  ]
})
export class AppPipesModuleModule { }
