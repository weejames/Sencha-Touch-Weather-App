// The teagrams Viewport is an extension of the Ext.Panel component.
// This is "main" wrapping view.
weatherflickr.views.Viewport = Ext.extend(Ext.Panel, {
    // Let's set some config options for the panel.
    fullscreen: true,
    layout: 'card',

    // Now, we initialize it.
    initComponent: function() {
		
		Ext.apply(weatherflickr.views, {
	            forecast: new weatherflickr.views.Forecast(),
	            loading: new weatherflickr.views.Loading()
	        });


        Ext.apply(this, {
            items: [
                weatherflickr.views.loading,
				weatherflickr.views.forecast
            ]
        });

        weatherflickr.views.Viewport.superclass.initComponent.apply(this, arguments);
    }

});