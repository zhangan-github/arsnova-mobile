/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2015 The ARSnova Team
 *
 * ARSnova Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define("ARSnova.controller.Storage", {
	extend: 'Ext.app.Controller',
	
	activeSessionId: null,
	
	/** initialize storage at startup */
	init: function() {	
		this.initializeStorage();
	},
    
	/** intialization of storage */
	initializeStorage: function() {
	        
		/** use localstorage as driver for debugging reasons */
		localforage.setDriver('localStorageWrapper');
		        
		localforage.config({
			name        : 'ARSnovaDB',
			version     : 1.0,
			storeName   : 'appDatabase',
			description : 'Application Database'
		});
	    
		/** initalize 'initialized' object */
		localforage.getItem('initialized', function(isInitialized) {
			if(isInitialized == null) {
				localforage.setItem('initialized', new Object());
			}
		});
	},
		    
	/** session specific initialization */
	initializeSessionStorage: function(sessionid) {		
		var me = this;
		
		localforage.getItem('initialized', function(error, initObject) {
			if(error) return;
			else {
				if(typeof initObject[sessionid] === 'undefined') {
					initObject[sessionid] = true;
					localforage.setItem('initialized', initObject);
					
					me.genericSetterMethod('questionObj', new Object());
				}
			}
		});
	},
	
	setActiveSessionId: function(sessionid) {
		this.activeSessionId = sessionid;
		this.initializeSessionStorage(sessionid);
	},
	
	getActiveSessionId: function() {
		return this.activeSessionId;
	},
	    
	/** generic getter method */
	genericGetterMethod: function(key, promise) {
		var me = this;
		localforage.getItem(err, key, function(obj) {
			if(err) {
				console.log('failed');
			}
			else {
				promise(obj[me.activeSessionId]);
			}
		});
	},

	/** generic setter method */
	genericSetterMethod: function(key, value, promise) {
		var me = this;
		localforage.getItem(key, function(object) {
			if(object == null) object = {};
		
			object[me.activeSessionId] = value;
			if(typeof promise === 'undefined') { localforage.setItem(key, object); }
			else { localforage.setItem(key, object, promise); } 
		});
	}
});