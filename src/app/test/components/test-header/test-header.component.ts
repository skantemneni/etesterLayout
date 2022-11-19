import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import * as TestConstants from '@app/models/TestConstants';
// import * as ApplicationConstants from '../../../models/ApplicationConstants';
import { LoginEvent } from '@auth/model/login-data';
import { IAuthenticatable, ILoginUIService } from '@auth/model/auth.interface';
import { ILoginUIServiceToken } from '@app/app.module';
import { AuthenticatableDataServerToken } from '@app/app.module';
import { Router } from '@angular/router';
import { Usertest } from '../../../models/etestermodel.usertest';

@Component({
  selector: 'app-test-header',
  templateUrl: './test-header.component.html',
  styleUrls: ['./test-header.component.scss']
})
export class TestHeaderComponent implements OnInit {
  /**
   * Constructor.
   * TestHeaderComponent does 2 things.  1.) It takes teh responsibility of invoking the "Log-in/out" flow. 2.) Emits Events fro all other actions.
   * "Log-in/out" is handled via 
   * 
   * @param loginUIService
   */
  constructor(
    @Inject(ILoginUIServiceToken) private loginUIService: ILoginUIService,
    @Inject(AuthenticatableDataServerToken) private authenticatable: IAuthenticatable,
    private router: Router
  ) { }



  /* Inputs and Outputs */
  @Output() testAction = new EventEmitter<TestConstants.TestActions>();

  /* local variables */
  loggedInUserName: string = "";
  isLoggedIn: boolean = false;
  usertests?: Usertest[] = [];


  ngOnInit(): void {
    // Call to retrieve data
    this.loginUIService.loginBehaviorSubject.subscribe((loginEvent: LoginEvent) => {
      console.log("TestHeaderComponent.ngOnInit.loginUIService.loginBehaviorSubject.subscribe got", JSON.stringify(loginEvent));
      if (loginEvent.isLoggedIn) {
        this.authenticatable.setAuthCode(loginEvent.authToken);
        this.loggedInUserName = loginEvent.loggedinUser?.firstName || '';
        this.isLoggedIn = true;
        this.usertests = loginEvent.loggedinUser?.tests;
        // If I receive a new "Event" from the "loginUIService" and I am logged in, I may want to simply refresh the page so the "login context" will have its efect on rendering.
//        this.reloadCurrentRoute();
      } else {
        this.authenticatable.resetAuthCode();
        this.isLoggedIn = false;
        this.loggedInUserName = '';
        // If I receive a new "Event" from the "loginUIService" and I am not logged in, if means I need to be on home page.
        // TODO: Sesi.  Fix this soon.
        // this.router.navigate(['']);
      }
    });
  }

/*  getUsertests() {
    if (this.loginService.loggedinUser && this.loginService.loggedinUser.subscriptions && this.loginService.loggedinUser.subscriptions.length > 0) {
      return this.loginService.loggedinUser.subscriptions;
    }
    return [] as Channel[];
  }
*/



/*  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
*/

  onTestGradeClicked(event: any) {
    console.log(`Header: onTestGradeClicked: ${event}`);
    this.testAction.emit(TestConstants.TestActions.GRADE);
  }

  onTestUngradeClicked(event: any) {
    console.log(`Header: onTestUngradeClicked: ${event}`);
    this.testAction.emit(TestConstants.TestActions.UNGRADE);
  }

  onTestContinueClicked(event: any) {
    console.log(`Header: onTestContinueClicked: ${event}`);
    this.testAction.emit(TestConstants.TestActions.CONTINUE);
  }

  onTestRestartClicked(event: any) {
    console.log(`Header: onTestRestartClicked: ${event}`);
    this.testAction.emit(TestConstants.TestActions.RESTART);
  }

  onTestSaveClicked(event: any) {
    console.log(`Header: onTestSaveClicked: ${event}`);
    this.testAction.emit(TestConstants.TestActions.SAVE);
  }

  onLoginClicked() {
    this.loginUIService.onLoginInvokeAction();
  }

  onLogoutClicked(): void {
    this.loginUIService.onLogoutInvokeAction();
  }


/*  // Methods that drive Menu display
  isRegularUser(): boolean {
    return this.hasRole("ROLE_USER");
  }
  isAdminUser(): boolean {
    return this.hasRole("ROLE_ADMIN");
  }
  isProviderUser(): boolean {
    return this.hasRole("ROLE_PROVIDER");
  }
  isSystemUser(): boolean {
    return this.hasRole("ROLE_SYSTEM");
  }

  private hasRole(role: string): boolean {
    if (this.loginService.loggedinUser && this.loginService.loggedinUser.authorities && this.loginService.loggedinUser.authorities.length > 0) {
      for (let authority of this.loginService.loggedinUser.authorities) {
        if (authority.authority == role) {
          return true;
        }
      }
    }
    return false;
  }

  // Methods that drive Menu display
  private hasPermission(permission: string): boolean {
    if (this.loginService.loggedinUser && this.loginService.loggedinUser.permissions && this.loginService.loggedinUser.permissions.length > 0) {
      for (let userpermission of this.loginService.loggedinUser.permissions) {
        if (permission == userpermission) {
          return true;
        }
      }
    }
    return false;
  }
*/

}
