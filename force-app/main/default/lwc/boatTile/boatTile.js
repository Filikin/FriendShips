// imports
import { LightningElement, api, wire } from 'lwc';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS  = 'tile-wrapper';
export default class BoatTile extends LightningElement {
    @api boat;
    @api selectedBoatId;
    subscription = null;
    
    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
  
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return "background-image:url('"+this.boat.Picture__c+"')";
     }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        if (this.selectedBoatId == this.boat.Id){
            return TILE_WRAPPER_SELECTED_CLASS;
        } else {
            return TILE_WRAPPER_UNSELECTED_CLASS;
        }
     }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        this.selectedBoatId=this.boat.Id;
        if (this.selectedBoatId == this.boat.Id){
            const selectEvent=new CustomEvent('boatselect', {detail : {boatId : this.boat.Id}});
            this.dispatchEvent(selectEvent);
        }
     }
  
     subscribeMC() {
        if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => {
                this.selectedBoatId = message.recordId},
            { scope: APPLICATION_SCOPE }
        );
      }
    }
    // Runs when component is connected, subscribes to BoatMC
    connectedCallback() {
      // recordId is populated on Record Pages, and this component
      // should not update when this component is on a record page.
      if (this.subscription || this.recordId) {
        return;
      }
      // Subscribe to the message channel to retrieve the recordID and assign it to boatId.
      this.subscribeMC();
    }
}