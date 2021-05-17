import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-subscription-component',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
/**
 * Parent class for any component that is going to have subscriptions,
 * to make sure they get cleaned up when component is destroyed.
 *
 * Using observables directly with async pipes in the tempate would do the same thing
 * (the subscriptions automatically get cleaned up), but async pipes make debugging really annoying
 * if anything is wrong with your subscription
 */
export class SubscriptionComponent implements OnDestroy {

  subscriptions: Array<Subscription> = [];

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
