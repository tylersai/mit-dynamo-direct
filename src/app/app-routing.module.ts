import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { MemberComponent } from './member/member.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'memberlist', component:MemberlistComponent },
  { path: 'member/:id', component:MemberComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
