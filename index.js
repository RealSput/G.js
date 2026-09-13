"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3DLINE = exports.LINE = exports.GROUND = exports.BG = exports.DOWN_EDGE = exports.UP_EDGE = exports.RIGHT_EDGE = exports.LEFT_EDGE = exports.MODE_LAST = exports.MODE_LOOP = exports.MODE_STOP = exports.SMALLER_THAN = exports.LARGER_THAN = exports.EQUAL_TO = exports.NONE = exports.BACK_IN = exports.EXPONENTIAL_IN_OUT = exports.SINE_OUT = exports.ELASTIC_IN = exports.SINE_IN = exports.BOUNCE_IN_OUT = exports.SINE_IN_OUT = exports.EXPONENTIAL_OUT = exports.EXPONENTIAL_IN = exports.BOUNCE_OUT = exports.ELASTIC_IN_OUT = exports.EASE_IN_OUT = exports.EASE_IN = exports.EASE_OUT = exports.BACK_OUT = exports.BOUNCE_IN = exports.BACK_IN_OUT = exports.ELASTIC_OUT = exports.CEI = exports.FLR = exports.RND = exports.NEG = exports.ABS = exports.NOT_EQ = exports.LESS_OR_EQ = exports.LESS = exports.GREATER_OR_EQ = exports.GREATER = exports.DIV = exports.MUL = exports.SUB = exports.ADD = exports.EQ = exports.TIMER = exports.ITEM = void 0;
exports.toggle_off_trigger = exports.toggle_on_trigger = exports.color_trigger = exports.timewarp = exports.move_trigger = exports.teleport = exports.song = exports.camera_edge = exports.camera_rotate = exports.camera_mode = exports.camera_zoom = exports.camera_static = exports.camera_offset = exports.timer = exports.float_counter = exports.counter = exports.compare = exports.item_comp = exports.item_edit = exports.render_frame_loop = exports.render_frames = exports.frames = exports.frame_loop = exports.for_loop = exports.greater_than = exports.less_than = exports.equal_to = exports.call_with_delay = exports.sequence = exports.remappable = exports.spawn_trigger = exports.render_frame = exports.frame = exports.gamescene = exports.event = exports.x_position = exports.count = exports.death = exports.collision_exit = exports.collision = exports.touch_end = exports.touch = exports.on = exports.MIDDLEGROUND_2 = exports.MIDDLEGROUND = exports.LIGHTER = exports.WHITE = exports.BLACK = exports.GROUND2 = exports.OBJECT = void 0;
exports.extract = exports.$ = exports.unknown_b = exports.unknown_c = exports.unknown_g = exports.reverse = exports.rgba = exports.rgb = exports.while_loop = exports.blocking_trigger_fn = exports.obj_ids = exports.animations = exports.speed = exports.hsv = exports.ignore_context_change = exports.level = exports.Context = exports.range = exports.block = exports.color = exports.group = exports.trigger_function = exports.object = exports.trigger = exports.SingleLevelReader = exports.LevelReader = exports.log = exports.events = exports.particle_props = exports.keyframe_system = exports.split_screen = exports.bulge = exports.glitch = exports.chromatic = exports.pixelate = exports.grayscale = exports.hue_shift = exports.sepia = exports.shader_layer = exports.shader_layers = exports.spawn_particle = exports.particle_system = exports.player_control = exports.end = exports.options = exports.gravity = exports.advanced_random = exports.random = exports.gradient = exports.hide_player = void 0;
exports.$block = exports.$color = exports.$group = exports.wait = exports.obj_props = exports.levelstring = void 0;
/**
 * @module index
 */
const safe_1 = require("./safe");
Object.defineProperty(exports, "$", { enumerable: true, get: function () { return safe_1.$; } });
Object.defineProperty(exports, "extract", { enumerable: true, get: function () { return safe_1.extract; } });
Object.defineProperty(exports, "ITEM", { enumerable: true, get: function () { return safe_1.ITEM; } });
Object.defineProperty(exports, "TIMER", { enumerable: true, get: function () { return safe_1.TIMER; } });
Object.defineProperty(exports, "EQ", { enumerable: true, get: function () { return safe_1.EQ; } });
Object.defineProperty(exports, "ADD", { enumerable: true, get: function () { return safe_1.ADD; } });
Object.defineProperty(exports, "SUB", { enumerable: true, get: function () { return safe_1.SUB; } });
Object.defineProperty(exports, "MUL", { enumerable: true, get: function () { return safe_1.MUL; } });
Object.defineProperty(exports, "DIV", { enumerable: true, get: function () { return safe_1.DIV; } });
Object.defineProperty(exports, "GREATER", { enumerable: true, get: function () { return safe_1.GREATER; } });
Object.defineProperty(exports, "GREATER_OR_EQ", { enumerable: true, get: function () { return safe_1.GREATER_OR_EQ; } });
Object.defineProperty(exports, "LESS", { enumerable: true, get: function () { return safe_1.LESS; } });
Object.defineProperty(exports, "LESS_OR_EQ", { enumerable: true, get: function () { return safe_1.LESS_OR_EQ; } });
Object.defineProperty(exports, "NOT_EQ", { enumerable: true, get: function () { return safe_1.NOT_EQ; } });
Object.defineProperty(exports, "ABS", { enumerable: true, get: function () { return safe_1.ABS; } });
Object.defineProperty(exports, "NEG", { enumerable: true, get: function () { return safe_1.NEG; } });
Object.defineProperty(exports, "RND", { enumerable: true, get: function () { return safe_1.RND; } });
Object.defineProperty(exports, "FLR", { enumerable: true, get: function () { return safe_1.FLR; } });
Object.defineProperty(exports, "CEI", { enumerable: true, get: function () { return safe_1.CEI; } });
Object.defineProperty(exports, "ELASTIC_OUT", { enumerable: true, get: function () { return safe_1.ELASTIC_OUT; } });
Object.defineProperty(exports, "BACK_IN_OUT", { enumerable: true, get: function () { return safe_1.BACK_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_IN", { enumerable: true, get: function () { return safe_1.BOUNCE_IN; } });
Object.defineProperty(exports, "BACK_OUT", { enumerable: true, get: function () { return safe_1.BACK_OUT; } });
Object.defineProperty(exports, "EASE_OUT", { enumerable: true, get: function () { return safe_1.EASE_OUT; } });
Object.defineProperty(exports, "EASE_IN", { enumerable: true, get: function () { return safe_1.EASE_IN; } });
Object.defineProperty(exports, "EASE_IN_OUT", { enumerable: true, get: function () { return safe_1.EASE_IN_OUT; } });
Object.defineProperty(exports, "ELASTIC_IN_OUT", { enumerable: true, get: function () { return safe_1.ELASTIC_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_OUT", { enumerable: true, get: function () { return safe_1.BOUNCE_OUT; } });
Object.defineProperty(exports, "EXPONENTIAL_IN", { enumerable: true, get: function () { return safe_1.EXPONENTIAL_IN; } });
Object.defineProperty(exports, "EXPONENTIAL_OUT", { enumerable: true, get: function () { return safe_1.EXPONENTIAL_OUT; } });
Object.defineProperty(exports, "SINE_IN_OUT", { enumerable: true, get: function () { return safe_1.SINE_IN_OUT; } });
Object.defineProperty(exports, "BOUNCE_IN_OUT", { enumerable: true, get: function () { return safe_1.BOUNCE_IN_OUT; } });
Object.defineProperty(exports, "SINE_IN", { enumerable: true, get: function () { return safe_1.SINE_IN; } });
Object.defineProperty(exports, "ELASTIC_IN", { enumerable: true, get: function () { return safe_1.ELASTIC_IN; } });
Object.defineProperty(exports, "SINE_OUT", { enumerable: true, get: function () { return safe_1.SINE_OUT; } });
Object.defineProperty(exports, "EXPONENTIAL_IN_OUT", { enumerable: true, get: function () { return safe_1.EXPONENTIAL_IN_OUT; } });
Object.defineProperty(exports, "BACK_IN", { enumerable: true, get: function () { return safe_1.BACK_IN; } });
Object.defineProperty(exports, "NONE", { enumerable: true, get: function () { return safe_1.NONE; } });
Object.defineProperty(exports, "EQUAL_TO", { enumerable: true, get: function () { return safe_1.EQUAL_TO; } });
Object.defineProperty(exports, "LARGER_THAN", { enumerable: true, get: function () { return safe_1.LARGER_THAN; } });
Object.defineProperty(exports, "SMALLER_THAN", { enumerable: true, get: function () { return safe_1.SMALLER_THAN; } });
Object.defineProperty(exports, "MODE_STOP", { enumerable: true, get: function () { return safe_1.MODE_STOP; } });
Object.defineProperty(exports, "MODE_LOOP", { enumerable: true, get: function () { return safe_1.MODE_LOOP; } });
Object.defineProperty(exports, "MODE_LAST", { enumerable: true, get: function () { return safe_1.MODE_LAST; } });
Object.defineProperty(exports, "LEFT_EDGE", { enumerable: true, get: function () { return safe_1.LEFT_EDGE; } });
Object.defineProperty(exports, "RIGHT_EDGE", { enumerable: true, get: function () { return safe_1.RIGHT_EDGE; } });
Object.defineProperty(exports, "UP_EDGE", { enumerable: true, get: function () { return safe_1.UP_EDGE; } });
Object.defineProperty(exports, "DOWN_EDGE", { enumerable: true, get: function () { return safe_1.DOWN_EDGE; } });
Object.defineProperty(exports, "BG", { enumerable: true, get: function () { return safe_1.BG; } });
Object.defineProperty(exports, "GROUND", { enumerable: true, get: function () { return safe_1.GROUND; } });
Object.defineProperty(exports, "LINE", { enumerable: true, get: function () { return safe_1.LINE; } });
Object.defineProperty(exports, "_3DLINE", { enumerable: true, get: function () { return safe_1._3DLINE; } });
Object.defineProperty(exports, "OBJECT", { enumerable: true, get: function () { return safe_1.OBJECT; } });
Object.defineProperty(exports, "GROUND2", { enumerable: true, get: function () { return safe_1.GROUND2; } });
Object.defineProperty(exports, "BLACK", { enumerable: true, get: function () { return safe_1.BLACK; } });
Object.defineProperty(exports, "WHITE", { enumerable: true, get: function () { return safe_1.WHITE; } });
Object.defineProperty(exports, "LIGHTER", { enumerable: true, get: function () { return safe_1.LIGHTER; } });
Object.defineProperty(exports, "MIDDLEGROUND", { enumerable: true, get: function () { return safe_1.MIDDLEGROUND; } });
Object.defineProperty(exports, "MIDDLEGROUND_2", { enumerable: true, get: function () { return safe_1.MIDDLEGROUND_2; } });
Object.defineProperty(exports, "on", { enumerable: true, get: function () { return safe_1.on; } });
Object.defineProperty(exports, "touch", { enumerable: true, get: function () { return safe_1.touch; } });
Object.defineProperty(exports, "touch_end", { enumerable: true, get: function () { return safe_1.touch_end; } });
Object.defineProperty(exports, "collision", { enumerable: true, get: function () { return safe_1.collision; } });
Object.defineProperty(exports, "collision_exit", { enumerable: true, get: function () { return safe_1.collision_exit; } });
Object.defineProperty(exports, "death", { enumerable: true, get: function () { return safe_1.death; } });
Object.defineProperty(exports, "count", { enumerable: true, get: function () { return safe_1.count; } });
Object.defineProperty(exports, "x_position", { enumerable: true, get: function () { return safe_1.x_position; } });
Object.defineProperty(exports, "event", { enumerable: true, get: function () { return safe_1.event; } });
Object.defineProperty(exports, "gamescene", { enumerable: true, get: function () { return safe_1.gamescene; } });
Object.defineProperty(exports, "frame", { enumerable: true, get: function () { return safe_1.frame; } });
Object.defineProperty(exports, "render_frame", { enumerable: true, get: function () { return safe_1.render_frame; } });
Object.defineProperty(exports, "spawn_trigger", { enumerable: true, get: function () { return safe_1.spawn_trigger; } });
Object.defineProperty(exports, "remappable", { enumerable: true, get: function () { return safe_1.remappable; } });
Object.defineProperty(exports, "sequence", { enumerable: true, get: function () { return safe_1.sequence; } });
Object.defineProperty(exports, "call_with_delay", { enumerable: true, get: function () { return safe_1.call_with_delay; } });
Object.defineProperty(exports, "equal_to", { enumerable: true, get: function () { return safe_1.equal_to; } });
Object.defineProperty(exports, "less_than", { enumerable: true, get: function () { return safe_1.less_than; } });
Object.defineProperty(exports, "greater_than", { enumerable: true, get: function () { return safe_1.greater_than; } });
Object.defineProperty(exports, "for_loop", { enumerable: true, get: function () { return safe_1.for_loop; } });
Object.defineProperty(exports, "frame_loop", { enumerable: true, get: function () { return safe_1.frame_loop; } });
Object.defineProperty(exports, "frames", { enumerable: true, get: function () { return safe_1.frames; } });
Object.defineProperty(exports, "render_frames", { enumerable: true, get: function () { return safe_1.render_frames; } });
Object.defineProperty(exports, "render_frame_loop", { enumerable: true, get: function () { return safe_1.render_frame_loop; } });
Object.defineProperty(exports, "item_edit", { enumerable: true, get: function () { return safe_1.item_edit; } });
Object.defineProperty(exports, "item_comp", { enumerable: true, get: function () { return safe_1.item_comp; } });
Object.defineProperty(exports, "compare", { enumerable: true, get: function () { return safe_1.compare; } });
Object.defineProperty(exports, "counter", { enumerable: true, get: function () { return safe_1.counter; } });
Object.defineProperty(exports, "float_counter", { enumerable: true, get: function () { return safe_1.float_counter; } });
Object.defineProperty(exports, "timer", { enumerable: true, get: function () { return safe_1.timer; } });
Object.defineProperty(exports, "camera_offset", { enumerable: true, get: function () { return safe_1.camera_offset; } });
Object.defineProperty(exports, "camera_static", { enumerable: true, get: function () { return safe_1.camera_static; } });
Object.defineProperty(exports, "camera_zoom", { enumerable: true, get: function () { return safe_1.camera_zoom; } });
Object.defineProperty(exports, "camera_mode", { enumerable: true, get: function () { return safe_1.camera_mode; } });
Object.defineProperty(exports, "camera_rotate", { enumerable: true, get: function () { return safe_1.camera_rotate; } });
Object.defineProperty(exports, "camera_edge", { enumerable: true, get: function () { return safe_1.camera_edge; } });
Object.defineProperty(exports, "song", { enumerable: true, get: function () { return safe_1.song; } });
Object.defineProperty(exports, "teleport", { enumerable: true, get: function () { return safe_1.teleport; } });
Object.defineProperty(exports, "move_trigger", { enumerable: true, get: function () { return safe_1.move_trigger; } });
Object.defineProperty(exports, "timewarp", { enumerable: true, get: function () { return safe_1.timewarp; } });
Object.defineProperty(exports, "color_trigger", { enumerable: true, get: function () { return safe_1.color_trigger; } });
Object.defineProperty(exports, "toggle_on_trigger", { enumerable: true, get: function () { return safe_1.toggle_on_trigger; } });
Object.defineProperty(exports, "toggle_off_trigger", { enumerable: true, get: function () { return safe_1.toggle_off_trigger; } });
Object.defineProperty(exports, "hide_player", { enumerable: true, get: function () { return safe_1.hide_player; } });
Object.defineProperty(exports, "gradient", { enumerable: true, get: function () { return safe_1.gradient; } });
Object.defineProperty(exports, "random", { enumerable: true, get: function () { return safe_1.random; } });
Object.defineProperty(exports, "advanced_random", { enumerable: true, get: function () { return safe_1.advanced_random; } });
Object.defineProperty(exports, "gravity", { enumerable: true, get: function () { return safe_1.gravity; } });
Object.defineProperty(exports, "options", { enumerable: true, get: function () { return safe_1.options; } });
Object.defineProperty(exports, "end", { enumerable: true, get: function () { return safe_1.end; } });
Object.defineProperty(exports, "player_control", { enumerable: true, get: function () { return safe_1.player_control; } });
Object.defineProperty(exports, "particle_system", { enumerable: true, get: function () { return safe_1.particle_system; } });
Object.defineProperty(exports, "spawn_particle", { enumerable: true, get: function () { return safe_1.spawn_particle; } });
Object.defineProperty(exports, "shader_layers", { enumerable: true, get: function () { return safe_1.shader_layers; } });
Object.defineProperty(exports, "shader_layer", { enumerable: true, get: function () { return safe_1.shader_layer; } });
Object.defineProperty(exports, "sepia", { enumerable: true, get: function () { return safe_1.sepia; } });
Object.defineProperty(exports, "hue_shift", { enumerable: true, get: function () { return safe_1.hue_shift; } });
Object.defineProperty(exports, "grayscale", { enumerable: true, get: function () { return safe_1.grayscale; } });
Object.defineProperty(exports, "pixelate", { enumerable: true, get: function () { return safe_1.pixelate; } });
Object.defineProperty(exports, "chromatic", { enumerable: true, get: function () { return safe_1.chromatic; } });
Object.defineProperty(exports, "glitch", { enumerable: true, get: function () { return safe_1.glitch; } });
Object.defineProperty(exports, "bulge", { enumerable: true, get: function () { return safe_1.bulge; } });
Object.defineProperty(exports, "split_screen", { enumerable: true, get: function () { return safe_1.split_screen; } });
Object.defineProperty(exports, "keyframe_system", { enumerable: true, get: function () { return safe_1.keyframe_system; } });
Object.defineProperty(exports, "particle_props", { enumerable: true, get: function () { return safe_1.particle_props; } });
Object.defineProperty(exports, "events", { enumerable: true, get: function () { return safe_1.events; } });
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return safe_1.log; } });
Object.defineProperty(exports, "LevelReader", { enumerable: true, get: function () { return safe_1.LevelReader; } });
Object.defineProperty(exports, "SingleLevelReader", { enumerable: true, get: function () { return safe_1.SingleLevelReader; } });
Object.defineProperty(exports, "trigger", { enumerable: true, get: function () { return safe_1.trigger; } });
Object.defineProperty(exports, "object", { enumerable: true, get: function () { return safe_1.object; } });
Object.defineProperty(exports, "trigger_function", { enumerable: true, get: function () { return safe_1.trigger_function; } });
Object.defineProperty(exports, "group", { enumerable: true, get: function () { return safe_1.group; } });
Object.defineProperty(exports, "color", { enumerable: true, get: function () { return safe_1.color; } });
Object.defineProperty(exports, "block", { enumerable: true, get: function () { return safe_1.block; } });
Object.defineProperty(exports, "range", { enumerable: true, get: function () { return safe_1.range; } });
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return safe_1.Context; } });
Object.defineProperty(exports, "level", { enumerable: true, get: function () { return safe_1.level; } });
Object.defineProperty(exports, "ignore_context_change", { enumerable: true, get: function () { return safe_1.ignore_context_change; } });
Object.defineProperty(exports, "hsv", { enumerable: true, get: function () { return safe_1.hsv; } });
Object.defineProperty(exports, "speed", { enumerable: true, get: function () { return safe_1.speed; } });
Object.defineProperty(exports, "animations", { enumerable: true, get: function () { return safe_1.animations; } });
Object.defineProperty(exports, "obj_ids", { enumerable: true, get: function () { return safe_1.obj_ids; } });
Object.defineProperty(exports, "blocking_trigger_fn", { enumerable: true, get: function () { return safe_1.blocking_trigger_fn; } });
Object.defineProperty(exports, "while_loop", { enumerable: true, get: function () { return safe_1.while_loop; } });
Object.defineProperty(exports, "rgb", { enumerable: true, get: function () { return safe_1.rgb; } });
Object.defineProperty(exports, "rgba", { enumerable: true, get: function () { return safe_1.rgba; } });
Object.defineProperty(exports, "reverse", { enumerable: true, get: function () { return safe_1.reverse; } });
Object.defineProperty(exports, "unknown_g", { enumerable: true, get: function () { return safe_1.unknown_g; } });
Object.defineProperty(exports, "unknown_c", { enumerable: true, get: function () { return safe_1.unknown_c; } });
Object.defineProperty(exports, "unknown_b", { enumerable: true, get: function () { return safe_1.unknown_b; } });
Object.defineProperty(exports, "obj_props", { enumerable: true, get: function () { return safe_1.obj_props; } });
Object.defineProperty(exports, "wait", { enumerable: true, get: function () { return safe_1.wait; } });
Object.defineProperty(exports, "$group", { enumerable: true, get: function () { return safe_1.$group; } });
Object.defineProperty(exports, "$color", { enumerable: true, get: function () { return safe_1.$color; } });
Object.defineProperty(exports, "$block", { enumerable: true, get: function () { return safe_1.$block; } });
Object.defineProperty(exports, "levelstring", { enumerable: true, get: function () { return safe_1.levelstring; } });
const publicApi = {
    ITEM: safe_1.ITEM, TIMER: safe_1.TIMER, EQ: safe_1.EQ, ADD: safe_1.ADD, SUB: safe_1.SUB, MUL: safe_1.MUL, DIV: safe_1.DIV, GREATER: safe_1.GREATER, GREATER_OR_EQ: safe_1.GREATER_OR_EQ, LESS: safe_1.LESS, LESS_OR_EQ: safe_1.LESS_OR_EQ, NOT_EQ: safe_1.NOT_EQ,
    ABS: safe_1.ABS, NEG: safe_1.NEG, RND: safe_1.RND, FLR: safe_1.FLR, CEI: safe_1.CEI, ELASTIC_OUT: safe_1.ELASTIC_OUT, BACK_IN_OUT: safe_1.BACK_IN_OUT, BOUNCE_IN: safe_1.BOUNCE_IN, BACK_OUT: safe_1.BACK_OUT, EASE_OUT: safe_1.EASE_OUT,
    EASE_IN: safe_1.EASE_IN, EASE_IN_OUT: safe_1.EASE_IN_OUT, ELASTIC_IN_OUT: safe_1.ELASTIC_IN_OUT, BOUNCE_OUT: safe_1.BOUNCE_OUT, EXPONENTIAL_IN: safe_1.EXPONENTIAL_IN, EXPONENTIAL_OUT: safe_1.EXPONENTIAL_OUT,
    SINE_IN_OUT: safe_1.SINE_IN_OUT, BOUNCE_IN_OUT: safe_1.BOUNCE_IN_OUT, SINE_IN: safe_1.SINE_IN, ELASTIC_IN: safe_1.ELASTIC_IN, SINE_OUT: safe_1.SINE_OUT, EXPONENTIAL_IN_OUT: safe_1.EXPONENTIAL_IN_OUT,
    BACK_IN: safe_1.BACK_IN, NONE: safe_1.NONE, EQUAL_TO: safe_1.EQUAL_TO, LARGER_THAN: safe_1.LARGER_THAN, SMALLER_THAN: safe_1.SMALLER_THAN, MODE_STOP: safe_1.MODE_STOP, MODE_LOOP: safe_1.MODE_LOOP,
    MODE_LAST: safe_1.MODE_LAST, LEFT_EDGE: safe_1.LEFT_EDGE, RIGHT_EDGE: safe_1.RIGHT_EDGE, UP_EDGE: safe_1.UP_EDGE, DOWN_EDGE: safe_1.DOWN_EDGE,
    BG: safe_1.BG, GROUND: safe_1.GROUND, LINE: safe_1.LINE, _3DLINE: safe_1._3DLINE, OBJECT: safe_1.OBJECT, GROUND2: safe_1.GROUND2, BLACK: safe_1.BLACK, WHITE: safe_1.WHITE, LIGHTER: safe_1.LIGHTER, MIDDLEGROUND: safe_1.MIDDLEGROUND, MIDDLEGROUND_2: safe_1.MIDDLEGROUND_2,
    on: safe_1.on, touch: safe_1.touch, touch_end: safe_1.touch_end, collision: safe_1.collision, collision_exit: safe_1.collision_exit, death: safe_1.death, count: safe_1.count, x_position: safe_1.x_position, event: safe_1.event, gamescene: safe_1.gamescene, frame: safe_1.frame, render_frame: safe_1.render_frame,
    spawn_trigger: safe_1.spawn_trigger, remappable: safe_1.remappable, sequence: safe_1.sequence, call_with_delay: safe_1.call_with_delay, equal_to: safe_1.equal_to, less_than: safe_1.less_than, greater_than: safe_1.greater_than, for_loop: safe_1.for_loop, frame_loop: safe_1.frame_loop, frames: safe_1.frames, render_frames: safe_1.render_frames, render_frame_loop: safe_1.render_frame_loop,
    item_edit: safe_1.item_edit, item_comp: safe_1.item_comp, compare: safe_1.compare,
    counter: safe_1.counter, float_counter: safe_1.float_counter, timer: safe_1.timer,
    camera_offset: safe_1.camera_offset, camera_static: safe_1.camera_static, camera_zoom: safe_1.camera_zoom, camera_mode: safe_1.camera_mode, camera_rotate: safe_1.camera_rotate, camera_edge: safe_1.camera_edge, song: safe_1.song, teleport: safe_1.teleport, move_trigger: safe_1.move_trigger, timewarp: safe_1.timewarp, color_trigger: safe_1.color_trigger, toggle_on_trigger: safe_1.toggle_on_trigger, toggle_off_trigger: safe_1.toggle_off_trigger, hide_player: safe_1.hide_player, gradient: safe_1.gradient, random: safe_1.random, advanced_random: safe_1.advanced_random, gravity: safe_1.gravity, options: safe_1.options, end: safe_1.end, player_control: safe_1.player_control, particle_system: safe_1.particle_system, spawn_particle: safe_1.spawn_particle,
    shader_layers: safe_1.shader_layers, shader_layer: safe_1.shader_layer, sepia: safe_1.sepia, hue_shift: safe_1.hue_shift, grayscale: safe_1.grayscale, pixelate: safe_1.pixelate, chromatic: safe_1.chromatic, glitch: safe_1.glitch, bulge: safe_1.bulge, split_screen: safe_1.split_screen,
    keyframe_system: safe_1.keyframe_system, particle_props: safe_1.particle_props, events: safe_1.events, log: safe_1.log, LevelReader: safe_1.LevelReader, SingleLevelReader: safe_1.SingleLevelReader,
    trigger: safe_1.trigger, object: safe_1.object, trigger_function: safe_1.trigger_function, group: safe_1.group, color: safe_1.color, block: safe_1.block, range: safe_1.range, Context: safe_1.Context, level: safe_1.level, ignore_context_change: safe_1.ignore_context_change, hsv: safe_1.hsv, speed: safe_1.speed,
    animations: safe_1.animations, obj_ids: safe_1.obj_ids, blocking_trigger_fn: safe_1.blocking_trigger_fn, while_loop: safe_1.while_loop, rgb: safe_1.rgb, rgba: safe_1.rgba, reverse: safe_1.reverse,
    unknown_g: safe_1.unknown_g, unknown_c: safe_1.unknown_c, unknown_b: safe_1.unknown_b, $: safe_1.$, extract: safe_1.extract, levelstring: safe_1.levelstring, obj_props: safe_1.obj_props,
    wait: safe_1.wait
};
(0, safe_1.extract)(publicApi);
exports.default = safe_1.$;
