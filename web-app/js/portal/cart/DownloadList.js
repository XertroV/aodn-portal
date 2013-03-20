Portal.ui.DownloadList = Ext.extend(Ext.grid.GridPanel, {
    frame: false,
    layout: 'fit',
    border: false,

    initComponent: function() {
        var config = {
            colModel : new Ext.grid.ColumnModel([
                { sortable: false}
            ]),
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

        Portal.ui.DownloadList.superclass.initComponent.apply(this, arguments)

        this.store.load();

        console.log(this.store);
    }
});

Ext.reg('portal.ui.downloadList', Portal.ui.DownloadList);
