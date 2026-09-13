"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignore_context_change = exports.$ = exports.trigger_fn_context = exports.extend_trigger_func = exports.callback_objects = exports.prepareResultingLevelString = exports.printExportStats = exports.assertGroupLimit = exports.shouldEnforceGroupLimit = exports.limit = exports.prep_lvl = exports.levelstring = exports.optimize = exports.indexOfFrom = exports.GROUP_LIMIT = exports.add_fn = exports.isRootContextName = exports.removeUndefinedProps = exports.addGroupsToObject = exports.toArray = exports.obj_to_levelstring_notype = exports.obj_to_levelstring = exports.find_free = exports.legacyObjectPropMappings = exports.level = exports.levelstring_to_obj = exports.a_separated_keys = exports.dot_separated_keys = exports.obj_props = exports.objectPropNamesById = exports.wait = exports.trigger_function = exports.trigger = exports.object = exports.registerExplicitTypes = exports.block_fn = exports.color_fn = exports.group_fn = exports.Context = exports.unknown_b = exports.unknown_c = exports.unknown_g = exports.getNextFreeId = exports.allKnown = exports.state = exports.extract = exports.expectedPropTypes = exports.$block = exports.$color = exports.$group = void 0;
exports.rgba = exports.rgb = exports.reverse = exports.speed = exports.hsv = void 0;
exports.exportConfig = exportConfig;
exports.range = range;
/**
 * @module core
 */
const crypto_1 = __importDefault(require("crypto"));
const group_1 = __importDefault(require("./types/group"));
exports.$group = group_1.default;
const color_1 = __importDefault(require("./types/color"));
exports.$color = color_1.default;
const block_1 = __importDefault(require("./types/block"));
exports.$block = block_1.default;
const obj_props_1 = __importDefault(require("./properties/obj_props"));
const ws_1 = __importDefault(require("ws"));
const reader_1 = require("./reader");
exports.expectedPropTypes = {};
/**
 * extracts values from a dictionary into the global scope.
 * @param {Dictionary} dict dictionary to extract
 * @category Functions
 */
const extract = (dict) => {
    Object.entries(dict).forEach(([key, value]) => {
        global[key] = value;
    });
};
exports.extract = extract;
// Internal state
exports.state = {
    allKnown: {
        groups: [],
        colors: [],
        blocks: []
    },
    triggerPositioningAllowed: true,
    triggerStartY: 6000,
    triggerIndex: 0,
    cleanupGroupId: 9999,
    generatedLevelString: '',
    importedLevelString: '',
    levelPrepared: false,
    callback_objects_fn: (x) => x,
};
// Only link all_known for backward compatibility if it's already used by external scripts.
// The library itself now uses state.allKnown.
if (!global.all_known) {
    global.all_known = exports.state.allKnown;
}
exports.allKnown = exports.state.allKnown;
let [lastUnavailableGroup, lastUnavailableColor, lastUnavailableBlock] = [0, 0, 0];
const getNextFreeId = (_current, prop, push = true) => {
    const arr = exports.allKnown[prop];
    if (arr.length === 0) {
        if (push)
            arr.push(1);
        return 1;
    }
    arr.sort((a, b) => a - b);
    if (arr[0] > 1 && push) {
        arr.unshift(1);
        return 1;
    }
    let result;
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1] + 1) {
            result = arr[i - 1] + 1;
            break;
        }
    }
    if (!result)
        result = arr[arr.length - 1] + 1;
    if (push)
        exports.allKnown[prop].push(result);
    return result;
};
exports.getNextFreeId = getNextFreeId;
/**
 * creates and returns an unavailable group id.
 * @returns {any} resulting group id
 * @category Functions
 */
const unknown_g = () => {
    lastUnavailableGroup++;
    lastUnavailableGroup = (0, exports.getNextFreeId)(lastUnavailableGroup, 'groups');
    return new group_1.default(lastUnavailableGroup);
};
exports.unknown_g = unknown_g;
/**
 * creates and returns an unavailable color id.
 * @returns {any} resulting color id
 * @category Functions
 */
const unknown_c = () => {
    lastUnavailableColor++;
    lastUnavailableColor = (0, exports.getNextFreeId)(lastUnavailableColor, 'colors');
    return new color_1.default(lastUnavailableColor);
};
exports.unknown_c = unknown_c;
/**
 * creates and returns an unavailable block id.
 * @returns {any} resulting block id
 * @category Functions
 */
const unknown_b = () => {
    lastUnavailableBlock++;
    lastUnavailableBlock = (0, exports.getNextFreeId)(lastUnavailableBlock, 'blocks');
    return new block_1.default(lastUnavailableBlock);
};
exports.unknown_b = unknown_b;
/**
 * Class allowing you to interfere with contexts, which are wrappers that assign groups to different objects
 */
class Context {
    /**
     * Creates a new context
     * @param {string} name Name of context
     * @param {boolean} [setToDefault=false] Whether to automatically switch to the context
     * @param {any} [group=unknown_g()] The group to give to the context
     */
    constructor(name, setToDefault = false, group = (0, exports.unknown_g)()) {
        this.name = name;
        this.group = group;
        this.objects = [];
        this.children = [];
        Context.last_contexts[name] = name;
        if (setToDefault)
            Context.set(name);
        Context.add(this);
    }
    /**
     * Switches the context
     * @param {string|any} name Name or group of context to switch to
     */
    static set(name) {
        if (typeof name === 'object' && name?.value) {
            Context.current = Context.findByGroup(name).name;
            return;
        }
        Context.current = name;
    }
    /**
     * Converts an object into a context
     * @param {Context} context Object to convert into a context
     */
    static add(context) {
        Context.list[context.name] = context;
    }
    /**
     * Adds an object into the current context
     * @param {any} objectToAdd Object to add into current context
     */
    static addObject(objectToAdd) {
        if (objectToAdd.type === 'object') {
            objectToAdd = exports.state.callback_objects_fn(objectToAdd) || objectToAdd;
            Context.findByName(Context.current).objects.push(objectToAdd.obj_props);
            return;
        }
        Context.findByName(Context.current).objects.push(objectToAdd);
    }
    /**
     * Links an existing context into the current one, allowing you to find the parent context of another context
     * @param {string} context Context to link into current
     * @param {string} [ctxLink] Optional context that should be the parent of input context
     */
    static link(context, ctxLink = undefined) {
        const input_context = Context.findByName(context);
        const curr_ctx = !ctxLink ? Context.findByName(Context.current) : Context.findByName(ctxLink);
        if (Context.isLinked(input_context)) {
            input_context.linked_to = curr_ctx.linked_to;
            Context.last_context_children[input_context.linked_to] = context;
        }
        else {
            input_context.linked_to = curr_ctx.name;
            Context.last_contexts[context] = input_context.name;
            Context.last_context_children[context] = curr_ctx.name;
        }
        curr_ctx.children.push(context);
    }
    /**
     * Checks if a context has a parent
     * @param {Context} ctx Context to check for parent
     * @returns {boolean} Whether context has a parent
     */
    static isLinked(ctx) {
        return 'linked_to' in ctx;
    }
    /**
     * Finds a context based off of its assigned group
     * @param {any} groupToSearch
     * @returns {Context} Found context
     */
    static findByGroup(groupToSearch) {
        if (typeof groupToSearch === 'number') {
            groupToSearch = (0, exports.group_fn)(groupToSearch);
        }
        else if (!(groupToSearch instanceof group_1.default)) {
            throw new Error(`Expected number or $group instance, got ${groupToSearch} with type ${typeof groupToSearch}`);
        }
        for (const key in Context.list) {
            if (Context.list[key].group.value === groupToSearch.value) {
                return Context.list[key];
            }
        }
        return undefined;
    }
    /**
     * Finds a context based off of its name
     * @returns {Context} Found context
     */
    static findByName(name) {
        return Context.list[name];
    }
}
exports.Context = Context;
Context.last_contexts = {};
Context.last_context_children = {};
/**
 * The name of the current context
 */
Context.current = 'global';
/**
 * A list of all contexts added
 */
Context.list = {};
new Context('global');
/**
 * converts a number to a group.
 * @param {number} x - the number to convert to a group.
 * @returns {any}
 * @category Functions
 */
const group_fn = (x) => new group_1.default(x);
exports.group_fn = group_fn;
/**
 * converts a number to a color.
 * @param {number} x - the number to convert to a color.
 * @returns {any}
 * @category Functions
 */
const color_fn = (x) => new color_1.default(x);
exports.color_fn = color_fn;
/**
 * converts a number to a block.
 * @param {number} x - the number to convert to a block.
 * @returns {any}
 * @category Functions
 */
const block_fn = (x) => new block_1.default(x);
exports.block_fn = block_fn;
const registerExplicitTypes = (definitions) => {
    definitions.forEach((definition) => {
        const [typeName, ...aliases] = definition.split('/');
        aliases.forEach((alias) => {
            if (!exports.expectedPropTypes[alias]) {
                exports.expectedPropTypes[alias] = typeName;
                return;
            }
            exports.expectedPropTypes[alias] = [exports.expectedPropTypes[alias]].flat().concat(typeName);
        });
    });
};
exports.registerExplicitTypes = registerExplicitTypes;
(0, exports.registerExplicitTypes)([
    'group/TARGET/GROUPS/GROUP_PARENTS/GR_BL/GR_BR/GR_TL/GR_TR/TRUE_ID/FALSE_ID/ANIMATION_GID/TARGET_POS/FOLLOW/CENTER/TARGET_DIR_CENTER/SHADER_CENTER_ID',
    'color/TARGET/TARGET_COLOR/COLOR/COLOR_2/SHADER_TINT_CHANNEL',
    'block/BLOCK_A/BLOCK_B',
]);
const resolveObjectProperty = (prop) => {
    if (typeof prop === 'string' && Number.isNaN(Number.parseInt(prop, 10))) {
        return prop;
    }
    return obj_props_1.default[prop] || prop;
};
/**
 * takes a dictionary with object props and converts it into an object.
 * @param {Dictionary} prop dictionary to convert to object
 * @returns {GJsObject}
 * @category Functions
 */
const object = (dict) => {
    const return_val = {
        type: 'object',
        obj_props: dict,
        with: (prop, val) => {
            dict[resolveObjectProperty(prop)] = val;
            return return_val;
        },
        add: () => Context.addObject(return_val)
    };
    return return_val;
};
exports.object = object;
/**
 * takes a dictionary with object props and converts it into a trigger.
 * @param {Dictionary} dict dictionary to convert to trigger
 * @returns {GJsObject}
 * @category Functions
 */
const trigger = (dict) => {
    const iobj = (0, exports.object)(dict);
    if (exports.state.triggerPositioningAllowed) {
        const xMovementAllowed = Context.list[Context.current].name !== 'global';
        if (xMovementAllowed) {
            iobj.obj_props.X = (exports.state.triggerIndex * 30);
            iobj.obj_props.Y = exports.state.triggerStartY;
        }
        else {
            iobj.obj_props.Y = exports.state.triggerStartY - (exports.state.triggerIndex * 30);
        }
    }
    exports.state.triggerIndex++;
    return iobj;
};
exports.trigger = trigger;
/**
 * Creates a "trigger function" in which triggers can be stored inside of a single group
 * @param {Function} cb Function storing triggers to put inside of group
 * @returns {any} Group ID of trigger function
 * @category Functions
 */
const trigger_function = (cb) => {
    const oldContext = Context.current;
    // Explicitly call unknown_g() to ensure proper coordination with unknown_g calls
    const generatedGroup = (0, exports.unknown_g)();
    const newContext = new Context(crypto_1.default.randomUUID(), true, generatedGroup);
    cb(newContext.group);
    Context.set(oldContext);
    return newContext.group;
};
exports.trigger_function = trigger_function;
/**
 * Waits for X seconds
 * @param {Number} time Amount of seconds to wait
 * @category Functions
 */
const wait = (time) => {
    if (time === 0)
        return;
    const id = crypto_1.default.randomUUID();
    const oldContext = Context.current;
    const newContext = new Context(id);
    (0, exports.add_fn)({
        type: 'object',
        obj_props: {
            OBJ_ID: 1268,
            SPAWN_DURATION: time,
            TARGET: newContext.group,
        },
        add: () => Context.addObject({
            OBJ_ID: 1268,
            SPAWN_DURATION: time,
            TARGET: newContext.group,
        })
    });
    Context.set(id);
    Context.link(newContext.name, oldContext);
};
exports.wait = wait;
exports.objectPropNamesById = {};
for (var i in obj_props_1.default) {
    exports.objectPropNamesById[obj_props_1.default[i]] = i;
}
/**
 * See [Object Properties](/G.js/documents/Object_Properties.html).
 */
exports.obj_props = exports.objectPropNamesById;
exports.dot_separated_keys = [57, 442, 274].map(x => x.toString());
exports.a_separated_keys = [43].map(x => x.toString());
/**
 * Converts levelstring to a GD object
 * @param string Input levelstring
 * @returns {Dictionary} converted object (unprocessed; type conversions are not done automatically)
 * @category Functions
 */
const levelstring_to_obj = (string) => {
    const objects = [];
    string
        .split(';')
        .slice(0, -1)
        .forEach((x) => {
        const r = {};
        const spl = x.split(',');
        spl.forEach((x, i) => {
            if (!(i % 2)) {
                const obj_prop = parseInt(x);
                let value = spl[i + 1];
                if (typeof value === 'string' && exports.dot_separated_keys.includes(obj_prop.toString())) {
                    value = value.split('.').map(x => parseInt(x));
                }
                if (typeof value !== 'object' && !exports.a_separated_keys.includes(obj_prop.toString())) {
                    if (!isNaN(parseFloat(value)))
                        value = parseFloat(value);
                    if (!isNaN(parseInt(value)) && typeof value !== 'number')
                        value = parseInt(value);
                }
                r[obj_props_1.default[obj_prop] || obj_prop] = value;
            }
        });
        objects.push(r);
    });
    return objects;
};
exports.levelstring_to_obj = levelstring_to_obj;
/**
 * Helper for reading existing level info
 * @see {@link Level}
 */
exports.level = {
    objects: [],
    raw_levelstring: '',
    get_objects: function (prop, pattern) {
        let level_arr = (0, exports.levelstring_to_obj)(this.raw_levelstring);
        return level_arr.filter(o => {
            let cond_1 = prop in o || obj_props_1.default[prop] in o, cond_2 = false;
            if (cond_1)
                cond_2 = pattern(o[prop] || o[obj_props_1.default[prop]]);
            return cond_1 && cond_2;
        });
    }
};
exports.legacyObjectPropMappings = {
    696969: '80',
    420420: '80',
    6942069: '95',
    6969: '51',
    42069420: '88',
    32984398: '51',
    584932: '71',
    78534: '480',
    45389: '481',
    93289: '482',
    8754: '51',
    8459: '71',
    7187327378823: '71',
    3478234: '71',
    45893: '392',
    237894: '10',
    347832: '70',
    34982398: '188',
    4376890: '512',
    4895490381243: '51',
    45890903: '290',
    487999230: '179',
    40943900394: '191',
    93423877: '181',
    8765437289: '182',
    645789320: '180',
    8765434: '188',
    21678934: '190'
};
const find_free = (str) => {
    let startIndex = 0;
    let endIndex;
    while ((endIndex = str.indexOf(';', startIndex)) !== -1) {
        const segment = str.substring(startIndex, endIndex);
        startIndex = endIndex + 1;
        if (!segment)
            continue;
        exports.level.objects.push(segment);
        exports.level.raw_levelstring += segment + ';';
        const ro = segment.split(',');
        for (let i = 0; i < ro.length; i += 2) {
            const key = ro[i];
            const value = ro[i + 1];
            switch (key) {
                case "57":
                    const detected_groups = value.split('.').map(Number).filter(num => num !== exports.state.cleanupGroupId);
                    for (const group of detected_groups) {
                        if (!exports.allKnown.groups.includes(group))
                            exports.allKnown.groups.push(group);
                        lastUnavailableGroup = (0, exports.getNextFreeId)(group, 'groups', false);
                    }
                    break;
                case "21":
                case "22":
                    const detected_color = parseInt(value);
                    if (!exports.allKnown.colors.includes(detected_color))
                        exports.allKnown.colors.push(detected_color);
                    lastUnavailableColor = (0, exports.getNextFreeId)(detected_color, 'colors', false);
                    break;
                case "80":
                case "95":
                    const detected_block = parseInt(value);
                    if (!exports.allKnown.blocks.includes(detected_block))
                        exports.allKnown.blocks.push(detected_block);
                    lastUnavailableBlock = (0, exports.getNextFreeId)(detected_block, 'blocks', false);
                    break;
            }
        }
    }
};
exports.find_free = find_free;
/**
 * Converts an object to levelstring
 * @param {GJsObject} object Object to convert to levelstring
 * @returns {String} Output levelstring
 */
const obj_to_levelstring = (l) => {
    let res = '';
    for (var d_ in l) {
        let val = l[d_];
        let key = exports.objectPropNamesById[d_];
        if (!isNaN(parseInt(d_)))
            key = d_;
        if (typeof val === 'boolean')
            val = +val;
        const hasTypedValue = val !== null && val !== undefined && Object.prototype.hasOwnProperty.call(Object(val), 'value');
        if (exports.expectedPropTypes[d_] && !hasTypedValue) {
            if (typeof val === 'object' && exports.dot_separated_keys.includes(key)) {
                val = val.map((x) => x.value).filter(x => x && x !== '').join('.');
            }
            else {
                throw `Expected type "${exports.expectedPropTypes[obj_props_1.default[parseInt(key)]]}", got "${typeof val}"`;
            }
        }
        else if (exports.expectedPropTypes[d_] && hasTypedValue) {
            const cond = typeof exports.expectedPropTypes[d_] === "string" ? (val.type === exports.expectedPropTypes[d_]) : (exports.expectedPropTypes[d_].includes(val.type));
            if (cond) {
                val = val.value;
            }
            else {
                throw `Expected type "${exports.expectedPropTypes[d_]}", got "${val.type}"`;
            }
        }
        if (exports.legacyObjectPropMappings.hasOwnProperty(key)) {
            key = exports.legacyObjectPropMappings[key];
        }
        res += `${key},${val},`;
    }
    return res.slice(0, -1) + ';';
};
exports.obj_to_levelstring = obj_to_levelstring;
const obj_to_levelstring_notype = (l) => {
    let res = '';
    for (var d_ in l) {
        let val = l[d_];
        let key = exports.objectPropNamesById[d_] ?? d_;
        if (!isNaN(parseInt(d_)))
            key = d_;
        if (typeof val === 'boolean')
            val = +val;
        if (exports.expectedPropTypes[d_]) {
            if (typeof val !== 'object' || val === null) {
                // raw values are allowed for untyped imported level strings.
            }
            else if (val.value !== undefined) {
                const cond = typeof exports.expectedPropTypes[d_] === "string"
                    ? val.type === exports.expectedPropTypes[d_]
                    : exports.expectedPropTypes[d_].includes(val.type);
                if (cond) {
                    val = val.value;
                }
                else {
                    throw `Expected type "${exports.expectedPropTypes[d_]}", got "${val.type}"`;
                }
            }
            else if (Array.isArray(val) && exports.dot_separated_keys.includes(key)) {
                val = val
                    .map(x => (x && x.value !== undefined ? x.value : x))
                    .filter(x => x !== undefined && x !== '')
                    .join('.');
            }
            else {
                throw `Invalid value for key "${key}"`;
            }
        }
        if (exports.legacyObjectPropMappings.hasOwnProperty(key)) {
            key = exports.legacyObjectPropMappings[key];
        }
        res += `${key},${val},`;
    }
    return res.slice(0, -1) + ';';
};
exports.obj_to_levelstring_notype = obj_to_levelstring_notype;
const toArray = (value) => Array.isArray(value) ? value : [value];
exports.toArray = toArray;
const addGroupsToObject = (objectProps, groups, forceArray = true) => {
    const groupsToAdd = (0, exports.toArray)(groups);
    if (!objectProps.GROUPS) {
        objectProps.GROUPS = forceArray || groupsToAdd.length > 1 ? groupsToAdd : groupsToAdd[0];
        return;
    }
    objectProps.GROUPS = (0, exports.toArray)(objectProps.GROUPS);
    objectProps.GROUPS.push(...groupsToAdd);
};
exports.addGroupsToObject = addGroupsToObject;
const removeUndefinedProps = (objectProps) => {
    Object.keys(objectProps).forEach((prop) => {
        if (objectProps[prop] === undefined)
            delete objectProps[prop];
    });
};
exports.removeUndefinedProps = removeUndefinedProps;
const isRootContextName = (name) => name === 'global' || name === 'GLOBAL_FULL';
exports.isRootContextName = isRootContextName;
const add_fn = (...objects) => {
    objects.forEach(o => {
        if (o?.type !== "object") {
            process.emitWarning('Using plain dictionaries as an argument to $.add is deprecated and using the object() function will be enforced in the future.', {
                type: 'DeprecationWarning',
                detail: 'Wrap the object() function around the dictionary as an argument to $.add instead of using plain dictionaries.'
            });
        }
        if (o?.type === "object") {
            o.add();
            return;
        }
        let newo = o;
        if (newo.with)
            delete newo.with;
        Context.addObject(newo);
    });
};
exports.add_fn = add_fn;
exports.GROUP_LIMIT = 9999;
const indexOfFrom = (array, value, startIndex) => {
    const newArr = array.slice(startIndex);
    return newArr.indexOf(value) !== -1 ? newArr.indexOf(value) + (array.length - newArr.length) : -1;
};
exports.indexOfFrom = indexOfFrom;
const optimize = () => {
    for (const child in Context.last_context_children) {
        const parent = Context.list[Context.last_context_children[child]];
        const childCtx = Context.list[child];
        if (childCtx.objects.length === 0) {
            delete Context.list[child];
            const emptyCallIndex = parent.objects.map(x => {
                if (!x?.TARGET)
                    return false;
                return x.TARGET.value === childCtx.group.value;
            });
            parent.objects = parent.objects.filter((_, i) => i !== (0, exports.indexOfFrom)(emptyCallIndex, true, i));
        }
    }
};
exports.optimize = optimize;
/**
 * Parses and manipulates levelstrings, returning helper methods for editing/adding.
 * @param {string} string Input levelstring
 * @category Functions
 */
const levelstring = (string) => {
    let splitString = string.split(';');
    if (splitString[splitString.length - 1] === '')
        splitString = splitString.slice(0, -1);
    const processed = [];
    const newpairs = [];
    splitString.forEach((obj, splitIdx) => {
        const objdict = (0, exports.levelstring_to_obj)(obj + ';')[0];
        (0, exports.addGroupsToObject)(objdict, (0, exports.group_fn)(exports.state.cleanupGroupId), false);
        obj = (0, exports.obj_to_levelstring_notype)(objdict);
        const pairs = [];
        const items = obj.split(",");
        for (let i = 0; i < items.length; i += 2) {
            const first = parseInt(items[i]);
            const second = items[i + 1];
            pairs.push([first, second]);
        }
        processed.push({
            obj_props: objdict,
            edit: (dict) => {
                if (dict.GROUPS) {
                    if (!Array.isArray(dict.GROUPS))
                        dict.GROUPS = [dict.GROUPS];
                    const untyped = dict.GROUPS.map(x => x.value ?? x);
                    if (!untyped.includes(exports.state.cleanupGroupId)) {
                        dict.GROUPS.push((0, exports.group_fn)(exports.state.cleanupGroupId));
                    }
                }
                let commastring = (0, exports.obj_to_levelstring)(dict).slice(0, -1);
                const pairs2 = [];
                const items = commastring.split(",");
                for (let i = 0; i < items.length; i += 2) {
                    const first = parseInt(items[i]);
                    const second = items[i + 1];
                    pairs2.push([first, second]);
                }
                let replaceOffset = 0;
                pairs2.forEach((val, ind) => {
                    let keys = pairs.map(y => y[0]);
                    let replacePoint = keys.indexOf(val[0]);
                    if (replacePoint === -1) {
                        replacePoint = pairs.length + replaceOffset++;
                    }
                    pairs[replacePoint] = val;
                });
                return processed[splitIdx];
            },
            add: () => {
                exports.state.importedLevelString += pairs.flat().join(',') + ';';
            }
        });
        newpairs.push(pairs);
    });
    return {
        objects: processed,
        add: () => {
            exports.state.importedLevelString += newpairs.map(x => x.join(',')).join(';');
        }
    };
};
exports.levelstring = levelstring;
const prep_lvl = (optimize_op = true, replace = true) => {
    if (exports.state.levelPrepared)
        return;
    if (optimize_op)
        (0, exports.optimize)();
    const name = 'GLOBAL_FULL';
    new Context(name, true, (0, exports.group_fn)(0));
    Context.last_contexts[name] = name;
    for (const contextName in Context.list) {
        const context = Context.findByName(contextName);
        context.objects.forEach(exports.removeUndefinedProps);
        if (!(0, exports.isRootContextName)(contextName)) {
            const objects = context.objects;
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (replace) {
                    (0, exports.addGroupsToObject)(object, [context.group, (0, exports.group_fn)(exports.state.cleanupGroupId)]);
                }
                else {
                    (0, exports.addGroupsToObject)(object, context.group);
                }
                if (!(object.hasOwnProperty("SPAWN_TRIGGERED") || object.hasOwnProperty(exports.obj_props.SPAWN_TRIGGERED))) {
                    object.SPAWN_TRIGGERED = 1;
                }
                if (!(object.hasOwnProperty("MULTI_TRIGGER") || object.hasOwnProperty(exports.obj_props.MULTI_TRIGGER))) {
                    object.MULTI_TRIGGER = 1;
                }
            }
        }
        else {
            const objects = context.objects;
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (replace) {
                    (0, exports.addGroupsToObject)(object, (0, exports.group_fn)(exports.state.cleanupGroupId), false);
                }
            }
        }
        for (let x in context.objects) {
            const r = (0, exports.obj_to_levelstring)(context.objects[x]);
            exports.state.generatedLevelString += r;
        }
    }
    exports.state.generatedLevelString += exports.state.importedLevelString;
    exports.state.levelPrepared = true;
};
exports.prep_lvl = prep_lvl;
exports.limit = exports.GROUP_LIMIT;
const shouldEnforceGroupLimit = (options = {}) => {
    return options.group_count_warning ?? true;
};
exports.shouldEnforceGroupLimit = shouldEnforceGroupLimit;
const assertGroupLimit = (options = {}) => {
    if (lastUnavailableGroup <= exports.limit || !(0, exports.shouldEnforceGroupLimit)(options))
        return;
    throw new Error(`Group count surpasses the limit! (${lastUnavailableGroup}/${exports.limit})`);
};
exports.assertGroupLimit = assertGroupLimit;
const printExportStats = (options = {}, levelName = undefined) => {
    if (!options?.info)
        return;
    if (levelName)
        console.log(`Writing to level: ${levelName}`);
    console.log('Finished, result stats:');
    console.log('Object count:', exports.state.generatedLevelString.split(';').length - 1);
    console.log('Group count:', lastUnavailableGroup);
    console.log('Color count:', lastUnavailableColor);
};
exports.printExportStats = printExportStats;
const prepareResultingLevelString = (options = {}, levelName = undefined) => {
    (0, exports.prep_lvl)(options?.optimize, options?.replacePastObjects);
    (0, exports.assertGroupLimit)(options);
    (0, exports.printExportStats)(options, levelName);
    return exports.state.generatedLevelString;
};
exports.prepareResultingLevelString = prepareResultingLevelString;
function exportConfig(conf) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!conf || typeof conf !== 'object') {
                throw new Error('exportConfig requires a configuration object.');
            }
            const options = conf.options ?? {};
            conf.options = options;
            exports.state.triggerPositioningAllowed = options.triggerPositioningAllowed ?? true;
            exports.state.triggerStartY = options.trigger_pos_start ?? 6000;
            if (options.replacePastObjects === undefined) {
                options.replacePastObjects = true;
            }
            if (options.removeGroup !== undefined) {
                exports.state.cleanupGroupId = typeof options.removeGroup === 'number' ? options.removeGroup : options.removeGroup?.value;
            }
            const remove_past_objects = (lvlstring) => {
                return lvlstring.split(';').filter(x => {
                    let keep = true;
                    const spl = x.split(',');
                    spl.forEach((z, i) => {
                        if (!(i % 2)) {
                            if (z === "57") {
                                let groups = spl[i + 1];
                                if (groups.includes('.')) {
                                    groups = groups.split('.');
                                    if (groups.includes(exports.state.cleanupGroupId.toString())) {
                                        keep = false;
                                    }
                                }
                                else {
                                    if (groups === exports.state.cleanupGroupId.toString()) {
                                        keep = false;
                                    }
                                }
                            }
                        }
                    });
                    return keep;
                }).join(';');
            };
            const group_arr = (arr, x) => arr.reduce((acc, _, i) => (i % x ? acc[acc.length - 1].push(arr[i]) : acc.push([arr[i]]), acc), []);
            switch (conf.type) {
                case 'levelstring':
                    resolve((0, exports.prepareResultingLevelString)(options));
                    return;
                case 'savefile': {
                    const sf_level = await new reader_1.LevelReader(options?.level_name, options?.path, options?.reencrypt);
                    exports.level.level_reader = sf_level;
                    if (!sf_level.data.levelstring)
                        throw new Error(`Level "${sf_level.data.name}" has not been initialized, add any object to initialize the level then rerun this script`);
                    let last = options.replacePastObjects ? remove_past_objects(sf_level.data.levelstring) : sf_level.data.levelstring;
                    (0, exports.find_free)(last);
                    process.on('beforeExit', error => {
                        if (!error) {
                            last += (0, exports.prepareResultingLevelString)(options, sf_level.data.name);
                            sf_level.set(last);
                            sf_level.save();
                            process.exit(0);
                        }
                    });
                    resolve(true);
                    return;
                }
                case 'gmd': {
                    const sf_level_gmd = await new reader_1.SingleLevelReader(options?.path);
                    exports.level.level_reader = sf_level_gmd;
                    if (!sf_level_gmd.data.levelstring)
                        throw new Error(`Level "${sf_level_gmd.data.name}" has not been initialized, add any object to initialize the level then rerun this script`);
                    let last_gmd = options.replacePastObjects ? remove_past_objects(sf_level_gmd.data.levelstring) : sf_level_gmd.data.levelstring;
                    (0, exports.find_free)(last_gmd);
                    process.on('beforeExit', error => {
                        if (!error) {
                            last_gmd += (0, exports.prepareResultingLevelString)(options, sf_level_gmd.data.name);
                            sf_level_gmd.set(last_gmd);
                            sf_level_gmd.save(options?.gmdOutput);
                            process.exit(0);
                        }
                    });
                    resolve(true);
                    return;
                }
                case 'live_editor': {
                    const socket = new ws_1.default('ws://127.0.0.1:1313');
                    socket.addEventListener('message', (event) => {
                        event = JSON.parse(event.data);
                        if (event.response) {
                            (0, exports.find_free)(event.response.split(';').slice(1).join(';'));
                            exports.level.raw_levelstring = event.response;
                            resolve(true);
                            return;
                        }
                        if (event.status !== 'successful')
                            throw new Error(`Live editor failed, ${event.error}: ${event.message}`);
                    });
                    socket.addEventListener('open', () => {
                        if (options.replacePastObjects) {
                            socket.send(JSON.stringify({
                                action: 'REMOVE_OBJECTS',
                                group: exports.state.cleanupGroupId,
                            }));
                        }
                        socket.send(JSON.stringify({
                            action: 'GET_LEVEL_STRING',
                            close: true
                        }));
                        process.on('beforeExit', error => {
                            if (!error) {
                                const socket2 = new ws_1.default('ws://127.0.0.1:1313');
                                socket2.addEventListener('message', (event) => {
                                    event = JSON.parse(event.data);
                                    if (event.response) {
                                        (0, exports.find_free)(event.response.split(';').slice(1).join(';'));
                                    }
                                    if (event.status !== 'successful')
                                        throw new Error(`Live editor failed, ${event.error}: ${event.message}`);
                                });
                                socket2.addEventListener('open', async () => {
                                    const pre_lvlstr = await exportConfig({ type: 'levelstring', options });
                                    const lvlString = group_arr(pre_lvlstr.split(';'), 250).map(x => x.join(';'));
                                    lvlString.forEach((chunk, i) => {
                                        setTimeout(() => {
                                            socket2.send(JSON.stringify({
                                                action: 'ADD_OBJECTS',
                                                objects: chunk + ';',
                                                close: i === lvlString.length - 1
                                            }));
                                            if (i === lvlString.length - 1)
                                                process.exit(0);
                                        }, i * 75);
                                    });
                                });
                            }
                        });
                    });
                    socket.addEventListener('error', () => {
                        throw new Error('Connecting to WSLiveEditor failed. Make sure you have installed the WSLiveEditor mod inside of Geode and have the editor open.');
                    });
                    return;
                }
                default:
                    throw new Error(`The "${conf.type}" configuration type is not valid!`);
            }
        }
        catch (error) {
            reject(error);
        }
    });
}
const callback_objects = (cb) => {
    exports.state.callback_objects_fn = cb;
};
exports.callback_objects = callback_objects;
const extend_trigger_func = (t, cb) => {
    const context = Context.findByGroup(t);
    const oldContext = Context.current;
    Context.set(Context.last_contexts[context.name]);
    cb(context.group);
    Context.set(oldContext);
};
exports.extend_trigger_func = extend_trigger_func;
const trigger_fn_context = () => Context.findByName(Context.current).group;
exports.trigger_fn_context = trigger_fn_context;
exports.$ = {
    add: exports.add_fn,
    exportConfig,
    print: (...args) => console.log(...args),
    callback_objects: exports.callback_objects,
    extend_trigger_func: exports.extend_trigger_func,
    trigger_fn_context: exports.trigger_fn_context
};
/**
 * Executes a function while preserving the current context (doesn't change contexts).
 * @param {Function} fn Function to execute
 * @category Functions
 */
const ignore_context_change = (fn) => {
    const old_context = Context.current;
    fn();
    Context.set(old_context);
};
exports.ignore_context_change = ignore_context_change;
/**
 * Helper for creating a range
 * @param start Start for range
 * @param end End for range
 * @param step How many steps
 * @returns {Array} Output array
 * @category Functions
 */
function range(start, end, step = 1) {
    let sw = false;
    if (start > end) {
        sw = true;
        [start, end] = [end, start];
        step = Math.abs(step);
    }
    let result = Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
    if (sw)
        result = result.reverse();
    return result;
}
;
/**
 * Generates HSV string
 * @param hue Hue
 * @param sat Saturation
 * @param bright Brightness
 * @param sat_checked Whether saturation box is checked in-game
 * @param bright_checked Whether brightness box is checked in-game
 * @returns {String} Output HSV string
 * @category Functions
 */
const hsv = (hue, sat, bright, sat_checked = false, bright_checked = false) => {
    return [hue, sat, bright, +sat_checked, +bright_checked].join("a");
};
exports.hsv = hsv;
/**
 * Converts a speed multiplier into an in-game speed value
 * @param {number} x Input speed multiplier
 * @returns {number}
 * @category Functions
 */
const speed = (x) => (5.170649 + 8.019236 * x - 3.726698 * Math.pow(x, 2) + 1.000783 * Math.pow(x, 3) - 0.08783546 * Math.pow(x, 4)) * 30;
exports.speed = speed;
/**
 * Reverses level direction
 * @category Functions
 */
const reverse = () => {
    exports.$.add((0, exports.trigger)({
        OBJ_ID: 1917
    }));
};
exports.reverse = reverse;
/**
 * Creates an RGB triplet
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 * @returns {number[]}
 * @category Functions
 */
const rgb = (r, g, b) => [r, g, b];
exports.rgb = rgb;
/**
 * Creates an RGBA quadruplet
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 * @param {number} a Alpha value
 * @returns {number[]}
 * @category Functions
 */
const rgba = (r, g, b, a) => [r, g, b, a];
exports.rgba = rgba;
String.prototype.to_obj = function () {
    let or = (0, exports.object)({
        OBJ_ID: 914,
        TEXT: Buffer.from(this.toString()).toString('base64')
    });
    return or;
};
