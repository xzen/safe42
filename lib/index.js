'use strict';

/**
 * Class Safe42
 * @constructor
 */
var Safe42 = function Safe42 (storage) {
  this.storage = storage;
  this.currentPassword;

  this.initialize();
}

/**
 * Initialize
 * @return {Safe42}
 */
Safe42.prototype.initialize = function () {
  this.settingsDisplayScreen = {
    'default': {
      'type': 'info',
      'title': 'INFO',
      'message': ''
    },
    'success': {
      'type': 'success',
      'title': 'SUCCESS',
      'message': ''
    },
    'warning': {
      'type': 'warning',
      'title': 'WARNING',
      'message': ''
    },
    'error': {
      'type': 'danger',
      'title': 'ERROR',
      'message': ''
    }
  };

  this._renderDisplayScreen(this.settingsDisplayScreen.default);

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
  if (key === 'ENTER' || key === 'DELETE' || key === 'UPDATE') {
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
      if (! this._checkPassword(this.currentPassword)) {
        this.settingsDisplayScreen.error.message = 'Bad password';
        this._renderDisplayScreen(this.settingsDisplayScreen.error);
        this.currentPassword = '';

        return;
      }

      console.log(this._getDataStorage(this.currentPassword));

      this.settingsDisplayScreen.success.message = 'Your password is valid!';
      this._renderDisplayScreen(this.settingsDisplayScreen.success);
      this.currentPassword = '';

      return;
    }.bind(this),
    'delete': function () {
      this.settingsDisplayScreen.success.message = 'data removed!';
      this._renderDisplayScreen(this.settingsDisplayScreen.success);

      console.log(this._deleteDataStorage(this.currentPassword));
      this.currentPassword = '';
    }.bind(this),
    'update': function () {
      this.settingsDisplayScreen.success.message = 'data updated!';
      this._renderDisplayScreen(this.settingsDisplayScreen.success);

      console.log(this._updateDataStorage({'tutu': 'tutu'}, this.currentPassword));
      this.currentPassword = '';
    }.bind(this)
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
Safe42.prototype._getDataStorage = function (password) {
  var data = {};

  this.storage.forEach(function(item) {
    if (item.password == password) {
      data = item.data;
    }
  });

  return data;
}

/**
 * Delete data storage
 * @param {string} password
 * @return {object} data
 */
Safe42.prototype._deleteDataStorage = function (password) {
  var data = {};

  this.storage.forEach(function(item, index) {
    if (item.password == password) {
      this.storage[index].data = {};
      data = this.storage[index];
    }
  }.bind(this));

  return data;
}

/**
 * Update data storage
 * @param {object} dataUpdate
 * @return {object} data
 */
Safe42.prototype._updateDataStorage = function (dataUpdate, password) {
  var newData = dataUpdate;
  var data = {};

  this.storage.forEach(function(item, index) {
    if (item.password == password) {
      this.storage[index].data = newData;
      data = this.storage[index];
    }
  }.bind(this));

  return data;
}


/**
 * Template display screen
 * @param {object} settings
 * @reutrn {string} dom
 */
Safe42.prototype._tplDisplayScreen = function (settings) {
  var dom = '<div class="alert alert-' + settings.type + '" role="alert">';
    dom += '<h4 class="alert-heading">' + settings.title + '</h4>';
    dom += '<p>' + settings.message + '</p>';
  dom += '</div>';

  return dom;
}

/**
 * Render display screen
 * @param {object} settings
 * @reutrn {Safe42}
 */
Safe42.prototype._renderDisplayScreen = function (settings) {
  var el = document.querySelector('#display-screen .col');

  el.innerHTML = this._tplDisplayScreen(settings);

  return this;
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


















