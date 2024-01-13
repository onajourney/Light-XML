# XMLjs
XMLjs is a tiny beautiful XML markup generator.

## API
```js
const XML = require('@ayn/xmljs')

let doc = new XMLjs()
    .fruits(el=>{
        el.mango({ color: 'green'}, 'This mango is not ripe')
        el.bananas(el=>{
            el.babybanana('Quite small')
            el.plantain('Delicious')
        })
    })
    
console.log(doc.getMarkup())
```
Simple and elegant. Constructor takes a string as its argument that allows you to set the documents prolog.

Child elements return an object holding information on siblings and its parent, they also have access to the `getMarkup()` method which returns a subset of the markup.

## Output
```xml
<fruits>
    <mango color="green">This mango is not ripe</mango>
    <bananas>
        <babybanana>Quite small</babybanana>
        <plantain>Delicious</plantain>
    </bananas>
</fruits>
```
