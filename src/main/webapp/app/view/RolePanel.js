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
Ext.define('ARSnova.view.RolePanel', {
	extend: 'Ext.Container',

	config: {
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},

		tab: {
			hidden: true
		},

		layout: {
			type: 'vbox',
			pack: 'center'
		},

		title: 'RolePanel'
	},

	buttonColorChange: {
		run: function () {
			if (ARSnova.app.mainTabPanel) {
				var panel = ARSnova.app.mainTabPanel.tabPanel.rolePanel;

				if (panel.selectState) {
					panel.studentButton.addImageCls('alternativeRoleChangeColor');
					panel.speakerButton.removeImageCls('alternativeRoleChangeColor');
				} else {
					panel.speakerButton.addImageCls('alternativeRoleChangeColor');
					panel.studentButton.removeImageCls('alternativeRoleChangeColor');
				}

				panel.selectState = !panel.selectState;
			}
		},
		interval: 2000
	},

	initialize: function () {
		this.callParent(arguments);

		var isPhone = (Ext.os.is.Phone && Ext.os.is.iOS);
		var smallHeight = document.body.clientHeight <= 460;
		var mediumHeight = document.body.clientHeight >= 520;
		var slogan = ARSnova.app.globalConfig.arsnovaSlogan || "";
		this.initializeCanvasColorDummy();

		this.speakerButton = Ext.create('ARSnova.view.MatrixButton', {
			id: 'role-select-speaker',
			text: Messages.SPEAKER,
			value: ARSnova.app.USER_ROLE_SPEAKER,
			imageCls: "icon-presenter"
		});

		this.studentButton = Ext.create('ARSnova.view.MatrixButton', {
			id: 'role-select-student',
			text: Messages.STUDENT,
			value: ARSnova.app.USER_ROLE_STUDENT,
			imageCls: "icon-users",
			style: 'margin-left: 20px;'
		});

		this.add([{
			xtype: 'toolbar',
			docked: 'top',
			ui: 'light',
			title: Messages.TITLE_ROLE,
			cls: null
		}, {
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
		}, {
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			defaults: {
				xtype: 'matrixbutton',
				handler: function (b) {
					ARSnova.app.getController('Auth').roleSelect({
						mode: b.config.value
					});
				}
			},
			items: [
				this.speakerButton,
				this.studentButton
			]
		}, {
			xtype: 'container',
			layout: {
				type: 'hbox',
				pack: 'center'
			},
			style: 'margin-top: 15px; margin-bottom: 5px;',
			items: [{
				xtype: 'matrixbutton',
				text: Messages.MANUAL,
				imageCls: "icon-book",
				handler: function () {
					var tabPanel = ARSnova.app.mainTabPanel.tabPanel;
					tabPanel.setActiveItem(tabPanel.infoTabPanel);
				}
			}]
		}, this.colorDummy]);

		this.on('activate', function () {
			this.selectState = false;
			ARSnova.app.taskManager.start(this.buttonColorChange);
		});

		this.on('painted', function () {
			ARSnova.app.getController('Application').setCountdownTimerColors();
			ARSnova.app.getController('Application').setFeedbackChartColors();
			ARSnova.app.getController('Application').setCorrectChartColors();
		});

		this.on('deactivate', function () {
			ARSnova.app.taskManager.stop(this.buttonColorChange);
		});
	},

	initializeCanvasColorDummy: function () {
		// essential for canvas color and style retrieval
		this.colorDummy = {
			hidden: true,
			html: ARSnova.app.getController('Application').getCanvasColorDummies()
		};
	}
});
