import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import fivestar static resource, call it fivestar
import firestar from '@salesforce/resourceUrl/fivestar';
// add constants here
const ERROR_TITLE   = 'Error loading five-star';
const ERROR_VARIANT = 'error';
const EDITABLE_CLASS  = 'c-rating-wrapper';
const READ_ONLY_CLASS  = 'readonly c-rating-wrapper';

export default class FiveStarRating extends fivestar(LightningElement) {
  //initialize public readOnly and value properties
  readOnly=false;
  value=5;

  editedValue;
  isRendered;

  //getter function that returns the correct class depending on if it is readonly
  get starClass() {
    return readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
  }

  // Render callback to load the script once the component renders.
  renderedCallback() {
    if (this.isRendered) {
      return;
    }
    this.loadScript();
    this.isRendered = true;
  }

  //Method to load the 3rd party script and initialize the rating.
  //call the initializeRating function after scripts are loaded
  //display a toast with error message if there is an error loading script
  loadScript() {
    alert ("Loadscript");
    Promise.all([
      loadStyle(this, fivestar + '/rating.css'),
      loadScript(this, fivestar + '/rating.js')
    ]).then(() => {
      alert ("Initialise");
      let result = this.initializeRating();
      alert ("result: " + result);
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

  initializeRating() {
    let domEl = this.template.querySelector('ul');
    let maxRating = 5;
    let self = this;
    let callback = function (rating) {
      self.editedValue = rating;
      self.ratingChanged(rating);
    };
    this.ratingObj = window.rating(
      domEl,
      this.value,
      maxRating,
      callback,
      this.readOnly
    );
  }

  // Method to fire event called ratingchange with the following parameter:
  // {detail: { rating: CURRENT_RATING }}); when the user selects a rating
  ratingChanged(rating) {
    const selectEvent=new CustomEvent('ratingchange', {detail : {rating : rating}});
    this.dispatchEvent(selectEvent);
  }
}