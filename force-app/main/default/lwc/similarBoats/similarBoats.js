// imports
import { LightningElement, wire, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// import getSimilarBoats
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';

export default class SimilarBoats extends LightningElement {
    // Private
    currentBoat;
    @track relatedBoats;
    boatId;
    error;
    
    // public
    @api
    get recordId() {
        // returns the boatId
        alert (this.boatId);
        return this.boatId;
      }
      set recordId(value) {
          // sets the boatId value
          this.boatId = value;
          // sets the boatId attribute
          this.setAttribute('boatId', value); // not sure of the point of this
        }
    
    // public
    @api similarBy;
    
    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire (getSimilarBoats, {boatd: '$boatd', similarBy: '$similarBy'})
    similarBoats({ error, data }) { 
      if (data) {
        alert (data);
        this.relatedBoats = data;
      } else if (error) {
        alert (error);
        this.relatedBoats = undefined;
        this.error = error;
      }
    }
    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.target.dataset.recordId, 
            objectApiName: 'Boat__c', // objectApiName is optional
            actionName: 'view'
        }
      });
    }
  }