function CmsWidget(config) {

    if (!config.id) {
        throw "A cms widget must have defined it\'s id";
    }

    var w = new Widget(config);
    
    w.loadAjaxHTMLContent = function(str, cacheMaxAge) {
        cacheMaxAge = cacheMaxAge || null;
        w.getBody().style.backgroundImage = 'url(img/loadbar.gif)';
        $_GET(str, function(response) {
            w.getBody().style.backgroundImage = '';
            if (!response) {
                w.getBody().innerHTML = '<div class="DomWidgetError">Error loading content from '+ w.config.html+'</div>';
                return;
            } else {
                w.getBody().innerHTML = response;
            }
        }, cacheMaxAge);
    };
    
    w.renderFeedContent = function(feed, params, render, renderParams, cacheMaxAge) {
        w.getBody().style.backgroundImage = 'url(img/loadbar.gif)';
        var arr = [];
        
        arr.addObject(params);
        
        $_JSON_POST(feed, arr, function(json_response) {
            w.getBody().style.backgroundImage = '';
            try {
                var rnd = eval('new '.concat(render).concat('()'));
                
                if (renderParams) rnd.setParams(renderParams);
                
                w.getBody().innerHTML = '';
                w.getBody().appendChild(rnd.render(json_response, w));
            } catch (ex) {
                w.getBody().innerHTML = '<div class="DomWidgetError">Widget Exception: <br />'+ex+'</div>';
            }
        }, typeof(cacheMaxAge) != 'undefined' ? cacheMaxAge : null);
    };
    
    w.addForm = function(configURL) {
        w.getBody().style.backgroundImage = 'url(img/loadbar.gif)';
        var arr = [];
        
        $_JSON_POST("/forms/"+configURL+".form", arr, function(formConfig) {
            
            w.getBody().style.backgroundImage = '';
            
            if (!formConfig) {
                w.getBody().innerHTML = '<div class="DomWidgetError">Bad form configuration response (got "'+formConfig+'")</div>';
                return;
            }
            
            if (!w.config.action) { 
                alert('Action not defined on form id '+w.config.id);
                return;
            }
            
            w.form = new TForm(formConfig, w.config.action, w.config.submit, w.config.reset);
            w.form.widget = w;
            
            w.getBody().appendChild(w.form);
            
        });
    };
    
    switch (true) {
        case typeof config.html != 'undefined': {
            w.loadAjaxHTMLContent(config.html, typeof(config.cacheMaxAge) != 'undefined' ? config.cacheMaxAge : null);
            break;
        }
        case typeof config.render != 'undefined': {
            if (typeof config.feed == 'undefined')
                throw 'Missing "feed" from widget config';
            if (typeof config.params == 'undefined')
                throw 'Missing "params" from widget config';
                
            w.renderFeedContent(config.feed, config.params, config.render, config.renderParams ? config.renderParams : null, config.cacheMaxAge ? config.cacheMaxAge : null);
            break;
        }
        case typeof config.form != 'undefined': {
            w.addForm(config.form);
        }
    }
    
    return w;
}