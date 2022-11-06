import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoggedinUser } from '@auth/model/etesteruser';
import { LoginDialogData } from '@auth/model/login-data';
import { LoginService } from '@auth/services/login.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  /**
   * LoginDialog, once it receives all the "Injected" dependencies, will manage its own lifecycle.  It manages its own UI, Open, Close and Login (submit) Events.
   * 
   * @param loginService - The Service that provides the critical access to the Login HTTP methods and endpoints.
   * @param formBuilder - Helps build and render Forms based UI and a 2-way binding of form controls and conponent variables
   * @param dialogRef - MatDialogRef:  Dialog class where the "Login Component (this)" will be rendered in a popup fashion.
   * @param data - LoginDialogData:  Most interesting.  This is optionally a set of data passed to the dialog to "seed" with initial values.  Normally, this is empty on teh first attempt.  However can contain residual values from the previous popup workflow.
   */
  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LoginDialogData
  ) { }


  loginErrorMessage = "";

  loginForm: FormGroup | null = null;

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    let form = {
      username: new FormControl({}, Validators.required),
      password: new FormControl({}, [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email])
    }

    let formState = {
      username: {
        value: this.data.username,
        disabled: false
      },
      password: {
        value: this.data.password,
        disabled: false
      },
      email: {
        value: this.data.email,
        disabled: false
      }
    }

    this.loginForm = this.formBuilder.group(form);
    this.loginForm.reset(formState);
  }

  onCancelClicked(): void {
    let returnData: LoginDialogData = {
      username: this.loginForm?.value.username,
      password: this.loginForm?.value.password,
      email: this.loginForm?.value.email,
      authToken: ''
    };
    this.dialogRef.close(returnData);
  }

  isFormValid() {
    return this.loginForm?.valid;
  }

  onSubmit() {
    /*    const loginButton = this.nativeElement?.querySelector("#submit_button");
        console.log(`login component loginButton = ${loginButton}`);
    console.log(`onSubmit: username : ${this.loginForm?.value.username}`);
    console.log(`onSubmit: password : ${this.loginForm?.value.password}`);
    console.log(`onSubmit: email : ${this.loginForm?.value.email}`);
    */
    this.loginService.loginSyncAndGetToken(this.loginForm?.value.username, this.loginForm?.value.password).subscribe(
      (resp) => {
        let authCode = resp.headers.get('Authorization');
        if (authCode) {
          this.loginService.getUserDetails(this.loginForm?.value.username, authCode).subscribe(
            (loggedinUser: LoggedinUser) => {
              let returnData: LoginDialogData = {
                username: this.loginForm?.value.username,
                password: this.loginForm?.value.password,
                email: this.loginForm?.value.email,
                authToken: authCode || '',
                loggedinUser: loggedinUser
              };
              this.dialogRef.close(returnData);
            });
        } else {
          this.loginErrorMessage = "Some really effedup.  Logged in successfully, however, no Auth Bearer Token."
        }
      },
      (error) => {
        if (error["status"] == 403) {
          // indicates login token expiry
//          console.error('Request failed Token Expired error');
          this.loginErrorMessage = "Invalid User/Password.  Try again."
        } else {
//          console.error('Request failed with error')
          this.loginErrorMessage = "Invalid User/Password.  Try again."
        }
      }
    );
  }
}
