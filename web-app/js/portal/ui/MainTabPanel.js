/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MainTabPanel = Ext.extend(Ext.TabPanel, {

    constructor:function (cfg) {
        this.portalPanel = new Portal.ui.PortalPanel({appConfig:Portal.app.config, startSnapshot:cfg.startSnapshot});
        this.searchTabPanel = new Portal.search.SearchTabPanel({mapPanel:this.getMapPanel()});
        this.homePanel = new Portal.ui.HomePanel({appConfig:Portal.app.config});
        this.downloadCartPanel = new Portal.ui.DownloadCartPanel();

        var config = Ext.apply({
            xtype:'tabpanel', // TabPanel itself has no title
            autoDestroy:false, // wont destroy tab contents when switching
            activeTab:0,
            margins:{right:5},
            cls: "idme",
            //unstyled:true,
            // method to hide the usual tab panel header with css
            headerCfg:{
                cls:'mainTabPanelHeader'  // Default class not applied if Custom element specified
            },
            items:[
                this.homePanel,
                this.portalPanel,
                this.searchTabPanel,
                this.downloadCartPanel
            ]
        }, cfg);

        Portal.ui.MainTabPanel.superclass.constructor.call(this, config);

        this.on('tabchange', function () {
            this.portalPanel.fireEvent('tabchange');
        }, this);
        Ext.MsgBus.subscribe('openDownloadCartPanelItem', function() {
            this.setActiveTab(3);
        }, this);

        Ext.MsgBus.subscribe('selectedLayerChanged', this.onSelectedLayerChange, this);
    },



    getPortalPanel:function () {
        return this.portalPanel;
    },

    getMapPanel:function () {
        return this.portalPanel.getMapPanel();
    },

    homePanelActive:function () {
        return this.getActiveTab() === this.homePanel;
    },

    showPortalPanel:function () {
        this.setActiveTab(1);
    },

    setActiveTab:function (item) {
        Portal.ui.MainTabPanel.superclass.setActiveTab.call(this, item);

        //
        // Nasty hack for #27 - without this, the details panel on the right has no content
        // and it partially obscures the MapPanel.
        //
        // It's probably worth having a look at how the RightDetailsPanel/DetailsPanel/DetailsTabPanel
        // etc etc etc interact in terms of layout when selected layer changes - and perhaps this forced
        // layout can be removed.
        //
        this.doLayout(false, true /* force update */);

        if (!this.isMapVisible()) {
            this.portalPanel.getMapPanel()._closeFeatureInfoPopup();
        }

        // Ensure tab selectors reflect actual tab selected
        var tabIndex = this.items.indexOf(this.getActiveTab());

        //TODO: componentise this
        jQuery('[id^=viewPortTab]').removeClass('viewPortTabActive');
        jQuery('#viewPortTab' + tabIndex).addClass('viewPortTabActive');
    },

    isMapVisible:function () {
        return this.isMapSelected();
    },

    isMapSelected:function () {
        return this.getActiveTab() === this.portalPanel;
    },

    loadSnapshot:function (id) {
        this.getMapPanel().loadSnapshot(id);
    },

    onSelectedLayerChange:function () {
        if (this.homePanelActive()) {
            this.showPortalPanel();
        }
    }
});
