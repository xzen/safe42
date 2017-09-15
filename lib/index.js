'use strict';

/**
 * Class Safe42
 * @constructor
 */
var Safe42 = function Safe42 (storage) {
  this._storage = storage;
  this._currentPassword;
  this._countBadPassword;

  this._initialize();
}

/**
 * Initialize
 * @return {Safe42}
 */
Safe42.prototype._initialize = function () {
  this._settingsDisplayScreen = {
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
  this._countBadPassword = 0;

  this._renderDisplayScreen(this._settingsDisplayScreen.default);

  return this;
}

/**
 * Run
 * @return {Safe42}
 */
Safe42.prototype.run = function () {
  this._onClickDigits(function(key) {
    this._setCurrentPassword(key);
    this._settingsDisplayScreen.default.message = this._setEncodeCurrentPassword(this._currentPassword;);
    this._renderDisplayScreen(this._settingsDisplayScreen.default);

    if (this._getAction(key)) {
      this._getAction(key)();
    }
  }.bind(this));

  return this;
}

/**
 * set current password
 * @param {string} key
 * @return {bool} true/false
 */
Safe42.prototype._setCurrentPassword = function (key) {
  if (key === 'ENTER' || key === 'DELETE' || key === 'UPDATE') {
    return false;
  }

  this._currentPassword; = ! this._currentPassword; ? this._currentPassword; = key : this._currentPassword; += key;

  return false
}

/**
 * Get action
 * @param {string} key
 * @return {function} actions[action]
 * @return {bool} false
 */
Safe42.prototype._getAction = function (key) {
  var action = key.toLowerCase();
  var actions = {
    'enter': function () {
      if (! this._checkPassword(this._currentPassword;)) {
        this._settingsDisplayScreen.error.message = 'Bad password';
        this._renderDisplayScreen(this._settingsDisplayScreen.error);

        if (this._countBadPassword == 3) {
          this._settingsDisplayScreen.error.message = 'Kim Jung Un bomber-H!';
          this._renderDisplayScreen(this._settingsDisplayScreen.error);
          this._storage = [];
          this._countBadPassword = 0;
        }

        this._currentPassword; = '';

        return;
      }

      this._settingsDisplayScreen.success.message = 'Your password is valid!';
      this._renderDisplayScreen(this._settingsDisplayScreen.success);
      this._renderDataConsole(this._getDataStorage(this._currentPassword;));
      this._currentPassword; = '';

      return;
    }.bind(this),
    'delete': function () {
      this._settingsDisplayScreen.success.message = 'data removed!';
      this._renderDisplayScreen(this._settingsDisplayScreen.success);

      console.log(this._deleteDataStorage(this._currentPassword;));
      this._currentPassword; = '';
    }.bind(this),
    'update': function () {
      this._settingsDisplayScreen.success.message = 'data updated!';
      this._renderDisplayScreen(this._settingsDisplayScreen.success);

      console.log(this._updateDataStorage({'tutu': 'tutu'}, this._currentPassword;));
      this._currentPassword; = '';
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
Safe42.prototype._onClickDigits = function (callback) {
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

  this._storage.forEach(function(item) {
    if (item.password == password) {
      result = true;
      this._countBadPassword = 0;
    }
  }.bind(this));

  if (! result) {
    this._countBadPassword += 1;
  }

  return result;
}

/**
 * Get storage
 * @param {string} password
 * @return {object} data
 */
Safe42.prototype._getDataStorage = function (password) {
  var data = {};

  this._storage.forEach(function(item) {
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

  this._storage.forEach(function(item, index) {
    if (item.password == password) {
      this._storage[index].data = {};
      data = this._storage[index];
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

  this._storage.forEach(function(item, index) {
    if (item.password == password) {
      this._storage[index].data = newData;
      data = this._storage[index];
    }
  }.bind(this));

  return data;
}


/**
 * Set encode current password
 * @param {string} password
 * @return {string} encodePassword
 */
Safe42.prototype._setEncodeCurrentPassword = function (password) {
  return password.replace(/\d/gi, 'x');
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
 * @return {Safe42}
 */
Safe42.prototype._renderDisplayScreen = function (settings) {
  var el = document.querySelector('#display-screen .col');

  el.innerHTML = this._tplDisplayScreen(settings);

  return this;
}

/**
 * Render data console
 * @param {object} data
 * @return {string} dom
 */
Safe42.prototype._renderDataConsole = function (data) {
  var el = document.querySelector('#console .list-group');
  var dom = '';

  for (var key in data) {
    dom += this._tplDataConsole(key, data[key]);
  }

  el.innerHTML = dom;

  return this;
}

/**
 * Template data console
 * @param {string} key
 * @param {string} value
 * @return {string} dom
 */
Safe42.prototype._tplDataConsole = function (key, value) {
  return '<li class="list-group-item list-group-item-error"><strong>'+ key +' -----></strong> '+ value +'</li>';
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
