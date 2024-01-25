class lightXML {
    constructor(prolog = '') {
        // Docs info tag
        this.config = { prolog };

        // Document structure
        this.dom={};
        
        // Allow wild card functions
        return new Proxy(this, this);
    }

    get(target, prop) {
        // If doesn't exist
        if(!this[prop]) {
            // Run our function
            return function(...Args) {
                // defaults
                let attributes = {},
                    content = '',
                    cb = ()=>{},
                    target = (Args[3]) ? Args[3] : this.dom;
                 
                // Adjust first 3 args by type
                for(let [i, arg] of Args.entries()) { 
                    if(i == 3 ) break;

                    switch(typeof arg) {
                        case 'object':
                          attributes = arg
                          break;
                        case 'string':
                          content = arg
                          break;
                        case 'function':
                          cb = arg
                          break;
                      } 
                }
                        
                // Branch
                let obj = {
                    [prop]: {
                        attributes,
                        content,
                        children: [],
                    }
                };

                // Append to parent
                if(target.push) target.push(obj);
                    else target[prop] = obj[prop];
        
                // Modify cb to append to right object
                cb(new Proxy({}, {
                    get:(target, sub_prop)=>{
                        // Prop seems to be symbol when loggin
                        if(typeof sub_prop != 'symbol') {
                            if(sub_prop=='getMarkup') return ()=>this.getMarkup(obj)
                            else if(sub_prop=='parent') return prop
                            else if(sub_prop=='siblings') return obj[prop].children
                            else return (attributes, sub_content, cb)=> this[sub_prop](attributes, sub_content, cb, obj[prop].children) 
                        }
                        
                        else return () => { return { parent: prop, siblings: obj[prop].children } } 
                    }
                }))
    
                return this;
            }
        }
    
        else {
            return this[prop];
        }
    }

    getMarkup(obj) {
        if(!obj) { 
            obj = this.dom;
            var markup = this.config.prolog;
        } else var markup = '';

        let parse = (obj, content ='') => {
            let markup = ''

            for(let el in obj) {

                let formatted_attributes = ''
                
                // Handle attributes
                if(obj[el].attributes)
                    for(let attribute in obj[el].attributes) 
                        formatted_attributes += `${attribute}='${obj[el].attributes[attribute]}'`
                
                // Handle content
                if(typeof obj[el].content == 'string')   
                    content = obj[el].content

                let inner_markup = ''

                // Handle children
                if(obj[el].children) 
                    obj[el].children.forEach(child=>{
                        inner_markup += parse(child, content)
                    })
                
                // Generate tag
                markup += `<${el}${(formatted_attributes) ? ' '+formatted_attributes:""}>${ content+inner_markup+'</'+el+'>'}`

                return markup
            }
        };

        markup += parse(obj || this.dom);
      
        return markup;
    }
}

module.exports = lightXML;