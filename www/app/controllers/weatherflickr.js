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

    position: {latitude: 55.8, longitude: -4.2, woeid: 21125},

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
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
		
		return;
	},
	
	_getWoeid: function() {
		
		var position = weatherflickr.controllers.wfController.position;
		
		Ext.YQL.request( {
			query: 'select * from flickr.places where lat = '+position.latitude+' and lon = '+position.longitude,
			callback: function(response) {

				weatherflickr.controllers.wfController.position.woeid = response.query.results.places.place.woeid;
				
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
	
	
	_getPhoto: function() {
		var weather = weatherflickr.views.forecast.forecastData.item.condition.text;
		var position = weatherflickr.controllers.wfController.position;
		
		Ext.YQL.request( {
			query: 'select * from flickr.photos.search where text="'+weather+'" and woe_id = '+position.woeid+' limit 1',
			callback: function(response) {
				
				weatherflickr.views.forecast.photo = response.query.results.photo;

				weatherflickr.views.forecast.setData();

				weatherflickr.views.viewport.setActiveItem(
				            weatherflickr.views.forecast
				);
				Ext.getBody().unmask();
				return;
			}
		} );
		return;
	}

});