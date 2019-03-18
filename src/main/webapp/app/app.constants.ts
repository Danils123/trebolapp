// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED: boolean = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;

export const FirebaseEnvironment = {
    production: false,
    firebase: {
        apiKey: 'AIzaSyDFvFcb9jjVnPynOyRHTz6KZtqoeFobRPo',
        authDomain: 'fotosfirebase-7c318.firebaseapp.com',
        databaseURL: 'https://fotosfirebase-7c318.firebaseio.com',
        projectId: 'fotosfirebase-7c318',
        storageBucket: 'fotosfirebase-7c318.appspot.com',
        messagingSenderId: '1066801680443'
    }
};
