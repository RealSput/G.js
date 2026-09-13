"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._3DLINE = exports.LINE = exports.GROUND = exports.BG = exports.DOWN_EDGE = exports.UP_EDGE = exports.RIGHT_EDGE = exports.LEFT_EDGE = exports.MODE_LAST = exports.MODE_LOOP = exports.MODE_STOP = exports.SMALLER_THAN = exports.LARGER_THAN = exports.EQUAL_TO = exports.NONE = exports.BACK_IN = exports.EXPONENTIAL_IN_OUT = exports.SINE_OUT = exports.ELASTIC_IN = exports.SINE_IN = exports.BOUNCE_IN_OUT = exports.SINE_IN_OUT = exports.EXPONENTIAL_OUT = exports.EXPONENTIAL_IN = exports.BOUNCE_OUT = exports.ELASTIC_IN_OUT = exports.EASE_IN_OUT = exports.EASE_IN = exports.EASE_OUT = exports.BACK_OUT = exports.BOUNCE_IN = exports.BACK_IN_OUT = exports.ELASTIC_OUT = exports.CEI = exports.FLR = exports.RND = exports.NEG = exports.ABS = exports.NOT_EQ = exports.LESS_OR_EQ = exports.LESS = exports.GREATER_OR_EQ = exports.GREATER = exports.DIV = exports.MUL = exports.SUB = exports.ADD = exports.EQ = exports.TIMER = exports.ITEM = void 0;
exports.toggle_off_trigger = exports.toggle_on_trigger = exports.color_trigger = exports.timewarp = exports.move_trigger = exports.teleport = exports.song = exports.camera_edge = exports.camera_rotate = exports.camera_mode = exports.camera_zoom = exports.camera_static = exports.camera_offset = exports.timer = exports.float_counter = exports.counter = exports.compare = exports.item_comp = exports.item_edit = exports.render_frame_loop = exports.render_frames = exports.frames = exports.frame_loop = exports.for_loop = exports.greater_than = exports.less_than = exports.equal_to = exports.call_with_delay = exports.sequence = exports.remappable = exports.spawn_trigger = exports.render_frame = exports.frame = exports.gamescene = exports.event = exports.x_position = exports.count = exports.death = exports.collision_exit = exports.collision = exports.touch_end = exports.touch = exports.on = exports.MIDDLEGROUND_2 = exports.MIDDLEGROUND = exports.LIGHTER = exports.WHITE = exports.BLACK = exports.GROUND2 = exports.OBJECT = void 0;
exports.exportConfig = exports.extract = exports.unknown_b = exports.unknown_c = exports.unknown_g = exports.reverse = exports.rgba = exports.rgb = exports.while_loop = exports.blocking_trigger_fn = exports.obj_ids = exports.animations = exports.speed = exports.hsv = exports.ignore_context_change = exports.level = exports.Context = exports.range = exports.block = exports.color = exports.group = exports.trigger_function = exports.object = exports.trigger = exports.SingleLevelReader = exports.LevelReader = exports.log = exports.events = exports.particle_props = exports.keyframe_system = exports.split_screen = exports.bulge = exports.glitch = exports.chromatic = exports.pixelate = exports.grayscale = exports.hue_shift = exports.sepia = exports.shader_layer = exports.shader_layers = exports.spawn_particle = exports.particle_system = exports.player_control = exports.end = exports.options = exports.gravity = exports.advanced_random = exports.random = exports.gradient = exports.hide_player = void 0;
exports.wait = exports.levelstring = exports.$block = exports.$color = exports.$group = exports.obj_props = exports.$ = void 0;
const crypto_1 = __importDefault(require("crypto"));
const core_1 = require("./core");
Object.defineProperty(exports, "$", { enumerable: true, get: function () { return core_1.$; } });
Object.defineProperty(exports, "trigger", { enumerable: true, get: function () { return core_1.trigger; } });
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return core_1.Context; } });
Object.defineProperty(exports, "trigger_function", { enumerable: true, get: function () { return core_1.trigger_function; } });
Object.defineProperty(exports, "group", { enumerable: true, get: function () { return core_1.group_fn; } });
Object.defineProperty(exports, "color", { enumerable: true, get: function () { return core_1.color_fn; } });
Object.defineProperty(exports, "block", { enumerable: true, get: function () { return core_1.block_fn; } });
Object.defineProperty(exports, "object", { enumerable: true, get: function () { return core_1.object; } });
Object.defineProperty(exports, "hsv", { enumerable: true, get: function () { return core_1.hsv; } });
Object.defineProperty(exports, "unknown_g", { enumerable: true, get: function () { return core_1.unknown_g; } });
Object.defineProperty(exports, "unknown_c", { enumerable: true, get: function () { return core_1.unknown_c; } });
Object.defineProperty(exports, "unknown_b", { enumerable: true, get: function () { return core_1.unknown_b; } });
Object.defineProperty(exports, "extract", { enumerable: true, get: function () { return core_1.extract; } });
Object.defineProperty(exports, "level", { enumerable: true, get: function () { return core_1.level; } });
Object.defineProperty(exports, "ignore_context_change", { enumerable: true, get: function () { return core_1.ignore_context_change; } });
Object.defineProperty(exports, "speed", { enumerable: true, get: function () { return core_1.speed; } });
Object.defineProperty(exports, "range", { enumerable: true, get: function () { return core_1.range; } });
Object.defineProperty(exports, "obj_props", { enumerable: true, get: function () { return core_1.obj_props; } });
Object.defineProperty(exports, "$group", { enumerable: true, get: function () { return core_1.$group; } });
Object.defineProperty(exports, "$color", { enumerable: true, get: function () { return core_1.$color; } });
Object.defineProperty(exports, "$block", { enumerable: true, get: function () { return core_1.$block; } });
Object.defineProperty(exports, "levelstring", { enumerable: true, get: function () { return core_1.levelstring; } });
Object.defineProperty(exports, "wait", { enumerable: true, get: function () { return core_1.wait; } });
const constants_1 = require("./constants");
Object.defineProperty(exports, "ITEM", { enumerable: true, get: function () { return constants_1.ITEM; } });
Object.defineProperty(exports, "TIMER", { enumerable: true, get: function () { return constants_1.TIMER; } });
Object.defineProperty(exports, "EQ", { enumerable: true, get: function () { return constants_1.EQ; } });
Object.defineProperty(exports, "ADD", { enumerable: true, get: function () { return constants_1.ADD; } });
Object.defineProperty(exports, "SUB", { enumerable: true, get: function () { return constants_1.SUB; } });
Object.defineProperty(exports, "MUL", { enumerable: true, get: function () { return constants_1.MUL; } });
Object.defineProperty(exports, "DIV", { enumerable: true, get: function () { return constants_1.DIV; } });
Object.defineProperty(exports, "GREATER", { enumerable: true, get: function () { return constants_1.GREATER; } });
Object.defineProperty(exports, "GREATER_OR_EQ", { enumerable: true, get: function () { return constants_1.GREATER_OR_EQ; } });
Object.defineProperty(exports, "LESS", { enumerable: true, get: function () { return constants_1.LESS; } });
Object.defineProperty(exports, "LESS_OR_EQ", { enumerable: true, get: function () { return constants_1.LESS_OR_EQ; } });
Object.defineProperty(exports, "NOT_EQ", { enumerable: true, get: function () { return constants_1.NOT_EQ; } });
Object.defineProperty(exports, "ABS", { enumerable: true, get: function () { return constants_1.ABS; } });
Object.defineProperty(exports, "NEG", { enumerable: true, get: function () { return constants_1.NEG; } });
Object.defineProperty(exports, "RND", { enumerable: true, get: function () { return constants_1.RND; } });
Object.defineProperty(exports, "FLR", { enumerable: true, get: function () { return constants_1.FLR; } });
Object.defineProperty(exports, "CEI", { enumerable: true, get: function () { return constants_1.CEI; } });
Object.defineProperty(exports, "ELASTIC_OUT", { enumerable: true, get: function () { return constants_1.ELASTIC_OUT; } });
Object.defineProperty(exports, "BACK_IN_OUT", { enumerable: true, get: function () { return constants_1.BACK_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_IN", { enumerable: true, get: function () { return constants_1.BOUNCE_IN; } });
Object.defineProperty(exports, "BACK_OUT", { enumerable: true, get: function () { return constants_1.BACK_OUT; } });
Object.defineProperty(exports, "EASE_OUT", { enumerable: true, get: function () { return constants_1.EASE_OUT; } });
Object.defineProperty(exports, "EASE_IN", { enumerable: true, get: function () { return constants_1.EASE_IN; } });
Object.defineProperty(exports, "EASE_IN_OUT", { enumerable: true, get: function () { return constants_1.EASE_IN_OUT; } });
Object.defineProperty(exports, "ELASTIC_IN_OUT", { enumerable: true, get: function () { return constants_1.ELASTIC_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_OUT", { enumerable: true, get: function () { return constants_1.BOUNCE_OUT; } });
Object.defineProperty(exports, "EXPONENTIAL_IN", { enumerable: true, get: function () { return constants_1.EXPONENTIAL_IN; } });
Object.defineProperty(exports, "EXPONENTIAL_OUT", { enumerable: true, get: function () { return constants_1.EXPONENTIAL_OUT; } });
Object.defineProperty(exports, "SINE_IN_OUT", { enumerable: true, get: function () { return constants_1.SINE_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_IN_OUT", { enumerable: true, get: function () { return constants_1.BOUNCE_IN_OUT; } });
Object.defineProperty(exports, "SINE_IN", { enumerable: true, get: function () { return constants_1.SINE_IN; } });
Object.defineProperty(exports, "ELASTIC_IN", { enumerable: true, get: function () { return constants_1.ELASTIC_IN; } });
Object.defineProperty(exports, "SINE_OUT", { enumerable: true, get: function () { return constants_1.SINE_OUT; } });
Object.defineProperty(exports, "EXPONENTIAL_IN_OUT", { enumerable: true, get: function () { return constants_1.EXPONENTIAL_IN_OUT; } });
Object.defineProperty(exports, "BACK_IN", { enumerable: true, get: function () { return constants_1.BACK_IN; } });
Object.defineProperty(exports, "NONE", { enumerable: true, get: function () { return constants_1.NONE; } });
Object.defineProperty(exports, "EQUAL_TO", { enumerable: true, get: function () { return constants_1.EQUAL_TO; } });
Object.defineProperty(exports, "LARGER_THAN", { enumerable: true, get: function () { return constants_1.LARGER_THAN; } });
Object.defineProperty(exports, "SMALLER_THAN", { enumerable: true, get: function () { return constants_1.SMALLER_THAN; } });
Object.defineProperty(exports, "MODE_STOP", { enumerable: true, get: function () { return constants_1.MODE_STOP; } });
Object.defineProperty(exports, "MODE_LOOP", { enumerable: true, get: function () { return constants_1.MODE_LOOP; } });
Object.defineProperty(exports, "MODE_LAST", { enumerable: true, get: function () { return constants_1.MODE_LAST; } });
Object.defineProperty(exports, "LEFT_EDGE", { enumerable: true, get: function () { return constants_1.LEFT_EDGE; } });
Object.defineProperty(exports, "RIGHT_EDGE", { enumerable: true, get: function () { return constants_1.RIGHT_EDGE; } });
Object.defineProperty(exports, "UP_EDGE", { enumerable: true, get: function () { return constants_1.UP_EDGE; } });
Object.defineProperty(exports, "DOWN_EDGE", { enumerable: true, get: function () { return constants_1.DOWN_EDGE; } });
Object.defineProperty(exports, "obj_ids", { enumerable: true, get: function () { return constants_1.obj_ids; } });
Object.defineProperty(exports, "BG", { enumerable: true, get: function () { return constants_1.BG; } });
Object.defineProperty(exports, "GROUND", { enumerable: true, get: function () { return constants_1.GROUND; } });
Object.defineProperty(exports, "LINE", { enumerable: true, get: function () { return constants_1.LINE; } });
Object.defineProperty(exports, "_3DLINE", { enumerable: true, get: function () { return constants_1._3DLINE; } });
Object.defineProperty(exports, "OBJECT", { enumerable: true, get: function () { return constants_1.OBJECT; } });
Object.defineProperty(exports, "GROUND2", { enumerable: true, get: function () { return constants_1.GROUND2; } });
Object.defineProperty(exports, "BLACK", { enumerable: true, get: function () { return constants_1.BLACK; } });
Object.defineProperty(exports, "WHITE", { enumerable: true, get: function () { return constants_1.WHITE; } });
Object.defineProperty(exports, "LIGHTER", { enumerable: true, get: function () { return constants_1.LIGHTER; } });
Object.defineProperty(exports, "MIDDLEGROUND", { enumerable: true, get: function () { return constants_1.MIDDLEGROUND; } });
Object.defineProperty(exports, "MIDDLEGROUND_2", { enumerable: true, get: function () { return constants_1.MIDDLEGROUND_2; } });
const events_1 = require("./lib/events");
Object.defineProperty(exports, "on", { enumerable: true, get: function () { return events_1.on; } });
Object.defineProperty(exports, "touch", { enumerable: true, get: function () { return events_1.touch; } });
Object.defineProperty(exports, "touch_end", { enumerable: true, get: function () { return events_1.touch_end; } });
Object.defineProperty(exports, "collision", { enumerable: true, get: function () { return events_1.collision; } });
Object.defineProperty(exports, "collision_exit", { enumerable: true, get: function () { return events_1.collision_exit; } });
Object.defineProperty(exports, "death", { enumerable: true, get: function () { return events_1.death; } });
Object.defineProperty(exports, "count", { enumerable: true, get: function () { return events_1.count; } });
Object.defineProperty(exports, "x_position", { enumerable: true, get: function () { return events_1.x_position; } });
Object.defineProperty(exports, "event", { enumerable: true, get: function () { return events_1.event; } });
Object.defineProperty(exports, "gamescene", { enumerable: true, get: function () { return events_1.gamescene; } });
Object.defineProperty(exports, "frame", { enumerable: true, get: function () { return events_1.frame; } });
Object.defineProperty(exports, "render_frame", { enumerable: true, get: function () { return events_1.render_frame; } });
const control_flow_1 = require("./lib/control-flow");
Object.defineProperty(exports, "spawn_trigger", { enumerable: true, get: function () { return control_flow_1.spawn_trigger; } });
Object.defineProperty(exports, "remappable", { enumerable: true, get: function () { return control_flow_1.remappable; } });
Object.defineProperty(exports, "sequence", { enumerable: true, get: function () { return control_flow_1.sequence; } });
Object.defineProperty(exports, "call_with_delay", { enumerable: true, get: function () { return control_flow_1.call_with_delay; } });
Object.defineProperty(exports, "equal_to", { enumerable: true, get: function () { return control_flow_1.equal_to; } });
Object.defineProperty(exports, "less_than", { enumerable: true, get: function () { return control_flow_1.less_than; } });
Object.defineProperty(exports, "greater_than", { enumerable: true, get: function () { return control_flow_1.greater_than; } });
Object.defineProperty(exports, "for_loop", { enumerable: true, get: function () { return control_flow_1.for_loop; } });
Object.defineProperty(exports, "frame_loop", { enumerable: true, get: function () { return control_flow_1.frame_loop; } });
Object.defineProperty(exports, "frames", { enumerable: true, get: function () { return control_flow_1.frames; } });
Object.defineProperty(exports, "render_frames", { enumerable: true, get: function () { return control_flow_1.render_frames; } });
Object.defineProperty(exports, "render_frame_loop", { enumerable: true, get: function () { return control_flow_1.render_frame_loop; } });
const items_1 = require("./lib/items");
Object.defineProperty(exports, "item_edit", { enumerable: true, get: function () { return items_1.item_edit; } });
Object.defineProperty(exports, "item_comp", { enumerable: true, get: function () { return items_1.item_comp; } });
Object.defineProperty(exports, "compare", { enumerable: true, get: function () { return items_1.compare; } });
const counter_1 = require("./lib/counter");
Object.defineProperty(exports, "counter", { enumerable: true, get: function () { return counter_1.counter; } });
Object.defineProperty(exports, "float_counter", { enumerable: true, get: function () { return counter_1.float_counter; } });
Object.defineProperty(exports, "timer", { enumerable: true, get: function () { return counter_1.timer; } });
const general_purpose_1 = require("./lib/general-purpose");
Object.defineProperty(exports, "camera_offset", { enumerable: true, get: function () { return general_purpose_1.camera_offset; } });
Object.defineProperty(exports, "camera_static", { enumerable: true, get: function () { return general_purpose_1.camera_static; } });
Object.defineProperty(exports, "camera_zoom", { enumerable: true, get: function () { return general_purpose_1.camera_zoom; } });
Object.defineProperty(exports, "camera_mode", { enumerable: true, get: function () { return general_purpose_1.camera_mode; } });
Object.defineProperty(exports, "camera_rotate", { enumerable: true, get: function () { return general_purpose_1.camera_rotate; } });
Object.defineProperty(exports, "camera_edge", { enumerable: true, get: function () { return general_purpose_1.camera_edge; } });
Object.defineProperty(exports, "song", { enumerable: true, get: function () { return general_purpose_1.song; } });
Object.defineProperty(exports, "teleport", { enumerable: true, get: function () { return general_purpose_1.teleport; } });
Object.defineProperty(exports, "move_trigger", { enumerable: true, get: function () { return general_purpose_1.move_trigger; } });
Object.defineProperty(exports, "timewarp", { enumerable: true, get: function () { return general_purpose_1.timewarp; } });
Object.defineProperty(exports, "color_trigger", { enumerable: true, get: function () { return general_purpose_1.color_trigger; } });
Object.defineProperty(exports, "toggle_on_trigger", { enumerable: true, get: function () { return general_purpose_1.toggle_on_trigger; } });
Object.defineProperty(exports, "toggle_off_trigger", { enumerable: true, get: function () { return general_purpose_1.toggle_off_trigger; } });
Object.defineProperty(exports, "hide_player", { enumerable: true, get: function () { return general_purpose_1.hide_player; } });
Object.defineProperty(exports, "gradient", { enumerable: true, get: function () { return general_purpose_1.gradient; } });
Object.defineProperty(exports, "random", { enumerable: true, get: function () { return general_purpose_1.random; } });
Object.defineProperty(exports, "advanced_random", { enumerable: true, get: function () { return general_purpose_1.advanced_random; } });
Object.defineProperty(exports, "gravity", { enumerable: true, get: function () { return general_purpose_1.gravity; } });
Object.defineProperty(exports, "options", { enumerable: true, get: function () { return general_purpose_1.options; } });
Object.defineProperty(exports, "end", { enumerable: true, get: function () { return general_purpose_1.end; } });
Object.defineProperty(exports, "player_control", { enumerable: true, get: function () { return general_purpose_1.player_control; } });
Object.defineProperty(exports, "particle_system", { enumerable: true, get: function () { return general_purpose_1.particle_system; } });
Object.defineProperty(exports, "spawn_particle", { enumerable: true, get: function () { return general_purpose_1.spawn_particle; } });
const shaders_1 = require("./lib/shaders");
Object.defineProperty(exports, "shader_layers", { enumerable: true, get: function () { return shaders_1.shader_layers; } });
Object.defineProperty(exports, "shader_layer", { enumerable: true, get: function () { return shaders_1.shader_layer; } });
Object.defineProperty(exports, "sepia", { enumerable: true, get: function () { return shaders_1.sepia; } });
Object.defineProperty(exports, "hue_shift", { enumerable: true, get: function () { return shaders_1.hue_shift; } });
Object.defineProperty(exports, "grayscale", { enumerable: true, get: function () { return shaders_1.grayscale; } });
Object.defineProperty(exports, "pixelate", { enumerable: true, get: function () { return shaders_1.pixelate; } });
Object.defineProperty(exports, "chromatic", { enumerable: true, get: function () { return shaders_1.chromatic; } });
Object.defineProperty(exports, "glitch", { enumerable: true, get: function () { return shaders_1.glitch; } });
Object.defineProperty(exports, "bulge", { enumerable: true, get: function () { return shaders_1.bulge; } });
Object.defineProperty(exports, "split_screen", { enumerable: true, get: function () { return shaders_1.split_screen; } });
const keyframes_1 = __importDefault(require("./lib/keyframes"));
exports.keyframe_system = keyframes_1.default;
const particles_1 = __importDefault(require("./properties/particles"));
exports.particle_props = particles_1.default;
const game_events_1 = __importDefault(require("./properties/game_events"));
exports.events = game_events_1.default;
const log_1 = require("./lib/log");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return log_1.log; } });
const reader_1 = require("./reader");
Object.defineProperty(exports, "LevelReader", { enumerable: true, get: function () { return reader_1.LevelReader; } });
Object.defineProperty(exports, "SingleLevelReader", { enumerable: true, get: function () { return reader_1.SingleLevelReader; } });
const core_2 = require("./core");
Object.defineProperty(exports, "exportConfig", { enumerable: true, get: function () { return core_2.exportConfig; } });
// Ensure $.exportConfig is initialized
core_1.$.exportConfig = core_2.exportConfig;
const animations = {
    big_beast: {
        bite: 0,
        attack01: 1,
        attack01_end: 2,
        idle01: 3
    },
    bat: {
        idle01: 0,
        idle02: 1,
        idle03: 2,
        attack01: 3,
        attack02: 4,
        attack02_end: 5,
        sleep: 6,
        sleep_loop: 7,
        sleep_end: 8,
        attack02_loop: 9
    },
    spikeball: {
        idle01: 0,
        idle02: 1,
        toAttack01: 2,
        attack01: 3,
        attack02: 4,
        toAttack03: 5,
        attack03: 6,
        idle03: 7,
        fromAttack03: 8
    }
};
exports.animations = animations;
/**
 * Returns an RGB array
 * @category Functions
 */
const rgb = (r, g, b) => [r, g, b];
exports.rgb = rgb;
/**
 * Returns an RGBA array
 * @category Functions
 */
const rgba = (r, g, b, a) => [r, g, b, a];
exports.rgba = rgba;
/**
 * Reverses level direction
 * @category Functions
 */
const reverse = () => {
    core_1.$.add((0, core_1.trigger)({
        OBJ_ID: 1917
    }));
};
exports.reverse = reverse;
/**
 * Creates a repeating trigger system that repeats while a condition is true.
 * @param {any} r Condition that defines whether the loop should keep on running (less_than/equal_to/greater_than(counter, number)).
 * @param {Function} triggerFunction Function to run while the condition is true.
 * @param {number} [del=0.05] Delay between each cycle.
 * @category Functions
 */
const while_loop = (r, triggerFunction, del = 0.05) => {
    if (r === true)
        r = (0, control_flow_1.equal_to)((0, counter_1.counter)(-1, true), 0);
    const { count: c_obj, comparison, other } = r;
    const oldContextName = core_1.Context.current;
    const newContext = new core_1.Context(crypto_1.default.randomUUID());
    let check_func;
    if (oldContextName === 'global') {
        check_func = (0, core_1.trigger_function)(() => {
            (0, items_1.compare)(c_obj, comparison, other, newContext.group, undefined);
        });
    }
    else {
        (0, items_1.compare)(c_obj, comparison, other, newContext.group, undefined);
    }
    core_1.Context.set(newContext.name);
    triggerFunction(newContext.group);
    core_1.Context.set(oldContextName);
    let triggerFunctionGroup = newContext.group;
    let context = core_1.Context.findByGroup(triggerFunctionGroup);
    const findDeepestChildContext = (name) => {
        let cond = true;
        let res_name = name;
        while (cond) {
            cond = !!core_1.Context.last_context_children[name];
            if (cond) {
                res_name = core_1.Context.last_context_children[res_name];
                cond = !!core_1.Context.last_context_children[res_name];
            }
            else {
                break;
            }
        }
        return res_name;
    };
    let currentG = core_1.Context.findByName(findDeepestChildContext(context.name)).group;
    if (!currentG) {
        currentG = triggerFunctionGroup;
    }
    core_1.$.extend_trigger_func(currentG, () => {
        oldContextName === 'global'
            ? check_func.call(del)
            : core_1.Context.findByName(oldContextName).group.call(del);
    });
    if (check_func)
        check_func.call(del);
};
exports.while_loop = while_loop;
/**
 * A type of trigger function that, when called, lets you block all other triggers until a trigger function stops executing.
 * @param {Function} func Trigger function; callback provides parameter `stop_exec` that lets you stop blocking at a specific place.
 * @returns {TriggerFunctionGroup} Group ID of trigger function.
 * @category Functions
 */
const blocking_trigger_fn = (func) => {
    let contextIDX = 0;
    const contextIDXC = (0, counter_1.counter)();
    const tempIDXC = (0, counter_1.counter)();
    const aftercall = (0, core_1.trigger_function)(() => { });
    let alr_stopped = false;
    const stop_exec = () => {
        contextIDXC.set(tempIDXC);
        aftercall.call();
        alr_stopped = true;
    };
    const newctx = (0, core_1.trigger_function)(() => {
        func(stop_exec);
        if (!alr_stopped)
            stop_exec();
    });
    newctx.call = (delay = 0) => {
        contextIDX++;
        tempIDXC.set(contextIDX);
        (0, control_flow_1.spawn_trigger)(newctx, delay).add();
        core_1.Context.set(aftercall);
        let stored;
        (0, items_1.compare)(contextIDXC, constants_1.EQ, contextIDX, (0, core_1.trigger_function)(() => {
            stored = core_1.$.trigger_fn_context();
        }), undefined);
        core_1.Context.set(stored);
    };
    return newctx;
};
exports.blocking_trigger_fn = blocking_trigger_fn;
exports.default = core_1.$;
