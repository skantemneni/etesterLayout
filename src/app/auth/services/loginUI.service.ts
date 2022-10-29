import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { LoggedinUser } from '../model/etesteruser';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from '../components/logout-dialog/logout-dialog.component';
import { LoginDialogData, LoginEvent } from '../model/login-data';
import { IAuthenticatable } from '../model/auth.interface';
import { AuthenticatableDataServer } from '../../app.module';



@Injectable({
  providedIn: 'root'
})
export class LoginUIService {

  constructor(
    public dialog: MatDialog,
    @Inject(AuthenticatableDataServer) private authenticatable: IAuthenticatable
  ) { }

  loginData: LoginDialogData = { username: '', password: '', email: '', authToken: '' };
  
  private _loggedinUser: LoggedinUser | undefined;
  // Getter method 
  // of Student class
  public get loggedinUser(): LoggedinUser | undefined {
    return this._loggedinUser;
  }
  // Setter method to set the semester number
  public set loggedinUser(loggedinUser: LoggedinUser| undefined) {
    this._loggedinUser = loggedinUser;
  }


  defaultNotLoggedInEventData: LoginEvent = {
    username: '',
    email: '',
    authToken: '',
    isLoggedIn: false
  }

  loginBehaviorSubject = new BehaviorSubject(this.defaultNotLoggedInEventData);


  // Login Button clicked.  Open the Login Dialog and let it handle the Login process.
  // Perform subsequent act
  openLoginDialog() {
    // use any previously saved login data to seed the login popup
    const dialogRef = this.dialog.open(LoginDialogComponent,
      {
        width: 'auto',
        maxWidth: '450px',
        data: this.loginData
      }
    ).afterClosed().subscribe((returnData: LoginDialogData) => {
      // You don't get any return data if the user clicks the escape button or clicks outside the login dialog. 
      if (!returnData) {
        return;
      }
      // save login data on this.loginData - so we can use it as inputs to logi dialog as needed
      this.loginData = returnData;

      let { username, password, email, authToken, loggedinUser } = returnData;

      if (authToken && authToken.trim().length > 0 && loggedinUser) {
        // save successful login data on this.etesterdbService - so we can use it as needed
//        console.log(`LoginService.openLoginDialog.afterClosed(): AuthToken: ${authToken}`);
//        console.log(`LoginService.openLoginDialog.afterClosed(): loggedinUser: ${JSON.stringify(loggedinUser)}`);
        this.authenticatable.setAuthCode(authToken);
        this.loggedinUser = loggedinUser;

        // now create the loggedin event response object;
        let loggedInEvent = {
          username: username,
          email: email,
          authToken: authToken,
          loggedinUser: loggedinUser,
          isLoggedIn: true
        }
        this.loginBehaviorSubject.next(loggedInEvent);
      } else {
        //        console.log(`AuthToken: Whoopsydaisy`);
      }
    });

  }
  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent,
      {
        width: 'auto',
        maxWidth: '450px',
      }
    );
    dialogRef.afterClosed().subscribe(close => {
      if (close) {
        this.loginData.authToken = '';
        this.loggedinUser = undefined;
//        this.appHeaderComponent.isLoggedIn = false;
        this.authenticatable.resetAuthCode();
        // finally email the login data in the "loginBehaviorSubject"
        this.loginBehaviorSubject.next(this.defaultNotLoggedInEventData);
      } else {
      }
    });
  }

}
