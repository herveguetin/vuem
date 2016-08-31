# What is Vuem?

Vuem stands for "Vue Modules".

# What does Vuem do?

- Vuem allows to build your Vue.js + Vuex app in a more modular way.
- You can gather your components, actions and stores in clearer folder structures.
- You can also forget about importing Vue and Vuex in all files where it is usually required.

# How to use

### Register your modules with Vuem

All you have to do is register your modules with Vuem.
A good idea is to have a `_register.js` file doing the job:

```
import store from "./store";
import firstComponent from "./first-component";
import secondComponent from "./second-component";

export default {
    name: 'demo',
    components: [firstComponent, secondComponent],
    store
}
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

Then, in your main app JS file:

```
import Vuem from "vuem";
import demo from "./demo/_register";
// import other_module from "./other_module/_register";

Vuem.use([
    demo
    //, other_module
]);
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