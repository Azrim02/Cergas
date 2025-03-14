# Cergas App

A **React Native** app built with **Expo** to help workplace users track fitness and encourage physical activity. This app is designed for Android devices only and integrates with Firebase Authentication and Health Connect to track health data.


## Prerequisites
In your Android device,
- Ensure you have **Health Connect** installed.
  - You can sync data from health tracking services (e.g. Google Fit, FitBit) through it.
- Enable location and health permissions.
- Allow app's background processes to run.


## Implemented Features
- Workplace check-in & check-out
- Background location tracking (GPS-based, no Wi-Fi validation)
- Track daily steps using Health Connect
- Monitor resting heart rate using Health Connect
- Firebase authentication for user login
- Daily reports of user activity


## 🚀 Features yet to be implemented
- Social features
- Leaderboards
- Health metric goals
- Additional trackable health data
- Workplace team challenges
- Integration with workplace productivity tools (e.g., Slack, Microsoft Teams)
- Usable in iOS devices (Constrained by Apple's requirement for developer account)


## 📦 Installation for Development Builds

### Download the development build profile here

[Download Dev Builds](https://drive.google.com/file/d/12oNNIhSFB5vNcJ5RC1-bfqlxXixl6bHz/view?usp=sharing)

![QR Code](qr_dev_build.png)

### Clone to execute development build

```sh
git clone https://github.com/Azrim02/Cergas.git
cd Cergas
npm install
npm expo start
```
Ensure **Node.js** and **Expo CLI** are installed on your machine.

## Use the Cergas App Now!
You can download the apk file directly and use it on your android device on the go! 

[Download APK](https://drive.google.com/file/d/12vf6G50sIm00W8MhzuXa7nNvoZjnQ-aN/view?usp=sharing)

![QR Code](qr_download.jpg)

This is the preview version of the app, but all currently implemented functionalities should be working fully as intended.

## Technical Details
- **Platform**: Android only
- **Authentication**: Firebase Authentication
- **Health Data**: Uses Health Connect API (Google)
- **Location Tracking**: GPS-based workplace validation (No Wi-Fi used)
- **Database**: Firebase Firestore for user data storage

## Tech Stack Used
- React Native with Expo Managed Workflow
- Firebase Authentication for user login
- Google Health Connect API for step and heart rate tracking
- Firestore for storing user health data and workplace details
- Expo Location API for GPS-based workplace validation

## Usage Notes
- The app is designed exclusively for Android devices.
- Uses Health Connect due to restrictions on accessing HealthKit API.
- Does not use Wi-Fi for location validation, relying solely on GPS.
- Users must grant Health Connect permissions to enable step and heart rate tracking.
- For any issues or feature requests, feel free to contribute or report them on the repository.
- Ensure to set your workplace details in the Workplace Details page, which is accessible through the profile tab after authenticated.
