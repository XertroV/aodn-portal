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








        this.on('afterrender', function () {

            //this.store = this.downloadItemsStore;
            //this.render(document.body);
            //this.selectedView.refresh();
            //console.log(this);

        }, this);
        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function() {
            this.store.load();
            console.log("UPDATED");
        }, this);

        console.log(this.store);
    }
});

Ext.reg('portal.cart.downloadList', Portal.cart.DownloadList);
