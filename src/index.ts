import { NativeModules } from 'react-native';

const AppleHealthKitNative = NativeModules['AppleHealthKit'];

interface AppleHealthKitOptions {
  permissions: {
    read: string[];
    write: string[];
  }
}

export enum SleepValue {
  Asleep = 'ASLEEP',
  Awake = 'AWAKE',
  InBed = 'INBED',
}

const PROPER_INITIALIZATION_TOKEN = {};

export default class AppleHealthKitZen {

  public native: any = AppleHealthKitNative;

  static init(options: AppleHealthKitOptions): Promise<AppleHealthKitZen> {
    return new Promise((resolve, reject) => {
      AppleHealthKitNative.initHealthKit(options, (err: any, results: any) => {
        if(err) { return reject(err); }
        return resolve(new AppleHealthKitZen(PROPER_INITIALIZATION_TOKEN));
      });
    });
  }

  constructor(properInitializationToken?: any) {
    if(properInitializationToken !== PROPER_INITIALIZATION_TOKEN) {
      throw new Error('You must use AppleHealthKitZen.init(options) to create an instance of AppleHealthKitZen');
    }
  }

  getSleepSamples({ startDate, endDate, limit }: { startDate: string | Date; endDate?: string | Date; limit?: number }) {
    return new Promise((resolve, reject) => {
      this.native.getSleepSamples({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
        limit,
      }, (err: any, results: any) => {
        if(err) { return reject(err); }
        return resolve(results);
      });
    });
  }

  saveSleep({ startDate, endDate, value }: { startDate: string | Date; endDate?: string | Date; value: SleepValue }) {
    return new Promise((resolve, reject) => {
      this.native.saveSleep({
        startDate: startDate instanceof Date ? startDate.toISOString() : startDate,
        endDate: endDate instanceof Date ? endDate.toISOString() : endDate,
        value,
      }, (err: any, results: any) => {
        if(err) { return reject(err); }
        return resolve(results);
      });
    });
  }
}
