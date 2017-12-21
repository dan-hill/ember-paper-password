import Ember from 'ember';
import strength from 'password-strength';
import layout from '../templates/components/paper-password';

const { Component, computed, A, assert } = Ember;

export default Ember.Component.extend({
  layout,
  classNames: ['paper-password-container'],
  showPassword: false,
  type: 'password',
  minStrength: 3,
  strengthLabel: 'Password strength: ',
  strengthLevels: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'],
  passwordErrorMessage: 'Please enter a stronger password.',
  errors: [],
  customValidations: [],

  passwordStrength: computed('value', function() {
    let password = this.get('value');
    if (password) {
      return strength(password);
    } else {
      return {score: 0};
    }
  }),
  strengthValue: computed('value', function() {
    return (this.get('passwordStrength').score / 4) * 100;
  }),
  strengthLevel: computed('value', function() {
    return this.get('strengthLevels')[this.get('passwordStrength').score];
  }),
  strengthWarning: computed('value', function() {
    return this.get('passwordStrength').score < this.get('minStrength');
  }),
  'colorClass': computed('passwordStrength.score','value', 'minStrength', function() {
    if(this.get('passwordStrength').score >= this.get('minStrength') && this.get('passwordStrength').score < 4){
      return 'md-primary md-hue-4';
    } else if (this.get('passwordStrength').score < this.get('minStrength')){
      return 'md-warn md-hue-4';
    } else if (this.get('passwordStrength').score >= 4){
      return 'md-accent md-hue-1'
    }
  }),
  inputErrors: computed('errors.[]', 'value', function() {
    let myErrors = A().pushObjects(this.get('errors'));
    let passwordStrength = this.get('passwordStrength');
    let password = this.get('value');

    if (password && passwordStrength.score < this.get('minStrength')) {
      myErrors.pushObject({
        message: this.get('passwordErrorMessage')
      });
    }

    return myErrors;
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    assert('{{paper-password}} requires an `onChange` action or null for no action.', this.get('onChange') !== undefined);
  },
  actions: {
    'show-password': function(){
      this.set('showPassword', true)
      this.set('type', 'text')
    },
    'hide-password': function(){
      this.set('showPassword', false)
      this.set('type', 'password')
    }
  }
});
