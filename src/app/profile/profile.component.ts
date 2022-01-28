import {Component, OnInit, OnDestroy} from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";
import { ClassesService } from "../classes/classes.service";
@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  GPA: number;
  private userSub: Subscription;
  private gpaSub: Subscription;

  constructor(private authService: AuthService, private classesService: ClassesService,){
  };

  ngOnInit(){
    this.userId = this.authService.getUserId();

    this.authService.getUser(this.userId);
    // console.log(this.userId +  "USER ID");
    this.userSub = this.authService.getUserUpdatedAsObservable()
      .subscribe((classData: {email: string, fname: string, lname: string}) => {
        this.fname = classData.fname;
        this.lname = classData.lname;
        this.email = classData.email;
      });

  this.classesService.getClassesForGPA(this.userId);

  this.gpaSub = this.classesService.getGpaUpdatedAsObverable()
      .subscribe((gpaData: {GPA: number}) => {
        this.GPA = gpaData.GPA;
      });

  console.log(this.classesService.getGPA() + " this");

  }

  ngOnDestory() {
    this.gpaSub.unsubscribe();
    this.userSub.unsubscribe();
  }
// SUPER IMPORTANT NEED SUBSCRIPTION AND UPDATE OBSERVABLE FOR FETECHING AND STUFF
}
