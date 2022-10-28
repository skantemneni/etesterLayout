import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestlayoutComponent } from '../components/test/testlayout/testlayout.component';

const routes: Routes = [
  { path: 'test', component: TestlayoutComponent },
  { path: 'test/:usertestId', component: TestlayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }

