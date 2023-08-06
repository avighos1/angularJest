import { AlertComponent } from './../app/shared/alert/alert.component';
import {render,screen, waitFor} from "@testing-library/angular";
import { SignUpComponent } from "./sign-up.component";
import userEvent from "@testing-library/user-event";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import "whatwg-fetch";
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {rest} from "msw";
import {setupServer} from "msw/node";
import { HttpClientModule } from "@angular/common/http";

import { ButtonComponent } from './../app/shared/button/button.component';
import { SharedModule } from './../app/shared/shared.module';


let requestBody: any;
//set up Mock service worker.
let counter = 0;
const server = setupServer(
  rest.post('/api/1.0/users', (req,res,ctx)=>{
    counter+=1;
    requestBody = req.body
    return res(ctx.status(200), ctx.json({}));
  })
);

/**
 * Exedcute before each test
 */
beforeEach(()=> {
  counter = 0;
});


beforeAll(()=> server.listen());

afterAll(()=>server.close());


const setup = async () => {
    await render(SignUpComponent, {
      imports: [HttpClientModule,SharedModule],
    });
}

describe('SignUpComponent',() => {
  describe('Layout specific Tests', ()=> {
    it('has Sign Up Header', async() => {
      await setup();
      const header = screen.getByRole('heading', {name: 'Sign Up'});
      expect(header).toBeInTheDocument();
    });
    it('has User Name Input', async ()=> {
      await setup();
      expect(screen.getByLabelText('UserName')).toBeInTheDocument();
    });
    it('has Email Input', async ()=> {
      await setup();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
    it('has Password Input', async ()=> {
      await setup();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
    it('has Password Type for Password input', async ()=> {
      await setup();
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('has Password Repeat Input', async ()=> {
      await setup();
      expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument();
    });
    it('has Password Type for Password repeast input', async ()=> {
      await setup();
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toHaveAttribute('type', 'password');
    });
    it('has Sign Up Button', async() => {
      await setup();
      const button = screen.getByRole('button', {name: 'Sign Up'});
      expect(button).toBeInTheDocument();
    });
    it('disables the the button initially ', async() => {
      await setup();
      const button = screen.getByRole('button', {name: 'Sign Up'});
      expect(button).toBeDisabled();
    });
  });
  describe('Interactions specific Tests', ()=> {
    let button:any;
    const setUpForm = async() =>{
      await setup();
      const username = screen.getByLabelText('UserName');
      const email = screen.getByLabelText('Email');
      const password = screen.getByLabelText('Password');
      const passwordrepeat = screen.getByLabelText('Password Repeat');
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user2@gmail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordrepeat, "P4ssword");
      button = screen.getByRole('button', {name: 'Sign Up'});
    }

    it('Enables button when password and password repeat has same value', async()=>{
      await setup();
      const password = screen.getByLabelText('Password');
      const passwordrepeat = screen.getByLabelText('Password Repeat');
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordrepeat, "P4ssword");
      const button = screen.getByRole('button', {name: 'Sign Up'});
      expect(button).toBeEnabled();
    });
    it('Sends username,email and password to Server', async()=>{
      //const spy = jest.spyOn(window, 'fetch');

      await setUpForm();
      //let httpTestingController = TestBed.inject(HttpTestingController);
      // const username = screen.getByLabelText('UserName');
      // const email = screen.getByLabelText('Email');
      // const password = screen.getByLabelText('Password');
      // const passwordrepeat = screen.getByLabelText('Password Repeat');
      // await userevent.type(username, "user1");
      // await userevent.type(email, "user1@gmail.com");
      // await userevent.type(password, "P4ssword");
      // await userevent.type(passwordrepeat, "P4ssword");
      // const button = screen.getByRole('button', {name: 'Sign Up'});
      await userEvent.click(button);
      //call history of the function
      // const args = spy.mock.calls[0];
      // const secondParams = args[1] as RequestInit;
      // expect(secondParams.body).toEqual(JSON.stringify({
      //   username: "user1",
      //   password: "P4ssword",
      //   email: "user1@gmail.com"
      // }))
      // const req = httpTestingController.expectOne("api/1.0/users");
      // const requestBody = req.request.body;
      // expect(requestBody).toEqual({
      //   username: "user1",
      //   password: "P4ssword",
      //   email: "user1@gmail.com"
      // });

      await waitFor(()=>{
        expect(requestBody).toEqual({
          username: "user1",
          password: "P4ssword",
          email: "user2@gmail.com"
       });
      });
    });

    it('Disables button when there is an ongoing api call ', async()=>{
      await setUpForm();
      await userEvent.click(button);
      await userEvent.click(button);
      await waitFor(()=>{
        expect(counter).toBe(1);
      });
    });

    it('Availability of spinner after click of submit ', async()=>{
      await setUpForm();
      // Use query by role in case the element is hidden initially else can use getbyrole
      expect(screen.queryByRole("status", { hidden:true} )).not.toBeInTheDocument();
      await userEvent.click(button);
      expect(screen.queryByRole("status", { hidden:true} )).toBeInTheDocument();
    });

    it('Displays account activation notification after successul sign up', async()=>{
      await setUpForm();
      expect(screen.queryByText('Please check your email to activate your account')).not.toBeInTheDocument();
      await userEvent.click(button);
      const text = await screen.findByText('Please check your email to activate your account');
      expect(text).toBeInTheDocument();

    });
    it('Displays account activation notification after successul sign up', async()=>{
      await setUpForm();
      const form = screen.getByTestId('form-sign-up');
      await userEvent.click(button);
      await screen.findByText('Please check your email to activate your account');
      expect(form).not.toBeInTheDocument();

    });
});
});
