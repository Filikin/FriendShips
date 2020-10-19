import { LightningElement, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

 // imports
 export default class BoatSearch extends LightningElement {
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
    searchBoats(event) { }
    
    createNewBoat() { }

   @wire(getBoats) boats({ error, data }) {
      if (data) {
      } else if (error) {
         this.searchOptions = undefined;
         this.error = error;
      }
   }
   
  }