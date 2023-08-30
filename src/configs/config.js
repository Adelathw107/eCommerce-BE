const config = {

    logger: {
        serviceName: process.env.SERVICE_NAME
    },
    i18n: {
        enable: process.env.I18N_ENABLE,
        locales: ['en', 'vi'],
        defaultLocale: process.env.LOCALE_DEFAULT,
        folderPath: ''
    },

};

module.exports = config;