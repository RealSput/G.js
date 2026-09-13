import crypto from 'crypto';
import {
    $, trigger, Context, trigger_function, group_fn as group, color_fn as color, block_fn as block, object, hsv,
    unknown_g, unknown_c, unknown_b, extract, level, ignore_context_change, speed, range,
    obj_props,
    $group, $color, $block,
    levelstring, wait
} from './core';
import type {
    Counter, FloatCounter, GJsEvent, Gamescene, Song, OptionsTrigger, TriggerFunctionGroup, GJsObject, ExportConfig, ExportOptions, KnownIds,
    Dictionary, KnownIdKind, TriggerCallback, Level
} from './core';
import {
    ITEM, TIMER, EQ, ADD, SUB, MUL, DIV, GREATER, GREATER_OR_EQ, LESS, LESS_OR_EQ, NOT_EQ,
    ABS, NEG, RND, FLR, CEI, ELASTIC_OUT, BACK_IN_OUT, BOUNCE_IN, BACK_OUT, EASE_OUT,
    EASE_IN, EASE_IN_OUT, ELASTIC_IN_OUT, BOUNCE_OUT, EXPONENTIAL_IN, EXPONENTIAL_OUT,
    SINE_IN_OUT, BOUNCE_IN_OUT, SINE_IN, ELASTIC_IN, SINE_OUT, EXPONENTIAL_IN_OUT,
    BACK_IN, NONE, EQUAL_TO, LARGER_THAN, SMALLER_THAN, MODE_STOP, MODE_LOOP,
    MODE_LAST, LEFT_EDGE, RIGHT_EDGE, UP_EDGE, DOWN_EDGE, obj_ids,
    BG, GROUND, LINE, _3DLINE, OBJECT, GROUND2, BLACK, WHITE, LIGHTER, MIDDLEGROUND, MIDDLEGROUND_2,
} from './constants';

import {
    on, touch, touch_end, collision, collision_exit, death, count, x_position, event, gamescene, frame, render_frame,
} from './lib/events';
import {
    spawn_trigger, remappable, sequence, call_with_delay, equal_to, less_than, greater_than, for_loop, frame_loop, frames, render_frames, render_frame_loop,
} from './lib/control-flow';
import {
    item_edit, item_comp, compare,
} from './lib/items';
import {
    counter, float_counter, timer,
} from './lib/counter';
import {
    camera_offset, camera_static, camera_zoom, camera_mode, camera_rotate, camera_edge, song, teleport, move_trigger, timewarp, color_trigger, toggle_on_trigger, toggle_off_trigger, hide_player, gradient, random, advanced_random, gravity, options, end, player_control, particle_system, spawn_particle,
} from './lib/general-purpose';
import {
    shader_layers, shader_layer, sepia, hue_shift, grayscale, pixelate, chromatic, glitch, bulge, split_screen,
} from './lib/shaders';
import keyframe_system from './lib/keyframes';
import particle_props from './properties/particles';
import events from './properties/game_events';
import { log } from './lib/log';
import { LevelReader, SingleLevelReader } from './reader';
import { exportConfig } from './core';

// Ensure $.exportConfig is initialized
$.exportConfig = exportConfig;

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

/**
 * Returns an RGB array
 * @category Functions
 */
const rgb = (r: number, g: number, b: number) => [r, g, b];

/**
 * Returns an RGBA array
 * @category Functions
 */
const rgba = (r: number, g: number, b: number, a: number) => [r, g, b, a];

/**
 * Reverses level direction
 * @category Functions
 */
const reverse = () => {
    $.add(trigger({
        OBJ_ID: 1917
    }));
};

/**
 * Creates a repeating trigger system that repeats while a condition is true.
 * @param {any} r Condition that defines whether the loop should keep on running (less_than/equal_to/greater_than(counter, number)).
 * @param {Function} triggerFunction Function to run while the condition is true.
 * @param {number} [del=0.05] Delay between each cycle.
 * @category Functions
 */
const while_loop = (r: any, triggerFunction: (group: any) => void, del = 0.05) => {
    if (r === true) r = equal_to(counter(-1, true), 0);
    const { count: c_obj, comparison, other } = r;
    const oldContextName = Context.current;

    const newContext = new Context(crypto.randomUUID());
    let check_func: any;
    if (oldContextName === 'global') {
        check_func = trigger_function(() => {
            compare(c_obj, comparison, other, newContext.group, undefined);
        });
    } else {
        compare(c_obj, comparison, other, newContext.group, undefined);
    }

    Context.set(newContext.name);
    (triggerFunction as any)(newContext.group);
    Context.set(oldContextName);

    let triggerFunctionGroup = newContext.group;

    let context = Context.findByGroup(triggerFunctionGroup);

    const findDeepestChildContext = (name: string) => {
        let cond = true;
        let res_name = name;
        while (cond) {
            cond = !!Context.last_context_children[name];
            if (cond) {
                res_name = Context.last_context_children[res_name];
                cond = !!Context.last_context_children[res_name];
            } else {
                break;
            }
        }
        return res_name;
    };

    let currentG = Context.findByName(findDeepestChildContext(context.name)).group;
    if (!currentG) {
        currentG = triggerFunctionGroup;
    }
    $.extend_trigger_func(currentG, () => {
        oldContextName === 'global'
            ? (check_func as any).call(del)
            : Context.findByName(oldContextName).group.call(del);
    });
    if (check_func) (check_func as any).call(del);
};

/**
 * A type of trigger function that, when called, lets you block all other triggers until a trigger function stops executing.
 * @param {Function} func Trigger function; callback provides parameter `stop_exec` that lets you stop blocking at a specific place.
 * @returns {TriggerFunctionGroup} Group ID of trigger function.
 * @category Functions
 */
const blocking_trigger_fn = (func: (stop_exec: () => void) => void): TriggerFunctionGroup => {
    let contextIDX = 0;
    const contextIDXC = counter();
    const tempIDXC = counter();
    const aftercall = trigger_function(() => { });
    let alr_stopped = false;
    const stop_exec = () => {
        contextIDXC.set(tempIDXC);
        (aftercall as any).call();
        alr_stopped = true;
    };
    const newctx = trigger_function(() => {
        func(stop_exec);
        if (!alr_stopped) stop_exec();
    });

    (newctx as any).call = (delay = 0) => {
        contextIDX++;
        tempIDXC.set(contextIDX);
        spawn_trigger(newctx, delay).add();
        Context.set(aftercall);
        let stored: any;
        compare(contextIDXC, EQ, contextIDX, trigger_function(() => {
            stored = $.trigger_fn_context();
        }), undefined);
        Context.set(stored);
    };
    return newctx as TriggerFunctionGroup;
};

// Re-export everything for pick-and-choose
export {
    ITEM, TIMER, EQ, ADD, SUB, MUL, DIV, GREATER, GREATER_OR_EQ, LESS, LESS_OR_EQ, NOT_EQ,
    ABS, NEG, RND, FLR, CEI, ELASTIC_OUT, BACK_IN_OUT, BOUNCE_IN, BACK_OUT, EASE_OUT,
    EASE_IN, EASE_IN_OUT, ELASTIC_IN_OUT, BOUNCE_OUT, EXPONENTIAL_IN, EXPONENTIAL_OUT,
    SINE_IN_OUT, BOUNCE_IN_OUT, SINE_IN, ELASTIC_IN, SINE_OUT, EXPONENTIAL_IN_OUT,
    BACK_IN, NONE, EQUAL_TO, LARGER_THAN, SMALLER_THAN, MODE_STOP, MODE_LOOP,
    MODE_LAST, LEFT_EDGE, RIGHT_EDGE, UP_EDGE, DOWN_EDGE,
    BG, GROUND, LINE, _3DLINE, OBJECT, GROUND2, BLACK, WHITE, LIGHTER, MIDDLEGROUND, MIDDLEGROUND_2,
    on, touch, touch_end, collision, collision_exit, death, count, x_position, event, gamescene, frame, render_frame,
    spawn_trigger, remappable, sequence, call_with_delay, equal_to, less_than, greater_than, for_loop, frame_loop, frames, render_frames, render_frame_loop,
    item_edit, item_comp, compare,
    counter, float_counter, timer,
    camera_offset, camera_static, camera_zoom, camera_mode, camera_rotate, camera_edge, song, teleport, move_trigger, timewarp, color_trigger, toggle_on_trigger, toggle_off_trigger, hide_player, gradient, random, advanced_random, gravity, options, end, player_control, particle_system, spawn_particle,
    shader_layers, shader_layer, sepia, hue_shift, grayscale, pixelate, chromatic, glitch, bulge, split_screen,
    keyframe_system, particle_props, events, log, LevelReader, SingleLevelReader,
    trigger, object, trigger_function, group, color, block, range, Context, level, ignore_context_change, hsv, speed,
    animations, obj_ids, blocking_trigger_fn, while_loop, rgb, rgba, reverse,
    unknown_g, unknown_c, unknown_b, extract, exportConfig, $, obj_props,
    $group, $color, $block,
    levelstring, wait
};

export type {
    Counter, FloatCounter, GJsEvent, Gamescene, Song, OptionsTrigger, TriggerFunctionGroup, GJsObject, ExportConfig, ExportOptions, KnownIds,
    Dictionary, KnownIdKind, TriggerCallback, Level
};

export default $;

// make sure to update `../safe` (NOT `../safe.js`) to prevent issues