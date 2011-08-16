Ext.YQL = {
    useAllPublicTables: true,
    yqlUrl: 'http://query.yahooapis.com/v1/public/yql',
    request: function(cfg) {
		var p = cfg.params || {};
        p.q = cfg.query;
        p.format = 'json';
        if (this.useAllPublicTables) {
            p.env = 'store://datatables.org/alltableswithkeys';
        }
        Ext.util.JSONP.request({
            url: this.yqlUrl,
            callbackKey: 'callback',
            params: p,
            callback: cfg.callback,
            scope: cfg.scope || window
        });
		return;
    }
};

weatherflickr.controllers.wfController = new Ext.Controller({

    position: {latitude: 55.8, longitude: -4.2, woeid: 21125, locationpath: []},

	index: function(options) {
		Ext.getBody().mask('Loading...', 'x-mask-loading', false);
		this._updateWeather();
		return;
    },

	_updateWeather: function() {
		//first we need to get out location 
		
		var onSuccess = function(position) {
		
			weatherflickr.controllers.wfController.position.latitude = position.coords.latitude;
			weatherflickr.controllers.wfController.position.longitude = position.coords.longitude;
		
			weatherflickr.controllers.wfController._getWoeid();
			return;
		};

		// onError Callback receives a PositionError object
		//
		function onError(error) {
			weatherflickr.controllers.wfController._getForecast();
			//weatherflickr.controllers.wfController._getWoeid();
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		
		return;
	},
	
	_getWoeid: function() {
		
		var position = weatherflickr.controllers.wfController.position;
		var latlonQuery = 'select * from flickr.places where lat = '+position.latitude+' and lon = '+position.longitude;
		
		Ext.YQL.request( {
			query: latlonQuery,
			callback: function(response) {

				weatherflickr.controllers.wfController.position.woeid = response.query.results.places.place.woeid;
				
				weatherflickr.controllers.wfController.position.locationpath = response.query.results.places.place.name.split(',');
				
				weatherflickr.controllers.wfController._getForecast();
				
				return;
			}
		} );
		return;
	},
	
	_getForecast: function() {
		
		var position = weatherflickr.controllers.wfController.position;
		
		Ext.YQL.request( {
			query: 'select * from xml where url = "http://weather.yahooapis.com/forecastrss?w='+position.woeid+'&u=c"',
			callback: function(response) {

				forecastData = response.query.results.rss.channel;
				weatherflickr.views.forecast.forecastData = forecastData;
				
				weatherflickr.controllers.wfController._getPhoto();
				
				return;
			}
		} );
		return;
	},
	
	
	_getPhoto: function(locationPosition) {
		
		var weather = weatherflickr.views.forecast.forecastData.item.condition.text;
		var position = weatherflickr.controllers.wfController.position;
		
		if (locationPosition == undefined && position.locationpath.length > 0) locationPosition = 0;
		else locationPosition = false;
		
		if (locationPosition != false ) {
			var querycity = position.locationpath[locationPosition];
		} else {
			var querycity = '';
		}
		
		var cityQuery = 'select * from flickr.photos.search where text="'+weather+', weather, '+querycity+'"  limit 1';
		
		Ext.YQL.request( {//and woe_id = '+position.woeid+'
			query: cityQuery,
			callback: function(response) {
				
				if (response.query.results == null) {
					
					weatherflickr.controllers.wfController.position.locationpath.shift();
					
					weatherflickr.controllers.wfController._getPhoto();
					
					return;
					
				} else {
					weatherflickr.views.forecast.photo = response.query.results.photo;

					weatherflickr.views.forecast.setData();

					weatherflickr.views.viewport.setActiveItem(
					            weatherflickr.views.forecast
					);
					Ext.getBody().unmask();
					return;
				}
				
			}
		} );
		return;
	}

});