import {Component, OnDestroy} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Class } from "../class.model";
import { ClassesService } from "../classes.service";
import { OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
@Component({
  selector: 'app-class-list',
  templateUrl: './classes-list.component.html',
  styleUrls: ['./classes-list.component.css']
})

export class ClassListComponent implements OnInit, OnDestroy {
  classes: Class[] = [];
  classesService: ClassesService;
  private classesSub: Subscription;
  isLoading = false;
  totalClasses = 0;
  classesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 7];

  constructor(classesService: ClassesService){
    this.classesService = classesService;
  };

  ngOnInit(){
    this.isLoading = true;
    this.classesService.getClasses(this.classesPerPage, this.currentPage);
    this.classesSub = this.classesService.getPostUpdateListener()
      .subscribe((classData: {courses: Class[], courseCount: number}) => {
        this.isLoading = false;
        this.totalClasses = classData.courseCount;
        this.classes = classData.courses;
      });
  }

  ngOnDestroy(): void {
      this.classesSub.unsubscribe();
  }

  onDelete(classId: string){
    this.isLoading = true;
    this.classesService.deletePost(classId).subscribe(() => {
      this.classesService.getClasses(this.classesPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent){
    // this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.classesPerPage = pageData.pageSize;
    this.classesService.getClasses(this.classesPerPage, this.currentPage);
  }

}
