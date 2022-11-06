import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialUIModule } from '../../material.module';
import { LoginService } from './services/login.service';



@NgModule({
  declarations: [
    LoginDialogComponent,
    LogoutDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialUIModule
  ],
  providers: [LoginService],
  exports: []
})
export class AuthModule { }
