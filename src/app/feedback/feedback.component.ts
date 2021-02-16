import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Feedback } from '../models/feedback.model';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

export class FeedbackComponent implements OnInit {

  public productForm: FormGroup;
  public feedback: Feedback;

  constructor(private router:Router) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm () {
    this.productForm = new FormGroup({
      name: new FormControl(null,Validators.required),
      date: new FormControl( {
        value: this.feedback && this.feedback.date,
        disabled:false
      },
      [Validators.required]
      ),
      description: new FormControl(null,Validators.required),
      email: new FormControl(null,Validators.required)
    });
  }
   public onSubmit() {
     console.log("feedback");
     firebase.database().ref('\Feedback').child(firebase.auth().currentUser.uid).set({
        name: this.productForm.value.name,
        date: this.productForm.value.date,
        description: this.productForm.value.description,
        email:this.productForm.value.email
     }).then(
       () => {
         alert("Feedback Provided!!");
         this.router.navigate(['/home']);
       });
   }
}
