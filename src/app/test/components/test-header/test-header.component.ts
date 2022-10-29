import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as TestConstants from '../../../models/TestConstants';
import * as ApplicationConstants from '../../../models/ApplicationConstants';
import { LoginService } from '../../../auth/services/login.service';
import { LoginEvent } from '../../../auth/model/login-data';
import { LoginUIService } from '../../../auth/services/loginUI.service';

@Component({
  selector: 'app-test-header',
  templateUrl: './test-header.component.html',
  styleUrls: ['./test-header.component.scss']
})
export class TestHeaderComponent implements OnInit {

  /* Inputs and Outputs */
  @Output() testAction = new EventEmitter<TestConstants.TestActions>();

  /* local variables */
  loggedInUserName: string = "";
  isLoggedIn: boolean = false;

  /* constructor */
  constructor(private loginUIService: LoginUIService) { }


  ngOnInit(): void {
    // Call to retrieve data
    this.loginUIService.loginBehaviorSubject.subscribe((loginEvent: LoginEvent) => {
      console.log("AppComponent.ngOnInit.loginService.loginBehaviorSubject.subscribe got", JSON.stringify(loginEvent));
      if (loginEvent.isLoggedIn) {
        this.isLoggedIn = true;
        this.loggedInUserName = loginEvent.loggedinUser?.firstName || '';
      } else {
        this.isLoggedIn = false;
        this.loggedInUserName = '';
      }
    });
  }

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
    this.loginUIService.openLoginDialog();
  }

  onLogoutClicked(): void {
    this.loginUIService.openLogoutDialog();
  }


}
