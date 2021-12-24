import {Component, OnInit} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClassesService } from "../classes.service";
import { Class } from "../class.model"
import { ActivatedRoute, ParamMap } from "@angular/router";
import { viewClassName } from "@angular/compiler";
import { mimeType } from "./mime-type.validator";
@Component({
  selector: 'app-class-create',
  templateUrl: './classes-create.component.html',
  styleUrls: ['./classes-create.component.css']
})

export class ClassCreateComponent implements OnInit {
  classesService: ClassesService;
  classes: Class[] = [];
  route: ActivatedRoute;
  theclass: Class;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private classId: string;
  imagePreview: string; //convert image to url

  constructor (classesService: ClassesService, route: ActivatedRoute){
    this.classesService = classesService;
    this.route = route;
  }

  onSavePost(){
    if (this.form.invalid){
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create'){
      this.classesService.addPost(this.form.value.className, this.form.value.classWeight, this.form.value.classDes, this.form.value.image);
    }else{
      this.classesService.updatePost(this.classId, this.form.value.className, this.form.value.classWeight, this.form.value.classDes, this.form.value.image);
    }
    this.form.reset();

  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);



  }

  ngOnInit(): void {
   this.form = new FormGroup({
    'className': new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)]}),
    'classWeight': new FormControl(null, {
      validators: [Validators.required]}),
    'classDes': new FormControl(null, {
          validators: [Validators.required]}),
    'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
   });
   this.route.paramMap.subscribe((paramMap: ParamMap) => {
     if (paramMap.has('classId')){
      this.mode = 'edit';
      this.classId = paramMap.get('classId');
      this.isLoading = true; //spinner
      this.classesService.getClass(this.classId).subscribe(classData => {
        this.isLoading = false;
        this.theclass = {_id: classData._id, className: classData.className, classWeight: classData.classWeight, classDes: classData.classDes, imagePath: classData.imagePath};
        this.form.setValue({
          className: this.theclass.className,
          classWeight: this.theclass.classWeight,
          classDes: this.theclass.classDes,
          image: this.theclass.imagePath});
      });
     }else{
       this.mode = 'create';
       this.classId = null;
     }
   });
  }
}
