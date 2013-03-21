Portal.cart.DownloadList = Ext.extend(Ext.grid.GridPanel, {
    frame: false,
    layout: 'fit',
    border: false,

    initComponent: function() {
        var config = {
            colModel : new Ext.grid.ColumnModel({
                defaults:{
                    menuDisabled:true,
                    width:800
                },
                columns:[
                    {
                        id:'mdDesc',
                        header:OpenLayers.i18n('descHeading'),
                        dataIndex:'title',
                        //width:100,
                        xtype:'templatecolumn',
                        tpl: [
                            '<div style="white-space:normal !important;" title="{title}">',
                            '<h4>{title}</h4>',
                            '</div>'
                        ]
                    }
                ]
            }),
            store : new Ext.data.JsonStore({
                // store configs
                autoDestroy: true,
                url: 'downloadCart/getCartRecords',
                storeId: 'myStore',
                // reader configs
                root: 'records',
                idProperty: 'title',
                fields: ['title', 'uuid']
            })
        };


        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Portal.cart.DownloadList.superclass.initComponent.apply(this, arguments)

        this.store.load();

        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function() {
            this.store.load();
            console.log("UPDATED");
        }, this);

        console.log(this.store);
    }
});

Ext.reg('portal.cart.downloadList', Portal.cart.DownloadList);
