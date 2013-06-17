/*
 * jQuery 1.8.2 is inlcuded in https://static.citrixonlinecdn.com/web-library-2/scripts/web-library.js
 * per http://static.citrixonlinecdn.com/web-library-2/browser-support.html IE7 is supported, so be nice
 * and stick everything in a jQuery ready
 */
jQuery(document).ready(function($) {

    'use strict';

    /*
     * custom bindings for knockout
     */


    /*
     * sorting binding based on http://jsfiddle.net/brendonparker/6S85t/
     * added subsort if primary sort fields are the same
     */
    ko.bindingHandlers.sort = {

        init: function(element, valueAccessor) {
            var asc = false;
            element.style.cursor = 'pointer';

            element.onclick = function(){
                var value = valueAccessor(),
                    prop = value.prop,
                    data = value.arr,
                    altProp = prop === 'firstName' ? 'lastName' : 'firstName';

                asc = !asc;
                if(asc){
                    data.sort(function(left, right){
                        return left[prop] === right[prop] ? left[altProp] < right[altProp] ? -1 : 1 : left[prop] < right[prop] ? -1 : 1;
                    });
                } else {
                    data.sort(function(left, right){
                        return left[prop] === right[prop] ? left[altProp] > right[altProp] ? -1 : 1 : left[prop] > right[prop] ? -1 : 1;
                    });
                }
            };
        }
    };


    /*
     * setup knockout
     */
    (function(){

        var UserListModel = function() {
            var self = this;

            /*
             * setup observables
             */
            self.userListArray = ko.observableArray([]);
            self.firstName = ko.observable('');
            self.lastName = ko.observable('');
            self.userName = ko.observable('');
            self.currentUser = ko.observable('');
            self.firstNameRequiredError = ko.observable(false);
            self.lastNameRequiredError = ko.observable(false);


            /*
             * 1) When you enter a first and last name, the user is added to the user list , and input fields are cleared.
             * checks that name fields are filled out and set errors if not.  Only checks that fields are not empty, in
             * production there would lkely be additional validation rules.  Add the user to the list if no errors.  Limiting
             * to 10 is being handled by a style binding to hide the input form
             */
            self.addUser = function() {

                self.firstNameRequiredError(this.firstName() !== '' ? false : true);
                self.lastNameRequiredError(this.lastName() !== '' ? false : true);

                if (self.firstNameRequiredError() === false && self.lastNameRequiredError() === false) {
                    self.userListArray.push({firstName:self.firstName(),lastName:self.lastName()});
                    self.firstName('');
                    self.lastName('');
                }
            };


            /*
             * 2) Clicking the small X will remove the user from the list
             */
            self.removeUser = function() {
                self.userListArray.remove(this);
            };

            /*
             * setup the modal with the current user and display it. track the current user in
             * an observable for possible removal, see below :/
             */
            self.modal = function(user) {
                self.currentUser = user;
                self.userName(user.firstName + ' ' + user.lastName);
                $('#user-modal').dialog('open');
            };

            /*
             * There's probably an easier way to bind the user into the modal link and just
             * handle removing them from there with removeUser() directly.  Oh well, this
             * will remove the user and close the dialog
             */
            self.modalRemoveUser = function() {
                self.userListArray.remove(self.currentUser);
                $('#user-modal').dialog('close');
            };

            /*
             * animation callbacks for the users list, direct from an example on the knockout website
             */
            this.showUserElement = function(elem) {
                if (elem.nodeType === 1) {
                    $(elem).hide().slideDown();
                }
            };
            this.hideUserElement = function(elem) {
                if (elem.nodeType === 1) {
                    $(elem).slideUp(function(){
                        $(elem).remove();
                    });
                }
            };
        };

        /*
         * apply the bindings
         */
        ko.applyBindings(new UserListModel());
    })();


    /*
     * one modal to rule them all
    */
    $('#user-modal').modalWindow();

});