import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
  @api selectedBoatId;
  columns = [
    { label: 'Name', fieldName: 'Name', editable: 'true' },
    { label: 'Length', fieldName: 'Length__c', type: 'number' , editable: 'true'},
    { label: 'Price', fieldName: 'Price__c', type: 'currency' , editable: 'true'},
    { label: 'Description', fieldName: 'Description__c' , editable: 'true'},
  ];
  @api boatTypeId = '';
  @track boats;
  isLoading = false;
  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 
  @wire(getBoats, {boatTypeId: '$boatTypeId'}) wiredBoats(result) {
    this.boats = result;
 }
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) { 
    this.notifyLoading(true);
    // do something
    this.boatTypeId = boatTypeId;
    this.notifyLoading(false);
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  async refresh() {
    this.notifyLoading(true);
    // do something
    refreshApex(this.boats);
    this.notifyLoading(false);
   }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId=event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    const message={
        recordId: boatId
    };
    publish(this.messageContext, BOATMC, message);
  }
  
  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then(() => {
      const evt = new ShowToastEvent({
        title: SUCCESS_TITLE,
        message: MESSAGE_SHIP_IT,
        variant: SUCCESS_VARIANT,
      });
      this.dispatchEvent(evt);
      this.template.querySelector("lightning-datatable").draftValues = [];
      this.refresh ();

    })
    .catch(error => {
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT,
        message: error
      });
      this.dispatchEvent(evt);
    })
    .finally(() => {});

  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading){
      this.dispatchEvent(new CustomEvent('loading'));
    } else{
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}