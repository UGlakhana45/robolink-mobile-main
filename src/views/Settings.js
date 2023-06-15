import React, {useState, useEffect} from 'react';
import {
  Content,
  List,
  ListItem,
  Text,
  Body,
  Right,
  Switch,
  Icon,
  Picker,
} from 'native-base';
import RNDisableBatteryOptimizationsAndroid from 'react-native-disable-battery-optimizations-android';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {Alert} from 'react-native';
import {compose} from 'redux';
import {useTranslation} from 'react-i18next';
import colors from '../styles/colors';
import withSettings from '../redux/hoc/withSettings';
import withAuth from '../redux/hoc/withAuth';
import {DAY_HOURS, TIME_FORMAT} from '../constants/moment';
import STORAGE_KEYS from '../constants/storage';
import languages from '../languages';
import {isAndroid} from '../utils/global';
import AppWrapper from '../components/AppWrapper';
import overrides from '../styles/overrides';
import {getLocalMoment, getUTCMoment} from '../utils/moment';

function Settings({settings, settingsActions, authActions}) {
  settings = settings.data;
  const [isNotificationsEnabled, setNotificationComplete] = useState(
    settings.isNotificationsEnabled,
  );
  const [isEmailWeeklySummaryEnabled, setEmailWeeklySummaryEnabled] = useState(
    settings.isEmailWeeklySummaryEnabled,
  );
  const [isBatteryOptimization, setBackground] = useState(true);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    handleNativeOptimization();
  }, [handleNativeOptimization]);

  const handleNativeOptimization = () => {
    if (isAndroid) {
      RNDisableBatteryOptimizationsAndroid.isBatteryOptimizationEnabled().then(
        isEnabled => {
          setBackground(isEnabled);
          if (settings.isBackgroundScanEnabled !== isEnabled) {
            settingsActions.updateSettings({
              isBackgroundScanEnabled: !isEnabled,
            });
          }
        },
      );
    }
  };

  const handleBackgroundChange = async () => {
    await RNDisableBatteryOptimizationsAndroid.enableBackgroundServicesDialogue();
    setTimeout(() => {
      handleNativeOptimization();
    }, 1000);
  };

  const handleNotificationChange = isNotificationsEnabled => {
    setNotificationComplete(isNotificationsEnabled);
    settingsActions.updateSettings({isNotificationsEnabled});
  };

  const handleWeeklySummaryEmailChange = isEmailWeeklySummaryEnabled => {
    setEmailWeeklySummaryEnabled(isEmailWeeklySummaryEnabled);
    settingsActions.updateSettings({isEmailWeeklySummaryEnabled});
  };

  const hanldeScheduleBackgroundChange = async backgroundScanTime => {
    backgroundScanTime = getUTCMoment(backgroundScanTime, TIME_FORMAT);
    settingsActions.updateSettings({backgroundScanTime});
  };

  const restartApp = async () => {
    RNRestart.Restart();
  };

  const handleLanguageChange = async language => {
    settingsActions.updateSettings({language});
    await AsyncStorage.setItem(STORAGE_KEYS.APP_LANGUAGE, language);
    restartApp();
  };

  const handleMaxScanRanksChange = scanMaxRank => {
    settingsActions.updateSettings({scanMaxRank: Number(scanMaxRank)});
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('Delete Account'), t('Do you want to delete your account?'), [
      {
        text: t('Cancel'),
        style: 'cancel',
      },
      {
        text: t('Yes'),
        onPress: () => authActions.deleteAccount(),
      },
    ]);
  };

  return (
    <AppWrapper>
      <Content>
        <List>
          <ListItem first>
            <Icon name="notifications-outline" />
            <Body>
              <Text style={{textAlign: 'left'}}>{t('Notifications')}</Text>
              <Text note numberOfLines={2}>
                {t('when the rank update is complete')}
              </Text>
            </Body>
            <Right>
              <Switch
                thumbColor={colors.primary}
                onValueChange={handleNotificationChange}
                value={isNotificationsEnabled}
              />
            </Right>
          </ListItem>
          <ListItem first>
            <Icon name="document-text-outline" />
            <Body>
              <Text style={{textAlign: 'left'}}>
                {t('Weekly summary via email')}
              </Text>
              <Text note numberOfLines={2}>
                {t('every sunday')}
              </Text>
            </Body>
            <Right>
              <Switch
                thumbColor={colors.primary}
                onValueChange={handleWeeklySummaryEmailChange}
                value={isEmailWeeklySummaryEnabled}
              />
            </Right>
          </ListItem>
          {isAndroid && (
            <>
              <ListItem>
                <Icon name="refresh-outline" />
                <Body>
                  <Text>{t('Background automatic rank updates')}</Text>
                  <Text note>{t('Depends on battery optimization')}</Text>
                </Body>
                <Right>
                  <Switch
                    thumbColor={colors.primary}
                    onValueChange={handleBackgroundChange}
                    value={!isBatteryOptimization}
                  />
                </Right>
              </ListItem>
              {!isBatteryOptimization && (
                <ListItem>
                  <Icon name="timer-outline" />
                  <Body>
                    <Text>{t('Schedule automatic updates')}</Text>
                    <Text note>{t('Estimated time')}</Text>
                  </Body>
                  <Right>
                    <Picker
                      style={{width: 121}}
                      mode="dropdown"
                      selectedValue={getLocalMoment(
                        settings.backgroundScanTime,
                        TIME_FORMAT,
                      )}
                      onValueChange={hanldeScheduleBackgroundChange}>
                      {DAY_HOURS.map(hour => (
                        <Picker.Item
                          key={hour}
                          last
                          label={hour}
                          value={hour}
                        />
                      ))}
                    </Picker>
                  </Right>
                </ListItem>
              )}
            </>
          )}
          <ListItem>
            <Icon name="options-outline" />
            <Body>
              <Text style={{textAlign: 'left'}}>
                {t('Max rank to display')}
              </Text>
            </Body>
            <Right>
              <Picker
                mode="dropdown"
                style={{width: 110}}
                selectedValue={settings.scanMaxRank.toString()}
                onValueChange={handleMaxScanRanksChange}
                {...overrides.picker}>
                {['50', '100'].map(item => (
                  <Picker.Item key={item} value={item} label={item} />
                ))}
              </Picker>
            </Right>
          </ListItem>
          <ListItem>
            <Icon name="language-outline" />
            <Body>
              <Text style={{textAlign: 'left'}}>{t('Language')}</Text>
            </Body>
            <Right>
              <Picker
                mode="dropdown"
                style={{width: 132}}
                selectedValue={i18n.language}
                onValueChange={handleLanguageChange}
                {...overrides.picker}>
                {languages.map(language => (
                  <Picker.Item
                    key={language.code}
                    value={language.code}
                    label={language.label}
                  />
                ))}
              </Picker>
            </Right>
          </ListItem>

          <ListItem last onPress={handleDeleteAccount}>
            <Icon name="trash-outline" />
            <Body>
              <Text style={{textAlign: 'left'}}>{t('Delete Account')}</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    </AppWrapper>
  );
}

export default compose(withSettings, withAuth)(Settings);
