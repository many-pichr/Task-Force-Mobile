import {
    check,
    request,
    RESULTS,
    requestMultiple,
    PERMISSIONS
} from 'react-native-permissions';
import { Platform, Alert, Linking } from 'react-native';

const camera=
    Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA]
        : [PERMISSIONS.ANDROID.CAMERA];
const faceID=
    Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.FACE_ID]
        : '';
const permissions ={camera,faceID};
// Requesting for the Microphone permission
export async function checkForPermissions(promp,type) {

    // Call our permission service and check for permissions
    const isPermissionGranted = await checkMultiplePermissions(permissions[type]);
    if (!isPermissionGranted&&promp) {
      // Show an alert in case permission was not granted
      Alert.alert(
        'Permission Request',
        'Please allow permissions required',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
    return isPermissionGranted;
  }
// This function can be used anywhere as it supports multiple permissions.
// It checks for permissions and then requests for it.
export async function checkMultiplePermissions(permissions) {
    let isPermissionGranted = false;
    const statuses = await requestMultiple(permissions);
    for (var index in permissions) {
        if (statuses[permissions[index]] === RESULTS.GRANTED) {
            isPermissionGranted = true;
        } else {
            isPermissionGranted = false;
            break;
        }
    }
    return isPermissionGranted;
}

// In case you want to check a single permission
export async function checkPermission(permission) {
    var isPermissionGranted = false;
    const result = await check(permission);
    switch (result) {
        case RESULTS.GRANTED:
            isPermissionGranted = true;
            break;
        case RESULTS.DENIED:
            isPermissionGranted = false;
            break;
        case RESULTS.BLOCKED:
            isPermissionGranted = false;
            break;
        case RESULTS.UNAVAILABLE:
            isPermissionGranted = false;
            break;
    }
    return isPermissionGranted;
}
