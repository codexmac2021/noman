# SEHA Hospital Room Tracker

A real-time hospital room management system built with React and Firebase Firestore. This application allows hospital staff to monitor and update room statuses across multiple wards in real-time.

## Features

### 🏥 Ward Management
- Display all hospital wards with custom medical icons
- Real-time room status counts (Available, For Cleaning, Occupied)
- Quick navigation to individual ward rooms

### 🛏️ Room Management  
- View all rooms in a selected ward
- Update room status with a simple dropdown
- Real-time synchronization across all devices
- Color-coded status indicators

### 🎛️ Controls
- **Back Button**: Navigate from rooms back to ward overview
- **Clear All Button**: Reset all rooms in a ward to "Available" status

### 🎨 Design
- Clean, hospital-friendly interface
- Responsive design for desktop, tablet, and mobile
- Smooth animations and transitions
- SEHA branding colors

## Tech Stack

- **Frontend**: React with Hooks
- **Database**: Firebase Firestore (real-time)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Heroicons v2)

## Setup Instructions

### 1. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Get your Firebase config from Project Settings
4. Replace the config in `src/firebase/config.js`

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

## Firestore Database Structure

```
wards/
  WARD-1/
    name: "Emergency Ward"
    icon: "HiHeart"
    rooms/
      room-001/
        status: "available"
      room-002/
        status: "occupied"
      ...
  WARD-2/
    ...
```

## Ward IDs
The system includes the following ward document IDs:
- `WARD-1` through `WARD-9`
- `WARD-11` through `WARD-13`

## Room Status Options
- **Available**: Room is ready for new patients (Green)
- **For Cleaning**: Room needs housekeeping (Yellow)  
- **Occupied**: Room has a patient (Red)

## Security Rules
Make sure to configure Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wards/{wardId} {
      allow read, write: if true; // Configure based on your auth requirements
      match /rooms/{roomId} {
        allow read, write: if true;
      }
    }
  }
}
```

## Deployment
This app can be deployed to any static hosting service:
- Firebase Hosting
- Netlify  
- Vercel
- GitHub Pages

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.