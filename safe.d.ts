import { $, trigger, Context, trigger_function, group_fn as group, color_fn as color, block_fn as block, object, hsv, unknown_g, unknown_c, unknown_b, extract, level, ignore_context_change, speed, range, obj_props, $group, $color, $block, levelstring, wait } from './core';
import type { Counter, FloatCounter, GJsEvent, Gamescene, Song, OptionsTrigger, TriggerFunctionGroup, GJsObject, ExportConfig, ExportOptions, KnownIds, Dictionary, KnownIdKind, TriggerCallback, Level } from './core';
import { ITEM, TIMER, EQ, ADD, SUB, MUL, DIV, GREATER, GREATER_OR_EQ, LESS, LESS_OR_EQ, NOT_EQ, ABS, NEG, RND, FLR, CEI, ELASTIC_OUT, BACK_IN_OUT, BOUNCE_IN, BACK_OUT, EASE_OUT, EASE_IN, EASE_IN_OUT, ELASTIC_IN_OUT, BOUNCE_OUT, EXPONENTIAL_IN, EXPONENTIAL_OUT, SINE_IN_OUT, BOUNCE_IN_OUT, SINE_IN, ELASTIC_IN, SINE_OUT, EXPONENTIAL_IN_OUT, BACK_IN, NONE, EQUAL_TO, LARGER_THAN, SMALLER_THAN, MODE_STOP, MODE_LOOP, MODE_LAST, LEFT_EDGE, RIGHT_EDGE, UP_EDGE, DOWN_EDGE, obj_ids, BG, GROUND, LINE, _3DLINE, OBJECT, GROUND2, BLACK, WHITE, LIGHTER, MIDDLEGROUND, MIDDLEGROUND_2 } from './constants';
import { on, touch, touch_end, collision, collision_exit, death, count, x_position, event, gamescene, frame, render_frame } from './lib/events';
import { spawn_trigger, remappable, sequence, call_with_delay, equal_to, less_than, greater_than, for_loop, frame_loop, frames, render_frames, render_frame_loop } from './lib/control-flow';
import { item_edit, item_comp, compare } from './lib/items';
import { counter, float_counter, timer } from './lib/counter';
import { camera_offset, camera_static, camera_zoom, camera_mode, camera_rotate, camera_edge, song, teleport, move_trigger, timewarp, color_trigger, toggle_on_trigger, toggle_off_trigger, hide_player, gradient, random, advanced_random, gravity, options, end, player_control, particle_system, spawn_particle } from './lib/general-purpose';
import { shader_layers, shader_layer, sepia, hue_shift, grayscale, pixelate, chromatic, glitch, bulge, split_screen } from './lib/shaders';
import keyframe_system from './lib/keyframes';
import particle_props from './properties/particles';
import events from './properties/game_events';
import { log } from './lib/log';
import { LevelReader, SingleLevelReader } from './reader';
import { exportConfig } from './core';
declare const animations: {
    big_beast: {
        bite: number;
        attack01: number;
        attack01_end: number;
        idle01: number;
    };
    bat: {
        idle01: number;
        idle02: number;
        idle03: number;
        attack01: number;
        attack02: number;
        attack02_end: number;
        sleep: number;
        sleep_loop: number;
        sleep_end: number;
        attack02_loop: number;
    };
    spikeball: {
        idle01: number;
        idle02: number;
        toAttack01: number;
        attack01: number;
        attack02: number;
        toAttack03: number;
        attack03: number;
        idle03: number;
        fromAttack03: number;
    };
};
/**
 * Returns an RGB array
 * @category Functions
 */
declare const rgb: (r: number, g: number, b: number) => number[];
/**
 * Returns an RGBA array
 * @category Functions
 */
declare const rgba: (r: number, g: number, b: number, a: number) => number[];
/**
 * Reverses level direction
 * @category Functions
 */
declare const reverse: () => void;
/**
 * Creates a repeating trigger system that repeats while a condition is true.
 * @param {any} r Condition that defines whether the loop should keep on running (less_than/equal_to/greater_than(counter, number)).
 * @param {Function} triggerFunction Function to run while the condition is true.
 * @param {number} [del=0.05] Delay between each cycle.
 * @category Functions
 */
declare const while_loop: (r: any, triggerFunction: (group: any) => void, del?: number) => void;
/**
 * A type of trigger function that, when called, lets you block all other triggers until a trigger function stops executing.
 * @param {Function} func Trigger function; callback provides parameter `stop_exec` that lets you stop blocking at a specific place.
 * @returns {TriggerFunctionGroup} Group ID of trigger function.
 * @category Functions
 */
declare const blocking_trigger_fn: (func: (stop_exec: () => void) => void) => TriggerFunctionGroup;
export { ITEM, TIMER, EQ, ADD, SUB, MUL, DIV, GREATER, GREATER_OR_EQ, LESS, LESS_OR_EQ, NOT_EQ, ABS, NEG, RND, FLR, CEI, ELASTIC_OUT, BACK_IN_OUT, BOUNCE_IN, BACK_OUT, EASE_OUT, EASE_IN, EASE_IN_OUT, ELASTIC_IN_OUT, BOUNCE_OUT, EXPONENTIAL_IN, EXPONENTIAL_OUT, SINE_IN_OUT, BOUNCE_IN_OUT, SINE_IN, ELASTIC_IN, SINE_OUT, EXPONENTIAL_IN_OUT, BACK_IN, NONE, EQUAL_TO, LARGER_THAN, SMALLER_THAN, MODE_STOP, MODE_LOOP, MODE_LAST, LEFT_EDGE, RIGHT_EDGE, UP_EDGE, DOWN_EDGE, BG, GROUND, LINE, _3DLINE, OBJECT, GROUND2, BLACK, WHITE, LIGHTER, MIDDLEGROUND, MIDDLEGROUND_2, on, touch, touch_end, collision, collision_exit, death, count, x_position, event, gamescene, frame, render_frame, spawn_trigger, remappable, sequence, call_with_delay, equal_to, less_than, greater_than, for_loop, frame_loop, frames, render_frames, render_frame_loop, item_edit, item_comp, compare, counter, float_counter, timer, camera_offset, camera_static, camera_zoom, camera_mode, camera_rotate, camera_edge, song, teleport, move_trigger, timewarp, color_trigger, toggle_on_trigger, toggle_off_trigger, hide_player, gradient, random, advanced_random, gravity, options, end, player_control, particle_system, spawn_particle, shader_layers, shader_layer, sepia, hue_shift, grayscale, pixelate, chromatic, glitch, bulge, split_screen, keyframe_system, particle_props, events, log, LevelReader, SingleLevelReader, trigger, object, trigger_function, group, color, block, range, Context, level, ignore_context_change, hsv, speed, animations, obj_ids, blocking_trigger_fn, while_loop, rgb, rgba, reverse, unknown_g, unknown_c, unknown_b, extract, exportConfig, $, obj_props, $group, $color, $block, levelstring, wait };
export type { Counter, FloatCounter, GJsEvent, Gamescene, Song, OptionsTrigger, TriggerFunctionGroup, GJsObject, ExportConfig, ExportOptions, KnownIds, Dictionary, KnownIdKind, TriggerCallback, Level };
export default $;
