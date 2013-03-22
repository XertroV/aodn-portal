Ext.namespace('Portal.cart');

Portal.cart.DownloadList = Ext.extend(Ext.DataView, {




    constructor: function (cfg) {

        this.downloadItemsStore = new Ext.data.JsonStore({
            // store configs
            autoDestroy: true,
            url: 'downloadCart/getCartRecords',
            storeId: 'myStore',
            // reader configs
            root: 'records',
            idProperty: 'title',
            fields: ['title', 'uuid','downloads']
        });
        this.downloadItemsStore.load();

        var template = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="x-grid3-row" >',
            '<span class="x-editable">{title}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        );


        var config = Ext.apply({
            id: "downloadList",
            store: this.downloadItemsStore,
            loadingText: "are we there yet",
            emptyText: "are we not yet",
            autoShow: true,
            tpl: template,
            overClass:'doesitpickthisup',
            minHeight: 600
        }, cfg);


        Portal.cart.DownloadList.superclass.constructor.call(this, config);


        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function() {
            this.downloadItemsStore.load();
            console.log("UPDATED");
        }, this);

        console.log(this.downloadItemsStore);
    }
});
