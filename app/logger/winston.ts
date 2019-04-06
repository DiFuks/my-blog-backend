import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { AppEnvironment } from '@enum/AppEnvironment';

const transportsArray: Array<any> = [
    new DailyRotateFile({
        filename: 'cc-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m',
        maxFiles: '7d',
        dirname: process.env.LOGS_PATH
    })
];

if (process.env.NODE_ENV === AppEnvironment.DEVELOPMENT) {
    transportsArray.push(new transports.Console())
}

export const winstonLogger = createLogger({
    format: format.printf(info => info.message),
    transports: transportsArray
});
