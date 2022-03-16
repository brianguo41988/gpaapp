import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { mimeType } from "../../classes/classes-create/mime-type.validator";


@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  form: FormGroup;
  imagePreview: string; //convert image to url
  constructor (public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );

    this.form = new FormGroup({
      'fname': new FormControl(null, {
        validators: [Validators.required]}),
      'lname': new FormControl(null, {
        validators: [Validators.required]}),
      'email': new FormControl(null, {
            validators: [Validators.required]}),
      'password': new FormControl(null, {
            validators: [Validators.required]})
      //       ,
      // 'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
     });
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  // onSignup(form: NgForm){
  //   if (form.invalid){
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.authService.createUser(form.value.email, form.value.password, form.value.fname, form.value.lname);
  // }

  onSignup(){

    if (this.form.invalid){
      return;
    }

    this.isLoading = true;
    this.authService.createUser(this.form.value.email, this.form.value.password, this.form.value.fname, this.form.value.lname);
  }

  // onImagePicked(event: Event){
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({image: file});
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);
  // }
}
