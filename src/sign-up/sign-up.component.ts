import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../app/core/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  password = '';
  passwordRepeat = '';
  username = '';
  email = '';
  apiProgress = false;
  signUpSuccess = false;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
  }

  onChangePassword(event:Event): void{
    this.password = (event.target as HTMLInputElement).value;

  }
  onChangePasswordRepeat(event:Event): void{
    this.passwordRepeat = (event.target as HTMLInputElement).value;
  }

  onChangeUserName(event:Event): void{
    this.username = (event.target as HTMLInputElement).value;

  }
  onChangeEmail(event:Event): void{
    this.email = (event.target as HTMLInputElement).value;
  }

  isDisabled(): boolean{
    return this.password? this.password !== this.passwordRepeat: true
  }

  onClickSignUp(event:Event):void {
    console.log("Clicked button");
    // fetch('api/1.0/users', {
    //   method: 'POST',
    //   body: JSON.stringify({username: this.username,password: this.password, email: this.email}),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });
    this.apiProgress = true;
   this.userService.signUp({
    username: this.username,
      email: this.email,
      password: this.password
   }).subscribe(()=>{
      this.signUpSuccess = true;
    })
  }

}
