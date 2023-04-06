import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import Guid from './Guid';

const NotificationService = async (navigation) => {
    let token = await AsyncStorage.getItem("userToken")
    let check = await AsyncStorage.getItem("DeviceToken")
    if (!check) {
        let DeviceToken = await messaging().getToken();
        if (DeviceToken) {
            await AsyncStorage.setItem("DeviceToken", DeviceToken)
        }
    }

    await messaging().onMessage(async notification => {
        await Guid().then(channelId => {
            PushNotification.createChannel({
                channelId: channelId, // (required)
                channelName: channelId, // (required)
            })
            PushNotification.localNotification({
                channelId: channelId,
                title: notification.notification.title,
                message: notification.notification.body,
                data: notification.data,
            })
        })
    });
    await messaging().onNotificationOpenedApp(notification => {
        let screen = '';
        let id = '';
        let date = '';
        if (notification.data.screen) {
            screen = notification.data.screen
        }
        if (notification.data.id) {
            id = notification.data.id
        }
        if (notification.data.date) {
            date = notification.data.date
        }
        if (screen && navigation) {
            navigation.navigate(screen, { id: id, date: date ? date : null })
        }
    });

    PushNotification.configure({
        onNotification: ((notification) => {
            if (notification.data.screen && notification.userInteraction && token) {
                let screen = '';
                let id = '';
                let date = '';
                if (notification.data.screen) {
                    screen = notification.data.screen
                }
                if (notification.data.id) {
                    id = notification.data.id
                }
                if (notification.data.date) {
                    date = notification.data.date
                }
                if (screen && navigation) {
                    navigation.navigate(screen, { id: id, date: date ? date : null })
                }
            }
        })
    });
}

export default NotificationService