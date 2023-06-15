import BackgroundJob from 'react-native-background-job';
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MS_MINUTE, TIME_FORMAT} from '../constants/moment';
import {JOB_UPDATE_RANKS} from '../constants/job';
import STORAGE_KEYS from '../constants/storage';
import {sendError} from '../utils/error';
import moment from 'moment';
import {BACKGROUND_SCAN_MODE} from '../constants/settings';

export const ignoreBatteryOptimizationRequest = async () => {
  try {
    let isPromted = await AsyncStorage.getItem(
      STORAGE_KEYS.IS_BATTERY_OPTIMIZATION_PROMPTED,
    );
    isPromted = JSON.parse(isPromted);

    if (!isPromted) {
      RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
        isEnabled => {
          if (isEnabled) {
            RNDisableBatteryOptimizationsAndroid.enableBackgroundServicesDialogue();
          }
        },
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.IS_BATTERY_OPTIMIZATION_PROMPTED,
        'true',
      );
    }
  } catch (error) {
    sendError({
      title: 'ignoreBatteryOptimizationRequest',
      message: error.message,
    });
  }
};

// const { ranks, settings } = store.getState()
// const { status, data } = ranks
// const { blockEndTimestamp, isScraping } = status
// if (blockEndTimestamp || isScraping) return

// const { backgroundScanTime, backgroundScanDate } = settings.data
// const isScannedToday = moment(backgroundScanDate).isSame(moment(), 'day')
// const isTimeToScan = moment().isSameOrAfter(moment(backgroundScanTime, TIME_FORMAT))
// if (isScannedToday || !isTimeToScan || !data.length) return
// await startBackground()

const job = async () => {
  try {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    const {backgroundScanTime, backgroundScanDate, backgroundScanMode} =
      JSON.parse(settings);
    const isScannedToday = moment(backgroundScanDate).isSame(moment(), 'day');
    const isTimeToScan = moment().isSameOrAfter(
      moment(backgroundScanTime, TIME_FORMAT),
    );
    const isAuto = backgroundScanMode === BACKGROUND_SCAN_MODE.AUTO;

    if (isAuto && (isScannedToday || !isTimeToScan)) return;
  } catch (error) {
    sendError({
      title: 'job',
      message: error.message,
    });
  }
};

export const initBackgroundJob = async () => {
  try {
    await BackgroundJob.register({
      jobKey: JOB_UPDATE_RANKS,
      job,
    });

    await BackgroundJob.schedule({
      jobKey: JOB_UPDATE_RANKS,
      // period: MS_MINUTE * 15,
      // period: MS_MINUTE * 2,
      // exact: true,
      timeout: MS_MINUTE * 40,
      allowWhileIdle: true,
      allowExecutionInForeground: true,
      notificationTitle: 'Update Ranks Background Job',
    });

    if (__DEV__) {
      console.info('background job initialized');
    }
  } catch (error) {
    sendError({
      title: 'initBackgroundJob',
      message: error.message,
    });
  }
};
