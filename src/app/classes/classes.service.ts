import { Injectable } from '@angular/core';
import { Subject }from 'rxjs';
import { Class } from './class.model'
import { HttpClient }  from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router"
@Injectable({providedIn: 'root'}) // makes it where there is only one instance of this class

export class ClassesService {
  private classes: Class[] = [];
  private classesUpdated = new Subject<Class[]>();
  private router: Router;
  constructor(private http: HttpClient, router: Router) {
    this.router = router;
  }

  getClasses(classesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${classesPerPage}&page=${currentPage}`;
    //classesData is what is recieved from the request
    this.http.get<{message: string, classes: any}>('http://localhost:3000/api/classes' + queryParams)
    .pipe(
      map(classData => {
        return classData.classes.map(c => {
          return {
            _id: c._id,
            className: c.className,
            classWeight: c.classWeight,
            classDes: c.classDes,
            imagePath: c.imagePath
          };
        });
      })
    )
    .subscribe(transformedClasses => {
      this.classes = transformedClasses;
      this.classesUpdated.next([...this.classes]);
    });
    // return this.classes;
  }

  getPostUpdateListener(){
   return this.classesUpdated.asObservable();
  }

  getClass(id: string){
    return this.http.get<{_id: string, className: string, classWeight: string, classDes: string, imagePath:string}>("http://localhost:3000/api/classes/" + id);
  }

  addPost(name: string, weight: string, des: string, image: File){
    const cData = new FormData();
    cData.append("className", name);
    cData.append("classWeight", weight);
    cData.append("classDes", des);
    cData.append("image", image, name);
    this.http.post<{message: string, addedClass: Class}>('http://localhost:3000/api/classes', cData) // "make sure added class is the same name in models.class.js"
    .subscribe((responseData) => {
      const addedClass: Class = {_id: responseData.addedClass._id, className: name, classWeight: weight, classDes: des, imagePath: responseData.addedClass.imagePath};
      // const id = responseData.classId;
      // addedClass._id = id;
      this.classes.push(addedClass);
      this.classesUpdated.next(this.classes);
      this.router.navigate(["/"]);
    });


  }

  deletePost(classId: string) {
    this.http.delete("http://localhost:3000/api/classes/" + classId).subscribe(() => {
      const updatedClasses = this.classes.filter(classa => classa._id !== classId);
        this.classes = updatedClasses;
        this.classesUpdated.next(this.classes);
    });
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
        imagePath: image
      }
    }
    this.http.put("http://localhost:3000/api/classes/" + id, clData)
    .subscribe(response => {
      const updatedClasses = [...this.classes];
      const oldClassIndex = updatedClasses.findIndex(c => c._id === id);
      const updatedClass: Class = {_id: id, className: className, classWeight: classWeight, classDes: classDes, imagePath: ""};
      updatedClasses[oldClassIndex] = updatedClass;
      this.classes = updatedClasses;
      this.classesUpdated.next([...this.classes]);
      this.router.navigate(["/"]);
    });
  }
}
