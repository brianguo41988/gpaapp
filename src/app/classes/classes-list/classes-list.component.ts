import {Component, OnDestroy} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Class } from "../class.model";
import { ClassesService } from "../classes.service";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";
@Component({
  selector: 'app-class-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})

export class ClassListComponent implements OnInit, OnDestroy {
  classes: Class[] = [];
  classesService: ClassesService;
  private authStatusSub: Subscription;
  private classesSub: Subscription;
  userIsAuthenticated = false;
  isLoading = false;
  totalClasses = 0;
  classesPerPage = 120;
  currentPage = 1;
  pageSizeOptions = [4];
  userId:string;
  nom:string;

  constructor(classesService: ClassesService, private authService: AuthService){
    this.classesService = classesService;
  };

  ngOnInit(){
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    // if user does not login classes will not show
    if (!this.userId){
      this.isLoading = false;
      return;
    }

    this.classesService.getClasses(this.classesPerPage, this.currentPage, this.userId);
    console.log(this.userId +  "USER ID");
    this.classesSub = this.classesService.getPostUpdateListener()
      .subscribe((classData: {courses: Class[], courseCount: number}) => {
        this.isLoading = false;
        this.totalClasses = classData.courseCount;
        // for loop that check to see if userId is correct to show correct classes
        // for (var i = 0; i < this.totalClasses; i++){
          // if (classData.courses[i].creator == this.userId){
          //   this.classes.push(classData.courses[i]);
          // }
        // }

        this.classes = classData.courses;

      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(
        isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        }
      );
        // this.authService.getFname();
        // console.log(this.classes.length);
  }

  ngOnDestroy(): void {
    if (!this.userId){
      return;
    }
      this.classesSub.unsubscribe();
      this.authStatusSub.unsubscribe();
      this.classes = [];
  }

  onDelete(classId: string){
    this.isLoading = true;
    this.classesService.deletePost(classId).subscribe(() => {
      this.classesService.getClasses(this.classesPerPage, this.currentPage, this.userId);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.classesPerPage = pageData.pageSize;
    this.classesService.getClasses(this.classesPerPage, this.currentPage, this.userId);
  }

}
