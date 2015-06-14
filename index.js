var fs = require('fs');
var OAuth2 = require('oauth').OAuth2;

exports.handler = function(event, context) {
    var configJSON;
    var config;
    
    configJSON = fs.readFileSync('config.json', {encoding: 'utf-8'});
    config = JSON.parse(configJSON);

    if (!config) return context.fail('Failed to read configuration');
    
    var oauth2 = new OAuth2(config.clientID, config.clientSecret, config.baseURI, null, config.endpointURI);

    var options = {};
    if (config.callbackURI) options.redirect_uri = config.callbackURI;
                            
    oauth2.getOAuthAccessToken(
        event.code,
        options,
        function (e, access_token, refresh_token, results) {
            if (e) return context.fail("Server responded with a " + e.statusCode + " status");
            if (results.error) return context.fail(results.error_description);
            
            context.succeed(access_token);
        }
    );
};

