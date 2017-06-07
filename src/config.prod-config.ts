/**
 * copy this file to config.ts and adjust values to your needs
 */
export const CONFIG = {
    APP_VERSION: '1.0.3',

    API_URL: 'https://app.shareandcharge.com/v1',
    IMAGES_BASE_URL: 'https://app.shareandcharge.com',

    API_KEY: {
        param: 'apikey',
        name: 'app',
        secret: '{PROD_APP_SECRET}'
    },
    MIXPANEL_TOKEN: '{PROD_APP_MIXPANEL_TOKEN}',
    FAQ_URL: 'https://www.shareandcharge.com/faq/',
    CONTACT_EMAIL: 'info@shareandcharge.com',
    TERMS_APP_URL: 'https://www.shareandcharge.com/app-agbs/',
    TERMS_STATION_URL: 'https://www.shareandcharge.com/ladestation-agbs/',
    DATA_PROTECTION_URL: 'https://www.shareandcharge.com/app-datenschutz/'
};
