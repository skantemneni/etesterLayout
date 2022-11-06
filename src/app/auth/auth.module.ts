import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginDialogComponent } from '@auth/components/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from '@auth/components/logout-dialog/logout-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialUIModule } from '@app/material.module';
import { LoginService } from '@auth/services/login.service';



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
