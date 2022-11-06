import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EtesterdbService } from '@app/services/etesterdb.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth/auth.module';
import { TestModule } from '@test/test.module';

import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { GlobalService } from '@app/services/global.service';

/* BrowserAnimationsModule gets added when you add Andular Materials */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { LoginUIService } from '@auth/services/loginUI.service';

export const ILoginUIServiceToken = new InjectionToken('ILoginUIServiceToken');
export const AuthenticatableDataServerToken = new InjectionToken('AuthenticatableDataServerToken');

/*
 * Note that although AuthModule is being used from the "Header" compponent that is currently part of teh Test Module, we are
 * including Auth Module here and NOT the test module so we can refactor as needed.
 *
 */

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
],
  imports: [
    BrowserModule,
    AuthModule,
    TestModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: AuthenticatableDataServerToken, useClass: EtesterdbService
    },
    {
      provide: ILoginUIServiceToken, useClass: LoginUIService
    },
    GlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
