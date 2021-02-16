import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { AuthService } from '../shared/auth.service';

import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { Seller } from '../../models/seller.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authSubscription: Subscription;
  public formProfile: FormGroup;
  public profileErrors: string;
  private user: User;
  public formSeller: FormGroup;
  public userSubscription: Subscription;
  public seller: Seller;

  constructor(private authService: AuthService , private modalService: NgbModal, private firestore: AngularFirestore,public router: Router ) { }

  openBackDropCustomClass(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {
    this.initFormGroup();
    this.authSubscription = this.authService.user.subscribe(
      user => {
        if (user) {
          this.formProfile.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          });
          this.user = user;
        }
      }
    );
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  private initFormGroup() {
    this.formProfile = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.email),
      password: new FormControl(null),  
      confirmPassword: new FormControl(null)
    });
    this.formSeller = new FormGroup({
      /*id: new FormControl(
        {
          value: this.createId(),
          disabled: true
        },
        [Validators.required, Validators.min(0)]
      ),*/
      //id: new FormControl(null,Validators.email),
      name:new FormControl(null,Validators.required),
      email2: new FormControl(null,Validators.email),
      location: new FormControl(null,Validators.required),
    });
  }

  public onSubmit2() {
    console.log("Inside");
    this.firestore.collection('Users').doc(firebase.auth().currentUser.uid).update({
      roles: {
        admin:false,
        Seller:true
      }
    });
    /*return firebase.database().ref(`\seller`).update({
      id:this.formSeller.value.id,
      name:this.formSeller.value.name,
      email:this.formSeller.value.email2,
      location:this.formSeller.value.location
    });*/
    let id = Math.floor(Math.random() * new Date().getTime());
    firebase.database().ref('\seller').child(id.toString()).set({
      id:id.toString(),
      name:this.formSeller.value.name,
      email:this.formSeller.value.email2,
      location:this.formSeller.value.location
    }).then(
      ()=>{
        alert('Congratulations Now You Can Rent Your Products!!!!');
        this.router.navigate(['/home']);
      }
    );    
  }

  public onSubmit() {

    // Update Email
    if (this.user.email !== this.formProfile.value.email) {
      this.authService.updateEmail(this.formProfile.value.email)
      .catch(
        error => {
          this.profileErrors = error.message;
          this.formProfile.patchValue({ email: this.user.email });
        }
      );
    }

    // Update Profile (Firstname, Lastname)
    if (this.user.firstName !== this.formProfile.value.firstName || this.user.lastName !== this.formProfile.value.lastName) {
      this.authService.updateProfile(this.formProfile.value);
    }

    // Update password
    if (this.formProfile.value.password && this.formProfile.value.confirmPassword
      && (this.formProfile.value.password === this.formProfile.value.confirmPassword)) {
      this.authService.updatePassword(this.formProfile.value.password)
      .catch(
        error => {
          this.profileErrors = error.message;
        }
      );
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
