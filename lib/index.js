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
      if (this._checkPassword(this.currentPassword)) {
        console.log(this._getStorage(this.currentPassword));
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
 * @param {string} password
 * @return {bool} checked
 */
Safe42.prototype._checkPassword = function (password) {
  var result = false;

  this.storage.forEach(function(item) {
    if (item.password == password) {
      result = true;
    }
  }.bind(this));

  return result;
}

/**
 * Get storage
 * @param {string} password
 * @return {object} data
 */
Safe42.prototype._getStorage = function (password) {
  var data = {};

  this.storage.forEach(function(item) {
    if (item.password == password) {
      data = item.data;
    }
  });

  return data;
}

var storage = [{
  'id': '1',
  'password': '42',
  'data': {
    'name': 'cyril',
    'age': 30,
    'sexe': 'male'
  }
}, {
  'id': '2',
  'password': '12345',
  'data': {
    'name': 'toto',
    'age': 30,
    'sexe': 'E.T'
  }
}];

var safe42 = new Safe42(storage);

safe42.run();


















