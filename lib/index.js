'use strict';

/**
 * Class Safe42
 * @constructor
 */
var Safe42 = function Safe42 (storage) {
  this.storage = storage;
  this.currentPassword;
}

/**
 * Initialize
 * @return {Safe42}
 */
Safe42.prototype.initialize = function () {
  return this;
}

/**
 * Run
 * @return {Safe42}
 */
Safe42.prototype.run = function () {
  this.onClickDigits(function(key) {
    this.setCurrentPassword(key);

    if (this.getAction(key)) {
      this.getAction(key)();
    }
  }.bind(this));

  return this;
}

/**
 * set current password
 * @param {string} key
 * @return {bool} true/false
 */
Safe42.prototype.setCurrentPassword = function (key) {
  if (key === 'ENTER') {
    return false;
  }

  this.currentPassword = ! this.currentPassword ? this.currentPassword = key : this.currentPassword += key;

  return false
}

/**
 * Get action
 * @param {string} key
 * @return {function} actions[action]
 * @return {bool} false
 */
Safe42.prototype.getAction = function (key) {
  var action = key.toLowerCase();
  var actions = {
    'enter': function () {
      if (this._checkPassword()) {
        console.log(this.storage);
      }

      this.currentPassword = '';
    }.bind(this),
    'wtf': function () {
      window.alert('WTF !!!!!');
    }
  };

  if (! actions[action]) {
    return false;
  }

  return actions[action];
}

/**
 * On click digits
 * @param {function} callback
 * @return {Safe42}
 */
Safe42.prototype.onClickDigits = function (callback) {
  var elButtons = document.querySelectorAll('#digits button');

  elButtons.forEach(function(elButton) {
    elButton.addEventListener('click', function(e) {
      callback(e.target.textContent);
    });
  });

  return this;
}

/**
 * Check password
 * @return {bool} checked
 */
Safe42.prototype._checkPassword = function () {
  var result = false;

  this.storage.forEach(function(item) {
    if (item.password == this.currentPassword) {
      result = true;
    }
  }.bind(this));

  return result;
}

var storage = [{
  'id': '1',
  'password': '42',
  'data': {
    'name': 'cyril',
    'age': 30,
    'sexe': 'male'
  }
}];

var safe42 = new Safe42(storage);

safe42.run();


















