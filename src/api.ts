import { invariant } from './invariant';
import { camelcaseToSpaceCase } from './utils';
import { ArgKey } from './types';

interface Option<T extends Record<string, ArgKey> = Record<string, ArgKey>> {
  description: string;
  arguments?: T;
}

type ParamMap = Record<string, Option>;

/** Internal container class that holds metadata about each HyperDeck event */
class HyperDeckAPI<T extends ParamMap = {}> {
  constructor(private readonly options: T = {} as any) {}

  public addOption = <K extends string, R extends Record<string, ArgKey> = {}>(
    key: K | [K, ...string[]],
    option: Option<R>
  ): HyperDeckAPI<T & { [key in K]: Option<R> }> => {
    const k = Array.isArray(key) ? key[0] : key;
    invariant(!this.options.hasOwnProperty(k), 'option already exists for key `%s`', k);
    // NOTE: this mutates the original options object
    // shouldn't be a problem since this is only used internally
    Object.assign(this.options, { [k]: option });
    return this as any;
  };

  /** Get a `Set` of param names keyed by function name */
  public getParamsByKey = (): { [K in keyof T]: Record<string, ArgKey> } =>
    Object.entries(this.options).reduce<Record<string, Record<string, ArgKey>>>(
      (prev, [commandName, value]) => {
        if (!value.arguments) {
          // we still want hasOwnProperty(key) to be true
          prev[commandName] = {};
          return prev;
        }
        prev[commandName] = Object.entries(value.arguments).reduce<Record<string, ArgKey>>(
          (argObj, [argKey, argType]) => {
            argObj[camelcaseToSpaceCase(argKey)] = argType;
            return argObj;
          },
          {}
        );
        return prev;
      },
      {}
    ) as any;
}

const api = new HyperDeckAPI()
  .addOption(['help', '?'], {
    description: 'Provides help text on all commands and parameters',
  })
  .addOption('commands', {
    description: 'return commands in XML format',
  })
  .addOption('device info', {
    description: 'return device information',
  })
  .addOption('disk list', {
    description: 'query clip list on active disk',
    arguments: {
      slotId: 'number',
    },
  })
  .addOption('quit', {
    description: 'disconnect ethernet control',
  })
  .addOption('ping', {
    description: 'check device is responding',
  })
  .addOption('preview', {
    description: 'switch to preview or output',
    arguments: {
      enable: 'boolean',
    },
  })
  .addOption('play', {
    description: 'play from current timecode',
    arguments: {
      speed: 'number',
      loop: 'boolean',
      singleClip: 'boolean',
    },
  })
  .addOption('playrange', {
    description: 'query playrange setting',
  })
  .addOption('playrange set', {
    description: 'set play range to play clip {n} only',
    arguments: {
      // maybe number?
      clipId: 'string',
      // description: 'set play range to play between timecode {inT} and timecode {outT}',
      in: 'timecode',
      out: 'timecode',
      // 'set play range in units of frames between timeline position {in} and position {out} clear/reset play range°setting',
      timelineIn: 'number',
      timelineOut: 'number',
    },
  })
  .addOption('playrange clear', {
    description: 'clear/reset play range setting',
  })
  .addOption('play on startup', {
    description: 'query unit play on startup state',
    // description: 'enable or disable play on startup',
    arguments: {
      enable: 'boolean',
      singleClip: 'boolean',
    },
  })
  .addOption('play option', {
    description: 'query play options',
    arguments: {
      stopMode: 'stopmode',
    },
  })
  .addOption('record', {
    description: 'record from current input',
    arguments: {
      name: 'string',
    },
  })
  .addOption('record spill', {
    description: 'spill current recording to next slot',
    arguments: {
      slotId: 'number',
    },
  })
  .addOption('stop', {
    description: 'stop playback or recording',
  })
  .addOption('clips count', {
    description: 'query number of clips on timeline',
  })
  .addOption('clips get', {
    description: 'query all timeline clips',
    arguments: {
      clipId: 'number',
      count: 'number',
      version: 'number',
    },
  })
  .addOption('clips add', {
    description: 'append a clip to timeline',
    arguments: {
      name: 'string',
      clipId: 'string',
      in: 'timecode',
      out: 'timecode',
    },
  })
  .addOption('clips remove', {
    description: 'remove clip {n} from the timeline (invalidates clip ids following clip {n})',
    arguments: {
      clidId: 'string',
    },
  })
  .addOption('clips clear', {
    description: 'empty timeline clip list',
  })
  .addOption('transport info', {
    description: 'query current activity',
  })
  .addOption('slot info', {
    description: 'query active slot',
    arguments: {
      slotId: 'number',
    },
  })
  .addOption('slot select', {
    description: 'switch to specified slot',
    arguments: {
      slotId: 'number',
      videoFormat: 'videoformat',
    },
  })
  .addOption('slot unblock', {
    description: 'unblock active slot',
    arguments: {
      slotId: 'number',
    },
  })
  .addOption('dynamic range', {
    description: 'query dynamic range settings',
    arguments: {
      // TODO(meyer) is this correct?
      playbackOverride: 'string',
    },
  })
  .addOption('notify', {
    description: 'query notification status',
    arguments: {
      remote: 'boolean',
      transport: 'boolean',
      slot: 'boolean',
      configuration: 'boolean',
      droppedFrames: 'boolean',
      displayTimecode: 'boolean',
      timelinePosition: 'boolean',
      playrange: 'boolean',
      dynamicRange: 'boolean',
    },
  })
  .addOption('goto', {
    description: 'go forward or backward within a clip or timeline',
    arguments: {
      clipId: 'string',
      clip: 'goto',
      timeline: 'goto',
      timecode: 'timecode',
      slotId: 'number',
    },
  })
  .addOption('jog', {
    description: 'jog forward or backward',
    arguments: {
      timecode: 'timecode',
    },
  })
  .addOption('shuttle', {
    description: 'shuttle with speed',
    arguments: {
      speed: 'number',
    },
  })
  .addOption('remote', {
    description: 'query unit remote control state',
    arguments: {
      enable: 'boolean',
      override: 'boolean',
    },
  })
  .addOption('configuration', {
    description: 'query configuration settings',
    arguments: {
      videoInput: 'videoinput',
      audioInput: 'audioinput',
      fileFormat: 'fileformat',
      audioCodec: 'audiocodec',
      timecodeInput: 'timecodeinput',
      timecodePreset: 'timecode',
      audioInputChannels: 'number',
      recordTrigger: 'recordtrigger',
      recordPrefix: 'string',
      appendTimestamp: 'boolean',
    },
  })
  .addOption('uptime', {
    description: 'return time since last boot',
  })
  .addOption('format', {
    description: 'prepare a disk formatting operation to filesystem {format}',
    arguments: {
      prepare: 'string',
      confirm: 'string',
    },
  })
  .addOption('identify', {
    description: 'identify the device',
    arguments: {
      enable: 'boolean',
    },
  })
  .addOption('watchdog', {
    description: 'client connection timeout',
    arguments: {
      period: 'number',
    },
  });

export const paramsByKey = api.getParamsByKey();
