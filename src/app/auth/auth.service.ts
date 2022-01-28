import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router"
import { TOUCH_BUFFER_MS } from "@angular/cdk/a11y/input-modality/input-modality-detector";

@Injectable ({ providedIn: "root"})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  private fname: string;
  private lname: string;
  private email: string;
  private userUpdated = new Subject<{email: string; fname: string; lname: string;}>();
  constructor (private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getFname() {
    console.log(this.fname);
    return this.fname;
  }

  getLname() {
    return this.lname;
  }

  getEmail() {
    return this.email;
  }

  getUser(userId: string) {
    const queryParams = `?uid=${userId}`;
    // console.log("hi");
    //classesData is what is recieved from the request
    this.http.get<{message: string, classes: any}>('http://localhost:3000/api/user/signup' + queryParams).subscribe(response => {
      this.lname = response.classes[0].lname;
      this.fname = response.classes[0].fname;
      this.email = response.classes[0].email;
      this.userUpdated.next({
        email: this.email,
        fname: this.fname,
        lname: this.lname });
      // console.log(response);
    });

    console.log(this.fname);
  }

  getUserUpdatedAsObservable() {
    return this.userUpdated.asObservable();
  }

  createUser(email: string, password: string, fname: string, lname: string) {
    const authData: AuthData = {email: email, password: password, fname: fname, lname: lname};
    return this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(() => {
      this.router.navigate(["/"]);
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string){
    const authData  = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>("http://localhost:3000/api/user/login", authData)
    .subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(token, expirationDate, this.userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();

    if (!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);

    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null; // SETTING USER ID TO NULL MAYBE HUH?
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration:number){
    console.log("Setting timer:" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
