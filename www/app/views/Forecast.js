// Main Panel component.
weatherflickr.views.Forecast = Ext.extend(Ext.Panel, {
	
	style: 'background-color: black',
	layout: {
		type: 'vbox',
		align: 'left'
	},
	
    dockedItems: [{
        xtype: 'toolbar',
        title: ''        
    }],

    items: [
		

    ],

	setData: function() {

		imageUrl = 'http://src.sencha.io/http://static.flickr.com/'+this.photo.server+'/'+this.photo.id+'_'+this.photo.secret+'_z.jpg';
		
		toolbar = this.getDockedComponent(0)
		
		toolbar.title = this.forecastData.location.city;
		
		this.add(
			{
				html: '<div style="background-image: url(\''+imageUrl+'\'); background-repeat: no-repeat;">' +
				'<p class="temp">'+this.forecastData.item.condition.temp+'&deg;</p>' +
				'<p class="description">'+this.forecastData.item.condition.text+'</p>' +
				'</div>',
				layout: 'fit',
				flex: 4
			}
			
			);
		
		forecastLength = this.forecastData.item.forecast.length
		
		for (x = 0; x < forecastLength; x ++) {
			
			currentForecast = this.forecastData.item.forecast[x];
			
			this.add({
					html: '<p>'+currentForecast.date+' '+currentForecast.text+'</p>',
					style: 'color: white; padding-top: 1em',
					layout: 'fit',
					flex: 1
			});
			
		}
		
	}

});