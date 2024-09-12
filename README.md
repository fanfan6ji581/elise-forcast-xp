# My Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Firebase Configuration Setup

This project uses Firebase for database and analytics. To run this project locally, you’ll need to set up Firebase and provide your project-specific configuration.

### Steps to Set Up Firebase

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click on **Add Project**.
   - Name your project, accept the Firebase terms, and click **Continue**.
   - You can enable or skip Google Analytics setup, depending on your preference.
   - Click **Create Project** and wait for it to be created.

2. **Add Firebase to your Web App**:
   - After your project is created, in the Firebase Console, go to **Project Settings** (click the gear icon next to your project name).
   - In the **Your apps** section, click the **</> (Web)** icon to register your web app.
   - Follow the steps to name your app and choose whether or not to set up Firebase Hosting. Then click **Register App**.
   - After registering the app, Firebase will show you the configuration details (API key, project ID, etc.).

3. **Install Firebase SDK**:
   - In your project directory, run:

     ```bash
     npm install firebase
     ```

4. **Configure Firebase**:
   - Find the `firebaseConfig` object in the Firebase Console, which includes properties like `apiKey`, `authDomain`, `projectId`, and more.
   - Copy this configuration.

5. **Replace Configuration in Code**:
   - In this project, rename the `firebase.sample.js` file to `firebase.js`.
   - Replace the placeholders in `firebaseConfig` with the configuration values you copied from the Firebase Console.
 ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };
```

6. **Run the Project**:
   - After configuring Firebase, you should be able to run the project normally.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
