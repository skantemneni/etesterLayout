import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/layout/hg/main/main.component';
import { PrivacyPolicyComponent } from './components/layout/hg/privacy-policy/privacy-policy.component';
import { TestContainerComponent } from './components/test/test-container/test-container.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'test' },
  { path: 'test', component: TestContainerComponent },
  {
    path: 'test/:usertestId',
    component: TestContainerComponent
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

