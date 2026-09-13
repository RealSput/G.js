/**
 * @module core
 */
import crypto from 'crypto';
import $group from './types/group';
import $color from './types/color';
import $block from './types/block';
import objectPropIds from './properties/obj_props';
import WebSocket from 'ws';
import { LevelReader, SingleLevelReader } from './reader';

export { $group, $color, $block };

export type Dictionary = Record<string | number, any>;
export type KnownIdKind = 'groups' | 'colors' | 'blocks';
export type TriggerCallback = (contextGroup?: any) => any;

/**
 * @category Interfaces
 */
export interface KnownIds {
    groups: number[];
    colors: number[];
    blocks: number[];
}

/**
 * @category Interfaces
 */
export interface GJsObject {
    type: 'object';
    obj_props: Dictionary;
    with(prop: string | number, value: any): GJsObject;
    add(): void;
}

/**
 * @category Interfaces
 */
export interface ExportOptions {
    info?: boolean;
    group_count_warning?: boolean;
    level_name?: string;
    path?: string;
    reencrypt?: boolean;
    optimize?: boolean;
    replacePastObjects?: boolean;
    removeGroup?: number | { value: number };
    triggerPositioningAllowed?: boolean;
    trigger_pos_start?: number;
    gmdOutput?: string;
}

/**
 * @category Interfaces
 */
export interface ExportConfig {
    type: 'levelstring' | 'savefile' | 'live_editor' | 'gmd';
    options?: ExportOptions;
}

/**
 * @category Interfaces
 */
export interface GJsEvent {
    event: (cb: any) => void;
}

/**
 * @category Interfaces
 */
export interface Counter {
    item: any;
    type: number;
    bits: number | undefined;
    add: (amount: number | Counter) => Counter;
    set: (amount: number | Counter) => Counter;
    subtract: (amount: number | Counter) => Counter;
    multiply: (amount: number | Counter) => Counter;
    divide: (amount: number | Counter) => Counter;
    display: (x: number, y: number) => void;
    to_obj: () => GJsObject;
    if_is: (comparison: number, other: number, trig_func: any) => void;
    to_const: (range: any[], cb: (val: any) => void) => void;
    add_to: (item: Counter) => Counter;
    copy_to: (item: Counter) => Counter;
    clone: () => Counter;
    subtract_from: (b: Counter) => Counter;
    reset: () => Counter;
    abs: () => Counter;
    neg: () => Counter;
    mod: (b: number | Counter) => Counter;
    start?: () => void;
    stop?: () => void;
    set_start?: (x: number) => void;
    set_end?: (x: number) => void;
}

/**
 * @category Interfaces
 */
export interface FloatCounter extends Counter {
    round: () => FloatCounter;
    floor: () => FloatCounter;
}

/**
 * @category Interfaces
 */
export interface Gamescene {
    button_a: () => GJsEvent;
    button_b: () => GJsEvent;
    button_a_end: () => GJsEvent;
    button_b_end: () => GJsEvent;
    hidden_group: any;
}

/**
 * @category Interfaces
 */
export interface Song {
    start: () => void;
    edit: (new_volume?: number, new_speed?: number, duration?: number, stop?: boolean, stop_loop?: boolean, gid_1?: any, gid_2?: any, vol_near?: number, vol_med?: number, vol_far?: number, min_dist?: number, dist_2?: number, dist_3?: number, p1?: boolean, p2?: boolean, cam?: boolean, vol_dir?: number) => void;
    stop: () => void;
}

/**
 * @category Interfaces
 */
export interface OptionsTrigger {
    STREAK_ADDITIVE: (v?: boolean) => void;
    HIDE_GROUND: (v?: boolean) => void;
    HIDE_MG: (v?: boolean) => void;
    HIDE_P1: (v?: boolean) => void;
    HIDE_P2: (v?: boolean) => void;
    DISABLE_CONTROLS_P1: (v?: boolean) => void;
    DISABLE_CONTROLS_P2: (v?: boolean) => void;
    UNLINK_DUAL_GRAVITY: (v?: boolean) => void;
    HIDE_ATTEMPTS: (v?: boolean) => void;
    AUDIO_ON_DEATH: (v?: boolean) => void;
    NO_DEATH_SFX: (v?: boolean) => void;
    RESPAWN_TIME: (v: number) => void;
    add: () => void;
}

/**
 * @category Interfaces
 */
export interface TriggerFunctionGroup {
    value: number;
    type: string;
    call: (delay?: number) => void;
    remap: (...args: any[]) => TriggerFunctionGroup;
    stop: () => void;
    // ... any other group methods if they exist
}

export const expectedPropTypes: Record<string, string | string[]> = {};

/**
 * extracts values from a dictionary into the global scope.
 * @param {Dictionary} dict dictionary to extract
 * @category Functions
 */
export const extract = (dict: Dictionary) => {
    Object.entries(dict).forEach(([key, value]) => {
        (global as any)[key] = value;
    });
};

// Internal state
export const state = {
    allKnown: {
        groups: [],
        colors: [],
        blocks: []
    } as KnownIds,
    triggerPositioningAllowed: true,
    triggerStartY: 6000,
    triggerIndex: 0,
    cleanupGroupId: 9999,
    generatedLevelString: '',
    importedLevelString: '',
    levelPrepared: false,
    callback_objects_fn: (x: any) => x,
};

// Only link all_known for backward compatibility if it's already used by external scripts.
// The library itself now uses state.allKnown.
if (!(global as any).all_known) {
    (global as any).all_known = state.allKnown;
}

export const allKnown = state.allKnown;

let [lastUnavailableGroup, lastUnavailableColor, lastUnavailableBlock] = [0, 0, 0];

export const getNextFreeId = (_current: number, prop: KnownIdKind, push = true) => {
    const arr = allKnown[prop];

    if (arr.length === 0) {
        if (push) arr.push(1);
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
    if (!result) result = arr[arr.length - 1] + 1;
    if (push) allKnown[prop].push(result);
    return result;
};

/**
 * creates and returns an unavailable group id.
 * @returns {any} resulting group id
 * @category Functions
 */
export const unknown_g = () => {
    lastUnavailableGroup++;
    lastUnavailableGroup = getNextFreeId(lastUnavailableGroup, 'groups');
    return new $group(lastUnavailableGroup);
};
/**
 * creates and returns an unavailable color id.
 * @returns {any} resulting color id
 * @category Functions
 */
export const unknown_c = () => {
    lastUnavailableColor++;
    lastUnavailableColor = getNextFreeId(lastUnavailableColor, 'colors');
    return new $color(lastUnavailableColor);
};
/**
 * creates and returns an unavailable block id.
 * @returns {any} resulting block id
 * @category Functions
 */
export const unknown_b = () => {
    lastUnavailableBlock++;
    lastUnavailableBlock = getNextFreeId(lastUnavailableBlock, 'blocks');
    return new $block(lastUnavailableBlock);
};

/**
 * Class allowing you to interfere with contexts, which are wrappers that assign groups to different objects
 */
export class Context {
    name: string;
    group: any;
    objects: Dictionary[];
    children: string[];
    linked_to?: string;

    /**
     * Creates a new context
     * @param {string} name Name of context
     * @param {boolean} [setToDefault=false] Whether to automatically switch to the context
     * @param {any} [group=unknown_g()] The group to give to the context
     */
    constructor(name: string, setToDefault = false, group = unknown_g()) {
        this.name = name;
        this.group = group;
        this.objects = [];
        this.children = [];
        Context.last_contexts[name] = name;
        if (setToDefault) Context.set(name);
        Context.add(this);
    }
    static last_contexts: Record<string, string> = {};
    static last_context_children: Record<string, string> = {};
    /**
     * The name of the current context
     */
    static current = 'global';
    /**
     * A list of all contexts added
     */
    static list: Record<string, Context> = {};
    /**
     * Switches the context
     * @param {string|any} name Name or group of context to switch to
     */
    static set(name: string | { value: number }) {
        if (typeof name === 'object' && (name as any)?.value) {
            Context.current = Context.findByGroup(name).name;
            return;
        }
        Context.current = name as string;
    }
    /**
     * Converts an object into a context
     * @param {Context} context Object to convert into a context
     */
    static add(context: Context) {
        Context.list[context.name] = context;
    }
    /**
     * Adds an object into the current context
     * @param {any} objectToAdd Object to add into current context
     */
    static addObject(objectToAdd: any) {
        if (objectToAdd.type === 'object') {
            objectToAdd = state.callback_objects_fn(objectToAdd) || objectToAdd;
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
    static link(context: string, ctxLink: string | undefined = undefined) {
        const input_context = Context.findByName(context);
        const curr_ctx = !ctxLink ? Context.findByName(Context.current) : Context.findByName(ctxLink);
        if (Context.isLinked(input_context)) {
            input_context.linked_to = curr_ctx.linked_to;
            Context.last_context_children[input_context.linked_to] = context;
        } else {
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
    static isLinked(ctx: Context) {
        return 'linked_to' in ctx;
    }
    /**
     * Finds a context based off of its assigned group
     * @param {any} groupToSearch
     * @returns {Context} Found context
     */
    static findByGroup(groupToSearch: number | any): Context {
        if (typeof groupToSearch === 'number') {
            groupToSearch = group_fn(groupToSearch);
        } else if (!(groupToSearch instanceof $group)) {
            throw new Error(`Expected number or $group instance, got ${groupToSearch} with type ${typeof groupToSearch}`);
        }
        for (const key in Context.list) {
            if (Context.list[key].group.value === groupToSearch.value) {
                return Context.list[key];
            }
        }
        return undefined as any;
    }
    /**
     * Finds a context based off of its name
     * @returns {Context} Found context
     */
    static findByName(name: string): Context {
        return Context.list[name];
    }
}

new Context('global');

/**
 * converts a number to a group.
 * @param {number} x - the number to convert to a group.
 * @returns {any}
 * @category Functions
 */
export const group_fn = (x) => new $group(x);

/**
 * converts a number to a color.
 * @param {number} x - the number to convert to a color.
 * @returns {any}
 * @category Functions
 */
export const color_fn = (x) => new $color(x);

/**
 * converts a number to a block.
 * @param {number} x - the number to convert to a block.
 * @returns {any}
 * @category Functions
 */
export const block_fn = (x) => new $block(x);

export const registerExplicitTypes = (definitions) => {
    definitions.forEach((definition) => {
        const [typeName, ...aliases] = definition.split('/');

        aliases.forEach((alias) => {
            if (!expectedPropTypes[alias]) {
                expectedPropTypes[alias] = typeName;
                return;
            }

            expectedPropTypes[alias] = [expectedPropTypes[alias]].flat().concat(typeName);
        });
    });
};

registerExplicitTypes([
    'group/TARGET/GROUPS/GROUP_PARENTS/GR_BL/GR_BR/GR_TL/GR_TR/TRUE_ID/FALSE_ID/ANIMATION_GID/TARGET_POS/FOLLOW/CENTER/TARGET_DIR_CENTER/SHADER_CENTER_ID',
    'color/TARGET/TARGET_COLOR/COLOR/COLOR_2/SHADER_TINT_CHANNEL',
    'block/BLOCK_A/BLOCK_B',
]);

const resolveObjectProperty = (prop) => {
    if (typeof prop === 'string' && Number.isNaN(Number.parseInt(prop, 10))) {
        return prop;
    }
    return objectPropIds[prop] || prop;
};

/**
 * takes a dictionary with object props and converts it into an object.
 * @param {Dictionary} prop dictionary to convert to object
 * @returns {GJsObject}
 * @category Functions
 */
export const object = (dict: Dictionary): GJsObject => {
    const return_val: GJsObject = {
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

/**
 * takes a dictionary with object props and converts it into a trigger.
 * @param {Dictionary} dict dictionary to convert to trigger
 * @returns {GJsObject}
 * @category Functions
 */
export const trigger = (dict: Dictionary): GJsObject => {
    const iobj = object(dict);
    if (state.triggerPositioningAllowed) {
        const xMovementAllowed = Context.list[Context.current].name !== 'global';
        if (xMovementAllowed) {
            iobj.obj_props.X = (state.triggerIndex * 30);
            iobj.obj_props.Y = state.triggerStartY;
        } else {
            iobj.obj_props.Y = state.triggerStartY - (state.triggerIndex * 30);
        }
    }

    state.triggerIndex++;
    return iobj;
};

/**
 * Creates a "trigger function" in which triggers can be stored inside of a single group
 * @param {Function} cb Function storing triggers to put inside of group
 * @returns {any} Group ID of trigger function
 * @category Functions
 */
export const trigger_function = (cb: (group: any) => void): any => {
    const oldContext = Context.current;
    // Explicitly call unknown_g() to ensure proper coordination with unknown_g calls
    const generatedGroup = unknown_g();
    const newContext = new Context(crypto.randomUUID(), true, generatedGroup);
    cb(newContext.group);
    Context.set(oldContext);
    return newContext.group;
};

/**
 * Waits for X seconds
 * @param {Number} time Amount of seconds to wait
 * @category Functions
 */
export const wait = (time: number) => {
    if (time === 0) return;
    const id = crypto.randomUUID();
    const oldContext = Context.current;
    const newContext = new Context(id);
    add_fn({
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
    } as any);
    Context.set(id);
    Context.link(newContext.name, oldContext);
};

export const objectPropNamesById: Dictionary = {};
for (var i in objectPropIds) {
    objectPropNamesById[objectPropIds[i]] = i;
}

/**
 * See [Object Properties](/G.js/documents/Object_Properties.html).
 */
export const obj_props = objectPropNamesById;

export const dot_separated_keys = [57, 442, 274].map(x => x.toString());
export const a_separated_keys = [43].map(x => x.toString());

/**
 * Converts levelstring to a GD object
 * @param string Input levelstring
 * @returns {Dictionary} converted object (unprocessed; type conversions are not done automatically)
 * @category Functions
 */
export const levelstring_to_obj = (string: string) => {
    const objects: Dictionary[] = [];
    string
        .split(';')
        .slice(0, -1)
        .forEach((x) => {
            const r: Dictionary = {};
            const spl = x.split(',');
            spl.forEach((x, i) => {
                if (!(i % 2)) {
                    const obj_prop = parseInt(x);
                    let value: any = spl[i + 1];
                    if (typeof value === 'string' && dot_separated_keys.includes(obj_prop.toString())) {
                        value = value.split('.').map(x => parseInt(x));
                    }
                    if (typeof value !== 'object' && !a_separated_keys.includes(obj_prop.toString())) {
                        if (!isNaN(parseFloat(value))) value = parseFloat(value);
                        if (!isNaN(parseInt(value)) && typeof value !== 'number') value = parseInt(value);
                    }

                    r[objectPropIds[obj_prop] || obj_prop] = value;
                }
            });
            objects.push(r);
        });
    return objects;
};


/**
 * @category Interfaces
 */
export interface Level {
    objects: any[];
    raw_levelstring: string;
    level_reader?: any,
    get_objects(
        prop: string | number,
        pattern: (val: any) => boolean
    ): any[];
}

/**
 * Helper for reading existing level info
 * @see {@link Level}
 */
export const level: Level = {
    objects: [],
    raw_levelstring: '',
    get_objects: function (prop: string | number, pattern: (val: any) => boolean) {
        let level_arr = levelstring_to_obj(this.raw_levelstring);
        return level_arr.filter(o => {
            let cond_1 = prop in o || objectPropIds[prop] in o, cond_2 = false;
            if (cond_1) cond_2 = pattern(o[prop] || o[objectPropIds[prop]]);
            return cond_1 && cond_2;
        });
    }
};

export const legacyObjectPropMappings = {
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

export const find_free = (str: string) => {
    let startIndex = 0;
    let endIndex;

    while ((endIndex = str.indexOf(';', startIndex)) !== -1) {
        const segment = str.substring(startIndex, endIndex);
        startIndex = endIndex + 1;

        if (!segment) continue;

        level.objects.push(segment);
        level.raw_levelstring += segment + ';';

        const ro = segment.split(',');
        for (let i = 0; i < ro.length; i += 2) {
            const key = ro[i];
            const value = ro[i + 1];
            switch (key) {
                case "57":
                    const detected_groups = value.split('.').map(Number).filter(num => num !== state.cleanupGroupId);
                    for (const group of detected_groups) {
                        if (!allKnown.groups.includes(group)) allKnown.groups.push(group);
                        lastUnavailableGroup = getNextFreeId(group, 'groups', false);
                    }
                    break;
                case "21":
                case "22":
                    const detected_color = parseInt(value);
                    if (!allKnown.colors.includes(detected_color)) allKnown.colors.push(detected_color);
                    lastUnavailableColor = getNextFreeId(detected_color, 'colors', false);
                    break;
                case "80":
                case "95":
                    const detected_block = parseInt(value);
                    if (!allKnown.blocks.includes(detected_block)) allKnown.blocks.push(detected_block);
                    lastUnavailableBlock = getNextFreeId(detected_block, 'blocks', false);
                    break;
            }
        }
    }
};

/**
 * Converts an object to levelstring
 * @param {GJsObject} object Object to convert to levelstring
 * @returns {String} Output levelstring
 */
export const obj_to_levelstring = (l: Dictionary) => {
    let res = '';
    for (var d_ in l) {
        let val = l[d_];
        let key: any = objectPropNamesById[d_];
        if (!isNaN(parseInt(d_))) key = d_;
        if (typeof val === 'boolean') val = +val;

        const hasTypedValue = val !== null && val !== undefined && Object.prototype.hasOwnProperty.call(Object(val), 'value');
        if (expectedPropTypes[d_] && !hasTypedValue) {
            if (typeof val === 'object' && dot_separated_keys.includes(key)) {
                val = val.map((x) => x.value).filter(x => x && x !== '').join('.');
            } else {
                throw `Expected type "${expectedPropTypes[objectPropIds[parseInt(key)]]
                    }", got "${typeof val}"`;
            }
        } else if (expectedPropTypes[d_] && hasTypedValue) {
            const cond = typeof expectedPropTypes[d_] === "string" ? (val.type === expectedPropTypes[d_]) : (expectedPropTypes[d_].includes(val.type));
            if (cond) {
                val = val.value;
            } else {
                throw `Expected type "${expectedPropTypes[d_]}", got "${val.type}"`;
            }
        }
        if ((legacyObjectPropMappings as any).hasOwnProperty(key)) {
            key = (legacyObjectPropMappings as any)[key];
        }
        res += `${key},${val},`;
    }
    return res.slice(0, -1) + ';';
};

export const obj_to_levelstring_notype = (l: Dictionary) => {
    let res = '';

    for (var d_ in l) {
        let val = l[d_];
        let key = objectPropNamesById[d_] ?? d_;
        if (!isNaN(parseInt(d_))) key = d_;

        if (typeof val === 'boolean') val = +val;

        if (expectedPropTypes[d_]) {
            if (typeof val !== 'object' || val === null) {
                // raw values are allowed for untyped imported level strings.
            }

            else if (val.value !== undefined) {
                const cond = typeof expectedPropTypes[d_] === "string"
                    ? val.type === expectedPropTypes[d_]
                    : expectedPropTypes[d_].includes(val.type);

                if (cond) {
                    val = val.value;
                } else {
                    throw `Expected type "${expectedPropTypes[d_]}", got "${val.type}"`;
                }
            }

            else if (Array.isArray(val) && dot_separated_keys.includes(key)) {
                val = val
                    .map(x => (x && x.value !== undefined ? x.value : x))
                    .filter(x => x !== undefined && x !== '')
                    .join('.');
            }

            else {
                throw `Invalid value for key "${key}"`;
            }
        }

        if ((legacyObjectPropMappings as any).hasOwnProperty(key)) {
            key = (legacyObjectPropMappings as any)[key];
        }

        res += `${key},${val},`;
    }

    return res.slice(0, -1) + ';';
};

export const toArray = (value: any) => Array.isArray(value) ? value : [value];

export const addGroupsToObject = (objectProps: Dictionary, groups: any, forceArray = true) => {
    const groupsToAdd = toArray(groups);

    if (!objectProps.GROUPS) {
        objectProps.GROUPS = forceArray || groupsToAdd.length > 1 ? groupsToAdd : groupsToAdd[0];
        return;
    }

    objectProps.GROUPS = toArray(objectProps.GROUPS);
    objectProps.GROUPS.push(...groupsToAdd);
};

export const removeUndefinedProps = (objectProps: Dictionary) => {
    Object.keys(objectProps).forEach((prop) => {
        if (objectProps[prop] === undefined) delete objectProps[prop];
    });
};

export const isRootContextName = (name: string) => name === 'global' || name === 'GLOBAL_FULL';

export const add_fn = (...objects: any[]) => {
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
        if (newo.with) delete newo.with;
        Context.addObject(newo);
    });
};

export const GROUP_LIMIT = 9999;
export const indexOfFrom = (array: any[], value: any, startIndex: number) => {
    const newArr = array.slice(startIndex);
    return newArr.indexOf(value) !== -1 ? newArr.indexOf(value) + (array.length - newArr.length) : -1;
};

export const optimize = () => {
    for (const child in Context.last_context_children) {
        const parent = Context.list[Context.last_context_children[child]];
        const childCtx = Context.list[child];

        if (childCtx.objects.length === 0) {
            delete Context.list[child];
            const emptyCallIndex = parent.objects.map(x => {
                if (!x?.TARGET) return false;
                return x.TARGET.value === childCtx.group.value;
            });
            parent.objects = parent.objects.filter((_, i) => i !== indexOfFrom(emptyCallIndex, true, i));
        }
    }
};

/**
 * Parses and manipulates levelstrings, returning helper methods for editing/adding.
 * @param {string} string Input levelstring
 * @category Functions
 */
export const levelstring = (string: string) => {
    let splitString = string.split(';');
    if (splitString[splitString.length - 1] === '') splitString = splitString.slice(0, -1);

    const processed: any[] = [];
    const newpairs: any[] = [];
    splitString.forEach((obj, splitIdx) => {
        const objdict = levelstring_to_obj(obj + ';')[0];

        addGroupsToObject(objdict, group_fn(state.cleanupGroupId), false);
        obj = obj_to_levelstring_notype(objdict);
        const pairs: any[] = [];
        const items = obj.split(",");
        for (let i = 0; i < items.length; i += 2) {
            const first = parseInt(items[i]);
            const second = items[i + 1];
            pairs.push([first, second]);
        }

        processed.push({
            obj_props: objdict,
            edit: (dict: Dictionary) => {
                if (dict.GROUPS) {
                    if (!Array.isArray(dict.GROUPS)) dict.GROUPS = [dict.GROUPS];
                    const untyped = dict.GROUPS.map(x => x.value ?? x);
                    if (!untyped.includes(state.cleanupGroupId)) {
                        dict.GROUPS.push(group_fn(state.cleanupGroupId));
                    }
                }

                let commastring = obj_to_levelstring(dict).slice(0, -1);
                const pairs2: any[] = [];
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
                return processed[splitIdx]
            },
            add: () => {
                state.importedLevelString += pairs.flat().join(',') + ';';
            }
        });
        newpairs.push(pairs);
    });

    return {
        objects: processed,
        add: () => {
            state.importedLevelString += newpairs.map(x => x.join(',')).join(';');
        }
    };
};

export const prep_lvl = (optimize_op = true, replace = true) => {
    if (state.levelPrepared) return;
    if (optimize_op) optimize();
    const name = 'GLOBAL_FULL';
    new Context(name, true, group_fn(0));
    Context.last_contexts[name] = name;

    for (const contextName in Context.list) {
        const context = Context.findByName(contextName);

        context.objects.forEach(removeUndefinedProps);

        if (!isRootContextName(contextName)) {
            const objects = context.objects;
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (replace) {
                    addGroupsToObject(object, [context.group, group_fn(state.cleanupGroupId)]);
                } else {
                    addGroupsToObject(object, context.group);
                }
                if (!(object.hasOwnProperty("SPAWN_TRIGGERED") || object.hasOwnProperty(obj_props.SPAWN_TRIGGERED))) {
                    object.SPAWN_TRIGGERED = 1;
                }
                if (!(object.hasOwnProperty("MULTI_TRIGGER") || object.hasOwnProperty(obj_props.MULTI_TRIGGER))) {
                    object.MULTI_TRIGGER = 1;
                }
            }
        } else {
            const objects = context.objects;
            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                if (replace) {
                    addGroupsToObject(object, group_fn(state.cleanupGroupId), false);
                }
            }
        }
        for (let x in context.objects) {
            const r = obj_to_levelstring(context.objects[x]);
            state.generatedLevelString += r;
        }
    }
    state.generatedLevelString += state.importedLevelString;
    state.levelPrepared = true;
};

export const limit = GROUP_LIMIT;

export const shouldEnforceGroupLimit = (options: ExportOptions = {}) => {
    return options.group_count_warning ?? true;
};

export const assertGroupLimit = (options: ExportOptions = {}) => {
    if (lastUnavailableGroup <= limit || !shouldEnforceGroupLimit(options)) return;
    throw new Error(`Group count surpasses the limit! (${lastUnavailableGroup}/${limit})`);
};

export const printExportStats = (options: ExportOptions = {}, levelName: string | undefined = undefined) => {
    if (!options?.info) return;

    if (levelName) console.log(`Writing to level: ${levelName}`);
    console.log('Finished, result stats:');
    console.log('Object count:', state.generatedLevelString.split(';').length - 1);
    console.log('Group count:', lastUnavailableGroup);
    console.log('Color count:', lastUnavailableColor);
};

export const prepareResultingLevelString = (options: ExportOptions = {}, levelName: string | undefined = undefined) => {
    prep_lvl(options?.optimize, options?.replacePastObjects);
    assertGroupLimit(options);
    printExportStats(options, levelName);
    return state.generatedLevelString;
};

export function exportConfig(conf: ExportConfig) {
    return new Promise<any>(async (resolve, reject) => {
        try {
            if (!conf || typeof conf !== 'object') {
                throw new Error('exportConfig requires a configuration object.');
            }

        const options = conf.options ?? {};
        conf.options = options;
        state.triggerPositioningAllowed = options.triggerPositioningAllowed ?? true;
        state.triggerStartY = options.trigger_pos_start ?? 6000;

        if (options.replacePastObjects === undefined) {
            options.replacePastObjects = true;
        }

        if (options.removeGroup !== undefined) {
            state.cleanupGroupId = typeof options.removeGroup === 'number' ? options.removeGroup : (options.removeGroup as any)?.value;
        }

        const remove_past_objects = (lvlstring: string) => {
            return lvlstring.split(';').filter(x => {
                let keep = true;
                const spl = x.split(',');
                spl.forEach((z, i) => {
                    if (!(i % 2)) {
                        if (z === "57") {
                            let groups: string | string[] = spl[i + 1];
                            if (groups.includes('.')) {
                                (groups as any) = groups.split('.');
                                if ((groups as any).includes(state.cleanupGroupId.toString())) {
                                    keep = false;
                                }
                            } else {
                                if (groups === state.cleanupGroupId.toString()) {
                                    keep = false;
                                }
                            }
                        }
                    }
                });
                return keep;
            }).join(';');
        };

        const group_arr = (arr: any[], x: number) => arr.reduce((acc, _, i) => (i % x ? acc[acc.length - 1].push(arr[i]) : acc.push([arr[i]]), acc), []);

        switch (conf.type) {
            case 'levelstring':
                resolve(prepareResultingLevelString(options));
                return;

            case 'savefile': {
                const sf_level = await new LevelReader(options?.level_name, options?.path, options?.reencrypt);
                level.level_reader = sf_level;
                if (!sf_level.data.levelstring) throw new Error(`Level "${sf_level.data.name}" has not been initialized, add any object to initialize the level then rerun this script`);

                let last = options.replacePastObjects ? remove_past_objects(sf_level.data.levelstring) : sf_level.data.levelstring;
                find_free(last);

                process.on('beforeExit', error => {
                    if (!error) {
                        last += prepareResultingLevelString(options, sf_level.data.name);
                        sf_level.set(last);
                        sf_level.save();
                        process.exit(0);
                    }
                });
                resolve(true);
                return;
            }

            case 'gmd': {
                const sf_level_gmd = await new SingleLevelReader(options?.path);
                level.level_reader = sf_level_gmd;
                if (!sf_level_gmd.data.levelstring) throw new Error(`Level "${sf_level_gmd.data.name}" has not been initialized, add any object to initialize the level then rerun this script`);

                let last_gmd = options.replacePastObjects ? remove_past_objects(sf_level_gmd.data.levelstring) : sf_level_gmd.data.levelstring;
                find_free(last_gmd);

                process.on('beforeExit', error => {
                    if (!error) {
                        last_gmd += prepareResultingLevelString(options, sf_level_gmd.data.name);
                        sf_level_gmd.set(last_gmd);
                        sf_level_gmd.save(options?.gmdOutput);
                        process.exit(0);
                    }
                });
                resolve(true);
                return;
            }

            case 'live_editor': {
                const socket = new WebSocket('ws://127.0.0.1:1313');
                socket.addEventListener('message', (event) => {
                    (event as any) = JSON.parse((event as any).data);
                    if ((event as any).response) {
                        find_free((event as any).response.split(';').slice(1).join(';'));
                        level.raw_levelstring = (event as any).response;
                        resolve(true);
                        return;
                    }
                    if ((event as any).status !== 'successful') throw new Error(`Live editor failed, ${(event as any).error}: ${(event as any).message}`);
                });

                socket.addEventListener('open', () => {
                    if (options.replacePastObjects) {
                        socket.send(JSON.stringify({
                            action: 'REMOVE_OBJECTS',
                            group: state.cleanupGroupId,
                        }));
                    }

                    socket.send(JSON.stringify({
                        action: 'GET_LEVEL_STRING',
                        close: true
                    }));

                    process.on('beforeExit', error => {
                        if (!error) {
                            const socket2 = new WebSocket('ws://127.0.0.1:1313');
                            socket2.addEventListener('message', (event) => {
                                (event as any) = JSON.parse((event as any).data);
                                if ((event as any).response) {
                                    find_free((event as any).response.split(';').slice(1).join(';'));
                                }
                                if ((event as any).status !== 'successful') throw new Error(`Live editor failed, ${(event as any).error}: ${(event as any).message}`);
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
                                        if (i === lvlString.length - 1) process.exit(0);
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
        } catch (error) {
            reject(error);
        }
    });
}

export const callback_objects = (cb: Function) => {
    state.callback_objects_fn = cb as any;
};

export const extend_trigger_func = (t: any, cb: (group: any) => void) => {
    const context = Context.findByGroup(t);
    const oldContext = Context.current;
    Context.set(Context.last_contexts[context.name]);
    cb(context.group);
    Context.set(oldContext);
};

export const trigger_fn_context = () => Context.findByName(Context.current).group;

export const $ = {
    add: add_fn,
    exportConfig,
    print: (...args: any[]) => console.log(...args),
    callback_objects,
    extend_trigger_func,
    trigger_fn_context
};

/**
 * Executes a function while preserving the current context (doesn't change contexts).
 * @param {Function} fn Function to execute
 * @category Functions
 */
export const ignore_context_change = (fn: Function) => {
    const old_context = Context.current;
    fn();
    Context.set(old_context);
};

/**
 * Helper for creating a range
 * @param start Start for range
 * @param end End for range
 * @param step How many steps
 * @returns {Array} Output array
 * @category Functions
 */
export function range(start: number, end: number, step = 1) {
    let sw = false;
    if (start > end) {
        sw = true;
        [start, end] = [end, start];
        step = Math.abs(step);
    }

    let result = Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
    if (sw) result = result.reverse();
    return result;
};

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
export const hsv = (hue: number, sat: number, bright: number, sat_checked = false, bright_checked = false) => {
    return [hue, sat, bright, +sat_checked, +bright_checked].join("a");
};

/**
 * Converts a speed multiplier into an in-game speed value
 * @param {number} x Input speed multiplier
 * @returns {number}
 * @category Functions
 */
export const speed = (x: number) => (5.170649 + 8.019236 * x - 3.726698 * Math.pow(x, 2) + 1.000783 * Math.pow(x, 3) - 0.08783546 * Math.pow(x, 4)) * 30;

/**
 * Reverses level direction
 * @category Functions
 */
export const reverse = () => {
    $.add(trigger({
        OBJ_ID: 1917
    }));
};

/**
 * Creates an RGB triplet
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 * @returns {number[]}
 * @category Functions
 */
export const rgb = (r: number, g: number, b: number) => [r, g, b];

/**
 * Creates an RGBA quadruplet
 * @param {number} r Red value
 * @param {number} g Green value
 * @param {number} b Blue value
 * @param {number} a Alpha value
 * @returns {number[]}
 * @category Functions
 */
export const rgba = (r: number, g: number, b: number, a: number) => [r, g, b, a];

(String.prototype as any).to_obj = function () {
    let or = object({
        OBJ_ID: 914,
        TEXT: Buffer.from(this.toString()).toString('base64')
    }) as GJsObject;
    return or;
};
