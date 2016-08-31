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

import Vue from "vue"
import Vuex from "vuex"

// Make vue aware of vuex
Vue.use(Vuex)
Vue.config.debug = true

// Are we in debug mode?
const debug = process.env.NODE_ENV !== 'production'

// Is Vuem loaded?
let isLoaded = false;

// Vuem modules
let vuemModules

// vuexStore is the main Vuex store aggregating 'stores' vuem modules
let vuexStore

/**
 * Check if we can use the app
 *
 * @returns {boolean}
 */
function canRun() {
    let errors = []

    // Check if Vuem is already launched
    if (isLoaded) {
        errors.push('Vuem is already loaded. Please call Vuem.use() only once by passing an Array of modules as argument.')
    }
    isLoaded = true;

    // Module names check
    let moduleNames = {}
    vuemModules.map(function (module) {
        if (moduleNames[module.name]) {
            errors.push('Module named "' + module.name + '" already exists.')
        }
        moduleNames[module.name] = module.name
    })

    // Manage return statement
    if (errors.length) {
        errors.map(function (error) {
            console.error('[vuem] ' + error)
        })

        return false
    }

    return true
}

/**
 * Build Vuex store
 */
function makeVuexStore() {

    // Create a vuexModules object that contains all Vuem stores
    let vuexModules = {}

    vuemModules.map(function (module) {
        if (module.store) {
            Object.assign(vuexModules, {[module.name]: module.store})
        }
    })

    // Make the actual Vuex store
    vuexStore = new Vuex.Store({
        modules: vuexModules,
        strict: debug,
    })
}

/**
 * Create all Vue instances based on Vuem components
 */
function makeVueInstances() {
    vuemModules.map(function (module) {
        if (module.components) {
            module.components.map(function (component) {
                new Vue({...component, store: vuexStore})
            })
        }
    })
}

/**
 * Launch Vuem with passed Vuem modules
 *
 * @param {Array} modules
 */
function use(modules) {

    vuemModules = modules

    if (canRun()) {
        makeVuexStore()
        makeVueInstances()
    }
}

/**
 * Expose vuem
 */
let vuem = {
    use: use
}

export default vuem
export {Vue}
export {Vuex}

