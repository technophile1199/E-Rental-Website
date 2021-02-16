import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable ,  of } from 'rxjs';
import { take ,  takeUntil ,  switchMap, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { MessageService } from '../../messages/message.service';
import { User, Roles } from '../../models/user.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';

@Injectable()
export class AuthService {
  private cartItems: CartItem[]
  public user: Observable<User>;
  public data1:any;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private messageService: MessageService,
    private afs: AngularFirestore,
    private router:Router
  ) {
    this.cartItems=[];
    this.user = this.afAuth.authState
      .pipe(
        switchMap((auth) => {
          if (auth) {
            return this.afs.doc<User>('Users/' + auth.uid).valueChanges()
              .pipe(
                map(user => {
                  return {
                    ...user,
                    uid: auth.uid
                  };
                })
              );
          } else {
            return of(null);
          }
        })
      );

  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider).then(
      (credential) => {
        this.messageService.add('Login successful!');
        this.router.navigate(['/home']);
        const userRef: AngularFirestoreDocument<any> = this.afs.doc<User>(`Users/${credential.user.uid}`);
        const data: User = {
          displayName: credential.user.displayName,
          email: credential.user.email,
          photoURL: credential.user.photoURL,
          roles: {
            admin: false,
            Seller:false
          },
          uid:credential.user.uid
        }
        return userRef.set(data, { merge: true })
        },
        (error) => {
          throw error;
        }
      );
  }

  public emailSignUp(email: string, password: string, FirstName: string, LastName: string, PhoneNumber: Number) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (credential) => {
          this.updateNewUser(credential.user,password,FirstName,LastName,PhoneNumber);
          this.sendEmailVerification();
        },
        (error) => {
          throw error;
        }
      );
  }

  public sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }

  emailLogin(email: string, password: string) {
    var email_user=firebase.auth().currentUser;
    if(email_user!=null) {
      var email_verification=email_user.emailVerified;
      if(email_verification) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
          console.log(error);
          email_verification=email_user.emailVerified;
        });
      }
      else {
        this.messageService.addError('Please Verify Email');
        console.log(email_verification);
        email_verification=email_user.emailVerified;
      }
    }
    else{
      return this.afAuth.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
        this.route.navigate['/register-login']; 
        console.log(error);
      });
    }
    email_verification=email_user.emailVerified;
    /*then(
      (credential) => {
        this.updateNewUser(credential.user);
      },
      (error) => {
        console.error("Error 2: "+error);
        throw error;
      }
    );*/
  }

  public signOut() {
    this.afAuth.auth.signOut();
    this.messageService.add('You have been logged out.');
    //this.cartItems=[];
  }

  public updateProfile(userData: User) {
    this.updateExistingUser(userData);
    this.messageService.add('User profile has been updated!');
  }

  public updatePassword(password: string) {
    return this.afAuth.auth.currentUser
      .updatePassword(password)
      .then(() => {
        this.updateExistingUser({password: password});
        this.messageService.add('Password has been updated!');
      })
      .catch(function(error) {
        throw error;
      });
  }

  public updateEmail(email: string) {
    return this.afAuth.auth.currentUser
      .updateEmail(email)
      .then(() => {
        this.updateExistingUser({ email: email });
        this.messageService.add('User email have been updated!');
      })
      .catch(function(error) {
        throw error;
      });
  }

  private updateNewUser(authData, password: string, FirstName: string, LastName: string, PhoneNumber: Number) {
    /*const userData = new User(authData);
    const ref = this.afs.doc<User>('Users/' + authData.uid);
    ref
      .valueChanges()
      .pipe(
        take(1)
      )
      .subscribe((user) => {
        if (!user) {
          ref.update(user);
        }
      });*/

      const userRef: AngularFirestoreDocument<any> = this.afs.doc<User>(`Users/${authData.uid}`);
      const data: User = {
        firstName: FirstName,
        lastName: LastName,
        email: authData.email,
        password: password,
        phoneNumber: PhoneNumber,
        displayName: FirstName+" "+LastName,
        roles: {
          admin: false,
          Seller:false
        },
        uid:authData.uid
    }
    return userRef.set(data, { merge: true })

  }

  private updateExistingUser(userData) {
    const currentUser = this.afAuth.auth.currentUser;
    const ref = this.afs.doc<User>(`Users/${currentUser.uid}`);
    ref
      .valueChanges()
      .pipe(
        take(1)
      )
      .subscribe((user) => {
        ref.update(userData);
      });
  }
}