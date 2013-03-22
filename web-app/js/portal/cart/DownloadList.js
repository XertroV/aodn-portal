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
            '<div class="x-grid3-row" >{title}</div>',
            '<div >{[ this.getFiles(values) ]}</div>',
            '</tpl>',
            '<div class="x-clear"></div>',
            {
                getFiles: function(values) {
                    var html = "";
                    Ext.each(values.downloads, function(f) {
                        console.log(f);
                        html += subFilesTemplate.apply(f);
                    });
                    return html;

                }

            }
        );
        var subFilesTemplate = new Ext.XTemplate(
            '<div  >' +
                '<a href="{href}" target="_blank" title="{title}" >{title} ({type})</a></div>'
        );


        var config = Ext.apply({
            id: "downloadList",
            store: this.downloadItemsStore,
            autoShow: true,
            tpl: template,
            //overClass:'x-grid3-row-over',
            minHeight: 600
        }, cfg);


        Portal.cart.DownloadList.superclass.constructor.call(this, config);


        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function() {
            this.downloadItemsStore.load();
            //console.log("UPDATED");
        }, this);

        console.log(this.downloadItemsStore);
    }
});
