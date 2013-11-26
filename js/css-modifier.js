function CSS_Modifier( css ) {
    
    this.css = css;
    this.ruleBegin = /^(([\s]+)?([a-z\d\_\-\:\[\]\=\s\.\"\'\(\)\>\*\@]+)([\s]+)?(\,)?([\s]+)?)+$/i;
    this.ruleContent = /^\{([\s\S]+?)?\}/;
    this.comment = /\/\*([\s\S]+?)\*\//;
    
    // window.modifier = this;
    
    this.parse = function() {
        var source = this.css;
        var commment;
        var rule, value;
        
        while ( comment = this.comment.exec( source ) ) {
            source = source.replace( comment[0], '' );
        }
        
        var rules = [], o = {};
        
        while ( (rule = source.indexOf('{') ) != -1 ) {
        
            rule = source.substr(0, rule );
        
            o = {
                "rules": rule
            };
            
            source = source.substr( rule.length + 1 );
            
            var value = source.indexOf('}');
            
            if ( value == -1 )
                throw "Cannot parse this css!";
            
            value = source.substr( 0, value );
            source = source.substr( value.length + 1 );
            
            o.value = value;
            o.rules = o.rules.trim('{').replace(/[\s]+/g, ' ').trim();
            o.value = o.value.replace(/[\s]+/g, ' ').trim();
            
            if ( !this.ruleBegin.test( o.rules ) )
                continue;
            
            o.rules = o.rules.split(',');
            for ( var i=0,n=o.rules.length; i<n; i++ )
                o.rules[i] = o.rules[i].trim();
            
            rules.push(o);
            
        }
        
        return rules;
    }
    
    this.inject = function( namespace ) {
        var parsed = this.parse();
        
        var out = '';
        
        for ( var i=0,n=parsed.length; i<n; i++ ) {
            for ( var j=0,m=parsed[i].rules.length; j<m; j++ ) {
                parsed[i].rules[j] = namespace.concat(parsed[i].rules[j] );
            }
            
            out = out + parsed[i].rules.join( ',\n' ) + ' {\n\t' + parsed[i].value + '\n}\n';
        }
        
        return out;
    }
    
    this.toString = function() {
        return css;
    }
    
    return this;
}