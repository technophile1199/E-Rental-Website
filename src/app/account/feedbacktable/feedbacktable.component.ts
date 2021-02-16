import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subscription } from 'rxjs';
import { FeedbackServiceService } from './shared/feedback-service.service';

@Component({
  selector: 'app-feedbacktable',
  templateUrl: './feedbacktable.component.html',
  styleUrls: ['./feedbacktable.component.scss']
})
export class FeedbacktableComponent implements OnInit {

  private productSubscription: Subscription;
  public items: Observable<any>;

  constructor(
    private angularFireDatabase: AngularFireDatabase,
      private sellerService: FeedbackServiceService
  ) { 
    //this.items=this.angularFireDatabase.list('/Feedback').valueChanges();
      this.productSubscription=this.sellerService
      .getItem()
      .subscribe(items  => {
        this.items=items.reverse();
        console.log(items);
      }
    );
  }

  ngOnInit() {
    
  }

}
