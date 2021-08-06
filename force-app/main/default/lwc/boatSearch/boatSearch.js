import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

 // imports
 export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    // Handles loading event
    handleLoading() {
        this.isLoading=true;
     }
    
    // Handles done loading event
    handleDoneLoading() {
        this.isLoading=false;
     }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
      this.template.querySelector('c-boat-search-results').searchBoats(event.detail.boatTypeId);
   }
    
    createNewBoat() {
      this[NavigationMixin.Navigate]({
         type: 'standard__objectPage',
         attributes: {
             objectApiName: 'Boat__c',
             actionName: 'new'
         }
     });
   }

   @wire(getBoats) boats({ error, data }) {
      if (data) {
         this.template.querySelector('c-boat-search-results').wiredBoats({error, data});
      } else if (error) {
         this.searchOptions = undefined;
         this.error = error;
      }
   }
   
  }