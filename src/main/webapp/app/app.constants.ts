// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

export const VERSION = process.env.VERSION;
export const DEBUG_INFO_ENABLED: boolean = !!process.env.DEBUG_INFO_ENABLED;
export const SERVER_API_URL = process.env.SERVER_API_URL;
export const BUILD_TIMESTAMP = process.env.BUILD_TIMESTAMP;
export const CONFIG_FIREBASE = {
    apiKey: 'AIzaSyCOK-SMKubs0NXzrMOQdr-3_cVVga6QW9Y',
    authDomain: 'trebol-e8a5b.firebaseapp.com',
    databaseURL: 'https://trebol-e8a5b.firebaseio.com',
    projectId: 'trebol-e8a5b',
    storageBucket: 'trebol-e8a5b.appspot.com',
    messagingSenderId: '979445030369'
};
