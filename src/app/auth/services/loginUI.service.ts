import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';
import { LogoutDialogComponent } from '../components/logout-dialog/logout-dialog.component';
import { LoginDialogData, LoginEvent } from '../model/login-data';
import { ILoginUIService } from '../model/auth.interface';



@Injectable({
  providedIn: 'root'
})
export class LoginUIService implements ILoginUIService {

  constructor(
    public dialog: MatDialog
  ) { }

  loginData: LoginDialogData = { username: '', password: '', email: '', authToken: '' };
  
  defaultNotLoggedInEventData: LoginEvent = {
    username: '',
    email: '',
    authToken: '',
    isLoggedIn: false
  }

  // This variable is defined in the Interface.  Do not change its name.
  loginBehaviorSubject: BehaviorSubject<LoginEvent> = new BehaviorSubject(this.defaultNotLoggedInEventData);


  // Login Button clicked.  Open the Login Dialog and let it handle the Login process.
  // Perform subsequent act
  /**
   * Note that this component keeps a copy of the "previously entered" login dialog values.  That way the next time the LoginDialog is opened, it is seeded with that information. 
   */
  onLoginInvokeAction(): void {
    // use any previously saved login data to seed the login popup
    const dialogRef = this.dialog.open(LoginDialogComponent,
      {
        width: 'auto',
        maxWidth: '450px',
        data: this.loginData /* pass the previous values to the dialog */
      }
    ).afterClosed().subscribe((returnData: LoginDialogData) => {
      // You don't get any return data if the user clicks the escape button or clicks outside the login dialog. 
      if (!returnData) {
        return;
      }
      // save login data on this.loginData - so we can use it as inputs to login dialog as needed
      this.loginData = returnData;  

      let { username, password, email, authToken, loggedinUser } = returnData;

      if (authToken && authToken.trim().length > 0 && loggedinUser) {
        // save successful login data on this.etesterdbService - so we can use it as needed
//        console.log(`LoginService.openLoginDialog.afterClosed(): AuthToken: ${authToken}`);
//        console.log(`LoginService.openLoginDialog.afterClosed(): loggedinUser: ${JSON.stringify(loggedinUser)}`);
//        this.authenticatable.setAuthCode(authToken);
//        this.loggedinUser = loggedinUser;

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


  /**
   * Open the logout dialog.
   */
  onLogoutInvokeAction(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent,
      {
        width: 'auto',
        maxWidth: '450px',
      }
    );
    dialogRef.afterClosed().subscribe(close => {
      if (close) {
        // Blank out the Auth Code on Data HTTP services - referred to here with a "Authenticatable" interface.
        // finally set the bahavior subject with the defaultNotLoggedInEventData.
        this.loginBehaviorSubject.next(this.defaultNotLoggedInEventData);
      } else {
      }
    });
  }

}
