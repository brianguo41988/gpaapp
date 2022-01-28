import { Injectable } from '@angular/core';
import { Subject }from 'rxjs';
import { Class } from './class.model'
import { HttpClient }  from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router"
@Injectable({providedIn: 'root'}) // makes it where there is only one instance of this class

export class ClassesService {
  private classes: Class[] = [];
  private classesUpdated = new Subject<{courses: Class[]; courseCount: number}>();
  private gpaUpdated = new Subject<{GPA: number}>();
  private router: Router;
  private GPA = 0.0;
  constructor(private http: HttpClient, router: Router) {
    this.router = router;
  }

  getGPA(){
    this.GPA;
  }

  getGpaUpdatedAsObverable(){
    return this.gpaUpdated.asObservable();
  }

  getClassesForGPA(userId: string) {
    this.GPA = 0.0;
    const queryParams = `?uid=${userId}`;
    this.http.get<{message: string, classes: any}>('http://localhost:3000/api/classes' + queryParams).subscribe(transformedClassesData => {
      var total = 0;

      for (var i = 0; i < transformedClassesData.classes.length; i++){
        total += Number(transformedClassesData.classes[i].classWeight);
      }
      for (var i = 0; i < transformedClassesData.classes.length; i++){
        var factor = 0.0;
        if (transformedClassesData.classes[i].classDes == "A" || transformedClassesData.classes[i].classDes == "a" ){
          factor = 4.0;
        } else if (transformedClassesData.classes[i].classDes == "A-" || transformedClassesData.classes[i].classDes == "a-" ){
          factor = 3.7;
        } else if (transformedClassesData.classes[i].classDes == "B+" || transformedClassesData.classes[i].classDes == "b+" ){
          factor = 3.3;
        } else if (transformedClassesData.classes[i].classDes == "B" || transformedClassesData.classes[i].classDes == "b" ){
          factor = 3.0;
        } else if (transformedClassesData.classes[i].classDes == "B-" || transformedClassesData.classes[i].classDes == "b-"){
          factor = 2.7;
        } else if (transformedClassesData.classes[i].classDes == "C+" || transformedClassesData.classes[i].classDes == "c+"){
          factor = 2.3;
        } else if (transformedClassesData.classes[i].classDes == "C" || transformedClassesData.classes[i].classDes == "c"){
          factor = 2.0;
        } else if (transformedClassesData.classes[i].classDes == "C-" || transformedClassesData.classes[i].classDes == "c-"){
          factor = 1.7;
        } else if (transformedClassesData.classes[i].classDes == "D+" || transformedClassesData.classes[i].classDes == "d+"){
          factor = 1.3;
        } else if (transformedClassesData.classes[i].classDes == "D" || transformedClassesData.classes[i].classDes == "d"){
          factor = 1.0;
        } else if (transformedClassesData.classes[i].classDes == "F" || transformedClassesData.classes[i].classDes == "f"){
          factor = 0.0;
        } else {
          console.log("Unrecogized Grade");
        }


        this.GPA += (Number(transformedClassesData.classes[i].classWeight) / total) * factor;
      }
      console.log(this.GPA + "this is gpa");
      this.gpaUpdated.next({
        GPA: this.GPA
      });
    });
  }

  getClasses(classesPerPage: number, currentPage: number, userId: string) {
    const queryParams = `?pagesize=${classesPerPage}&page=${currentPage}&uid=${userId}`;
    //classesData is what is recieved from the request
    this.http.get<{message: string, classes: any, maxPosts: number}>('http://localhost:3000/api/classes' + queryParams)
    .pipe(
      map(classData => {
        return { courses: classData.classes.map(c => {
          return {
            _id: c._id,
            className: c.className,
            classWeight: c.classWeight,
            classDes: c.classDes,
            imagePath: c.imagePath,
            creator: c.creator
          };
        }), maxPosts: classData.maxPosts};
      })
    ) //transofrmed classes data is the result of ^
    .subscribe(transformedClassesData => {

      // var total = 0;
      // var GPA = 0.0;

      // for (var i = 0; i < transformedClassesData.courses.length; i++){
      //   total += Number(transformedClassesData.courses[i].classWeight);
      // }
      // for (var i = 0; i < transformedClassesData.courses.length; i++){
      //   var factor = 0.0;
      //   if (transformedClassesData.courses[i].classDes == "A" || transformedClassesData.courses[i].classDes == "a" ){
      //     factor = 4.0;
      //   } else if (transformedClassesData.courses[i].classDes == "A-" || transformedClassesData.courses[i].classDes == "a-" ){
      //     factor = 3.7;
      //   } else if (transformedClassesData.courses[i].classDes == "B+" || transformedClassesData.courses[i].classDes == "b+" ){
      //     factor = 3.3;
      //   } else if (transformedClassesData.courses[i].classDes == "B" || transformedClassesData.courses[i].classDes == "b" ){
      //     factor = 3.0;
      //   } else if (transformedClassesData.courses[i].classDes == "B-" || transformedClassesData.courses[i].classDes == "b-"){
      //     factor = 2.7;
      //   } else if (transformedClassesData.courses[i].classDes == "C+" || transformedClassesData.courses[i].classDes == "c+"){
      //     factor = 2.3;
      //   } else if (transformedClassesData.courses[i].classDes == "C" || transformedClassesData.courses[i].classDes == "c"){
      //     factor = 2.0;
      //   } else if (transformedClassesData.courses[i].classDes == "C-" || transformedClassesData.courses[i].classDes == "c-"){
      //     factor = 1.7;
      //   } else if (transformedClassesData.courses[i].classDes == "D+" || transformedClassesData.courses[i].classDes == "d+"){
      //     factor = 1.3;
      //   } else if (transformedClassesData.courses[i].classDes == "D" || transformedClassesData.courses[i].classDes == "d"){
      //     factor = 1.0;
      //   } else if (transformedClassesData.courses[i].classDes == "F" || transformedClassesData.courses[i].classDes == "f"){
      //     factor = 0.0;
      //   } else {
      //     console.log("Unrecogized Grade");
      //   }


      //   GPA += (Number(transformedClassesData.courses[i].classWeight) / total) * factor;
      // }

      this.classes = transformedClassesData.courses;
      this.classesUpdated.next({
        courses: [...this.classes],
        courseCount: this.GPA});
    });

    // console.log(this.classes);
    // return this.classes;
  }

  getPostUpdateListener(){
   return this.classesUpdated.asObservable();
  }

  getClass(id: string){
    return this.http.get<{_id: string, className: string, classWeight: string, classDes: string, imagePath:string, creator: string}>("http://localhost:3000/api/classes/" + id);
  }

  addPost(name: string, weight: string, des: string, image: File){
    const cData = new FormData();
    cData.append("className", name);
    cData.append("classWeight", weight);
    cData.append("classDes", des);
    cData.append("image", image, name);
    this.http.post<{message: string, addedClass: Class}>('http://localhost:3000/api/classes', cData) // "make sure added class is the same name in models.class.js"
    .subscribe((responseData) => {
      // const addedClass: Class = {_id: responseData.addedClass._id, className: name, classWeight: weight, classDes: des, imagePath: responseData.addedClass.imagePath};
      // // const id = responseData.classId;
      // // addedClass._id = id;
      // this.classes.push(addedClass);
      // this.classesUpdated.next(this.classes);
      this.router.navigate(["/"]);
    });
  }

  deletePost(classId: string) {
    return this.http.delete("http://localhost:3000/api/classes/" + classId);
    // .subscribe(() => {
    //   const updatedClasses = this.classes.filter(classa => classa._id !== classId);
    //     this.classes = updatedClasses;
    //     this.classesUpdated.next(this.classes);
    // });
  }

  updatePost(id: string, className: string, classWeight: string, classDes: string, image: File | string){
    let clData: Class | FormData;
    if (typeof(image) === 'object'){
      clData = new FormData();
      clData.append("_id", id);
      clData.append("className", className);
      clData.append("classWeight", classWeight);
      clData.append("classDes", classDes);
      clData.append("image", image, className);
    } else {
      clData = {
        _id: id,
        className: className,
        classWeight: classWeight,
        classDes: classDes,
        imagePath: image,
        creator: null // creator id is handled on the server side in routes/classes in updatedClasses
      }
    }
    this.http.put("http://localhost:3000/api/classes/" + id, clData)
    .subscribe(response => {
      // const updatedClasses = [...this.classes];
      // const oldClassIndex = updatedClasses.findIndex(c => c._id === id);
      // const updatedClass: Class = {_id: id, className: className, classWeight: classWeight, classDes: classDes, imagePath: ""};
      // updatedClasses[oldClassIndex] = updatedClass;
      // this.classes = updatedClasses;
      // this.classesUpdated.next([...this.classes]);
      this.router.navigate(["/"]);
    });
  }
}
