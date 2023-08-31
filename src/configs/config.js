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
    task: {
        enable: process.env.TASK_ENABLE
    },
    nodeMailer: {
        enable: process.env.MAILER_ENABLE,
        USER_MAILER: process.env.USER_MAILER,
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        REDIRECT_URI: process.env.REDIRECT_URI,
        REFRESH_TOKEN: process.env.REFRESH_TOKEN
    }
};

module.exports = config;