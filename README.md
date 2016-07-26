# What is Vuem?

Vuem stands for "Vue Modules".

# What does Vuem do?

- Vuem allows to build your Vue.js + Vuex app in a more modular way.
- You can gather your components, actions and stores in clearer folder structures.
- You can also forget about importing Vue and Vuex in all files where it is usually required.

# How to use

### Register your module with Vuem

All you have to do is register your module with Vuem.
A good idea is to have a `_register.js` file doing the job:

```
import Vuem from "vuem";
import store from "./store";
import firstComponent from "./components/first-component";
import secondComponent from "./components/second-component";

// Let's tell Vuem that we have a module!
Vuem.registerModule(
    // The module name
    'demo',
    {
        // An array of all Vue.js components from this module
        components: [
            firstComponent,
            secondComponent
        ],

        // The store (app state) for this module.
        // Please note that this store will be populated as a Vuex module whose name/id is the name of the Vuem module ("demo" in this example)
        store
    }
);
```

You can then have the following folder structure:

```
js_source
|-- demo
|   |-- _register.js
|   |-- components
|   |   |-- first-component.js
|   |   `-- second-component.js
|   |-- actions.js
|   `-- store.js
`-- other_module...
```

### Caution about your "store.js" files

Your `store.js` files must export their state and mutations.
For example:

```
// No import required...

let state = {
    some: {
        data: 'Some data'
    }
}

const mutations = {
    SOME_MUTATION (state, newData) {
        state.some.data = newData;
    }
}

// Expose state and mutations to be used by Vuem.
export default {
    state,
    mutations
}
```

### With Webpack

You now just have to tell Webpack to use your `_register.js` files as entry points!
Like so in your `webpack.config.js`:
```
var glob = require("glob")
module.exports = {

    ...
    
    entry: glob.sync('your/path/to/sources/**/_register.js'),
    
    ... 
    
}
```