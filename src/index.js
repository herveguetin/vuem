/* @preserve
 * The MIT License (MIT)
 *
 * @copyright Hervé Guétin <herve.guetin@gmail.com> <@herveguetin>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import Vue from "vue";
import Vuex from "vuex";

// Make vue aware of vuex
Vue.use(Vuex)
Vue.config.debug = true

// Are we in debug mode?
const debug = process.env.NODE_ENV !== 'production'

// vuem modules
let modules = {}

// Components are components declared in vuem modules
let components = []

// vueComponents are VueJS components used in the vuem instance
let vueComponents = []

// Stores are Vuex main store components declared in vuem modules
let stores = {}

// vuexStore is the main Vuex store aggregating 'stores' vuem modules
let vuexStore = {}

/**
 * Let's init vuem with existing modules stores and components
 */
function init() {

    // Init Vuex Store
    vuexStore = {}
    vuexStore = new Vuex.Store({
        modules: stores,
        strict: debug,
    })

    // Init VueJS components
    vueComponents = []
    components.map(function (component) {
        vueComponents.push(new Vue({...component, store: vuexStore}))
    });
}

/**
 * Add a new module to vuem
 *
 * @param module
 */
function registerModule(name, module) {
    
    // Check that a module with the same name does not exist
    if (modules[name]) {
        throw new Error('module with name ' + name + ' already exists')
    }
    modules[name] = module;

    // Populate vuem stores with module store
    if (module.store) {
        Object.assign(stores, {[name]: module.store})
    }

    // Populate vuem components with module components
    if (module.components) {
        module.components.map(function (component) {
            components.push(component)
        })
    }

    // (re)init vuem in order to make all modules work nicely together
    init()
}

/**
 * Expose vuem
 */
let vuem = {};

// Module registration
vuem.registerModule = registerModule;

export default vuem;
export {Vue};
export {Vuex};

