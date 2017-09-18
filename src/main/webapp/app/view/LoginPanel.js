/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2017 The ARSnova Team
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
Ext.define('ARSnova.view.LoginPanel', {
	extend: 'Ext.Container',

	requires: ['Ext.MessageBox', 'ARSnova.view.MatrixButton'],

	config: {
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		layout: {
			type: 'vbox',
			pack: 'center'
		},

		layoutOnOrientationChange: false,
		monitorOrientation: false,
		buttons: [],

		title: 'LoginPanel'
	},

	initialize: function () {
		this.callParent(arguments);
		this.initializeCanvasColorDummy();
		this.arsLogo = {
			xtype: 'panel',
			style: 'marginTop: 15px'
		};
		var me = this;
		var buttonHandler = function (b) {
			var service = b.config.value;
			if ("guest" === service.id && ARSnova.app.userRole === ARSnova.app.USER_ROLE_SPEAKER) {
				Ext.Msg.confirm(Messages.GUEST_LOGIN, Messages.CONFIRM_GUEST_SPEAKER, function (answer) {
					if ('yes' === answer) {
						ARSnova.app.getController('Auth').login({
							service: service
						});
					}
				});
			} else {
				ARSnova.app.getController('Auth').login({
					service: service
				});
			}
		};
		var config = ARSnova.app.globalConfig;
		ARSnova.app.getController('Auth').services.then(function (services) {
			var i, button, service, imagePath = "", imageSrc, imageCls;
			if (config.customizationPath) {
				imagePath = config.customizationPath + "/images/";
			}
			services.sort(function (a, b) {
				if (a.order > 0 && (a.order < b.order || b.order <= 0)) {
					return -1;
				}
				if (b.order > 0 && (a.order > b.order || a.order <= 0)) {
					return 1;
				}

				return 0;
			});
			for (i = 0; i < services.length; i++) {
				service = services[i];
				imageSrc = service.image ? imagePath + service.image : "btn_" + service.id;
				imageCls = "login-icon-" + service.id;
				button = {
					xtype: 'matrixbutton',
					id: 'login-select-' + service.id,
					text: "guest" === service.id ? Messages.GUEST : service.name,
					value: service,
					image: imageSrc,
					imageCls: imageCls,
					handler: buttonHandler
				};
				if (i % 2 === 1) {
					button.style = "margin-left: 20px";
				}
				me.config.buttons.push({
					allowedRoles: service.allowedRoles,
					button: button
				});
			}
		});
		this.on('painted', function () {
			ARSnova.app.getController('Application').setCountdownTimerColors();
			ARSnova.app.getController('Application').setFeedbackChartColors();
			ARSnova.app.getController('Application').setCorrectChartColors();
		});
	},
	addToolbar: function () {
		var isPhone = (Ext.os.is.Phone && Ext.os.is.iOS);
		var smallHeight = document.body.clientHeight <= 460;
		var mediumHeight = document.body.clientHeight >= 520;
		var slogan = ARSnova.app.globalConfig.arsnovaSlogan || "";
		this.add([{
			xtype: 'toolbar',
			docked: 'top',
			ui: 'light',
			title: 'Login',
			cls: null
			//since we decide role with url, we don't provide those role shift function
			//items: [{
			//	text: Messages.CHANGE_ROLE,
			//	ui: 'back',
			//	handler: function () {
			//		ARSnova.app.userRole = "";
			//		ARSnova.app.setWindowTitle();
			//		ARSnova.app.mainTabPanel.tabPanel.animateActiveItem(ARSnova.app.mainTabPanel.tabPanel.rolePanel, {
			//			type: 'slide',
			//			direction: 'right'
			//		}
			//	);
			//	}
			//}]
			},
			this.arsLogo,
			{
				xtype: 'panel',
				cls: null,
				//for temp use
				html: "<div class='icon-logo'>" +
						"<span class='icon-logo-ars'>FIT</span>" +
						"<span class='icon-lock'>-</span>" +
						"<span class='icon-logo-nova'>TJU</span>" +
						"</div>",
				style: {
					marginTop: '5px'
				}
			}, {
				xtype: 'panel',
				style: {
					marginBottom: isPhone && !mediumHeight ? (smallHeight ? '10px' : '15px') : '30px'
				},
				html: "<div class='gravure'>" + slogan + "</div>",
				cls: null
			}
		]);
	},
	addButtons: function (role) {
		var buttons = [];
		var i;
		var buttonPanels = [];
		var items = [];
		var me = this;
		this.removeAll(true, true);
		this.addToolbar();
		for (i = 0; i < this.getButtons().length; i++) {
			if (this.getButtons()[i].allowedRoles.indexOf(role) > -1) {
				buttons.push(this.getButtons()[i].button);
			}
		}
		for (i = 0; i < buttons.length; i++) {
			items.push(buttons[i]);
			if (i % 2 === 1 || i === this.getButtons().length - 1) {
				buttonPanels.push(Ext.create('Ext.Panel', {
						id: 'buttonPanel-' + i,
						xtype: 'container',
						layout: {
							type: 'hbox',
							pack: 'center'
						},
						items: items
					})
				);
				items = [];
			}
		}
		buttonPanels[buttonPanels.length - 1].setStyle('margin-bottom: 15px;');
		buttonPanels.forEach(function (buttonPanel) {
			me.add(buttonPanel);
		});
		me.add(this.colorDummy);
	},
	initializeCanvasColorDummy: function () {
		// essential for canvas color and style retrieval
		this.colorDummy = {
			hidden: true,
			html: ARSnova.app.getController('Application').getCanvasColorDummies()
		};
	}
});
