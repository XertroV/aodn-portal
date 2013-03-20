
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */


Ext.namespace('Portal.cart');

Portal.cart.DownloadCartPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var config = Ext.apply({

            layout: 'border',
            id: "downloadCartPanel",
            title: 'Home ',
            minHeight: 600,
            items: [
                {
                    region:'center',
                    layout:'fit',
                    //minHeight: 600,
                    padding:  '0px 5px 0px 0px',
                    unstyled: true,
                    stateful: false,
                    html: "herewegoherewegoherewego",
                    items: [
                        //new Portal.cart.DownloadCartOptionsPanel()
                    ]
                }
            ]

        }, cfg);

        Portal.cart.DownloadCartPanel.superclass.constructor.call(this, config);
    }
});

