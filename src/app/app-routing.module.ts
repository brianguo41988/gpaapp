import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassCreateComponent } from './classes/classes-create/classes-create.component';
import { ClassListComponent } from './classes/classes-list/classes-list.component';

const routes: Routes = [
  { path: '', component: ClassListComponent},
  { path: 'create', component: ClassCreateComponent},
  { path: 'edit/:classId', component: ClassCreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
