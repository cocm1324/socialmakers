import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@components/common/login/login.component';
import { ROUTER_TYPE } from './models';

const routes: Routes = [
  { path: ROUTER_TYPE.DEFAULT, redirectTo: ROUTER_TYPE.ACADEMY, pathMatch: "full" },
  { path: ROUTER_TYPE.LOGIN, component: LoginComponent },
  { path: ROUTER_TYPE.ACADEMY, loadChildren: () => import(`./components/academy/academy.module`).then(module => module.AcademyModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
