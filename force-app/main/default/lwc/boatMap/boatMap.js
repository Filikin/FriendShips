import { LightningElement, wire, api, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
// import BOATMC from the message channel
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

// Declare the const LONGITUDE_FIELD for the boat's Longitude__s
const LONGITUDE_FIELD = 'Boat__c.Geolocation__Longitude__s';
// Declare the const LATITUDE_FIELD for the boat's Latitude
const LATITUDE_FIELD = 'Boat__c.Geolocation__Latitude__s';
// Declare the const BOAT_FIELDS as a list of [LONGITUDE_FIELD, LATITUDE_FIELD];
const BOAT_FIELDS = [LONGITUDE_FIELD, LATITUDE_FIELD];
export default class BoatMap extends LightningElement {
  // private
  subscription = null;
  boatId;

  // Getter and Setter to allow for logic to run on recordId change
  // this getter must be public
  @api 
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
  }

  error = undefined;
  @track mapMarkers = [];

  // Initialize messageContext for Message Service
  @wire(MessageContext)
  messageContext;
  // Getting record's location to construct map markers using recordId
  // Wire the getRecord method using ('$boatId')
  @wire(getRecord, {recordId: '$boatId',  fields: BOAT_FIELDS})
  wiredRecord({ error, data }) {

    // Error handling
    if (data) {
      this.error = undefined;
      const longitude = data.fields.Geolocation__Longitude__s.value;
      const latitude = data.fields.Geolocation__Latitude__s.value;
      this.updateMap(longitude, latitude);
/*
      BOAT_FIELDS.forEach(
        (item) => (this[item.fieldApiName] = getFieldValue(data, item))
    );
*/
    } else if (error) {
      this.error = error;
      this.boatId = undefined;
      this.mapMarkers = [];
    }
  }
  subscribeMC() {
      if (!this.subscription) {
      this.subscription = subscribe(
          this.messageContext,
          BOATMC,
          (message) => {this.boatId = message.recordId},
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

  // Creates the map markers array with the current boat's location for the map.
  updateMap(Longitude, Latitude) {
    var Mobj = {
      location: {Longitude: Longitude, Latitude: Latitude}
    }
    this.mapMarkers = [];
    this.mapMarkers.push(Mobj);
  }

  // Getter method for displaying the map component, or a helper method.
  get showMap() {
    return this.mapMarkers.length > 0;
  }
}