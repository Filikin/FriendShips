// imports
import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import boatReviewsList from '@salesforce/apex/BoatDataService.getAllReviews';

const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    boatReviews = null;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change
    @api 
    get recordId() {
      return this.boatId;
     }
    set recordId(value) {
      //sets boatId attribute
      //sets boatId assignment
      //get reviews associated with boatId
      this.setAttribute('boatId', value);
      this.boatId = value;
      this.getReviews();
    }
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
      if (this.boatReviews == null || this.boatReviews == undefined || this.boatReviews.length === 0){
        return false;
      } else {
        return true;
      }
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() { 
      this.getReviews();
    }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() {
      if (this.boatId == null){
        return;
      } 
      this.isLoading = true;
      boatReviewsList({boatId: this.boatId})
      .then(result => {
        this.boatReviews = result;
      })
      .catch (error => {
          const evt = new ShowToastEvent({
            title: ERROR_TITLE,
            variant: ERROR_VARIANT,
            message: error.message
          });
          this.dispatchEvent(evt);
        }
      )
      this.isLoading = false;
     }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.target.dataset.recordId, // review from event id?
            objectApiName: 'User', // objectApiName is optional
            actionName: 'view'
        }
    });

    }
  }
  