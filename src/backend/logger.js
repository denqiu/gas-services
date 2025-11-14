import pino from 'pino';
import pinoPretty from 'pino-pretty';
import pinoRoll from 'pino-roll';
import pinoTest from 'pino-test';
import envVar from 'env-var';
import fs from 'fs';

const testStream = pinoTest.sink();
const nestedKey = 'data';

let filename;
if (envVar.get("TEST_LOGGER_ONLY").asBool()) {
	filename = 'test-pino';
	if (!envVar.get("IS_TEST_LOGGER_CLEARED").asBool() && fs.existsSync(`${import.meta.dirname}/logs/${filename}.log`)) {
		// logger.js is called multiple times so we want to clear test log on first call.
		fs.unlinkSync(`${import.meta.dirname}/logs/${filename}.log`);
		process.env.IS_TEST_LOGGER_CLEARED = 'true';
	}
} else {
	filename = 'pino';
}

let pinoLogger = pino({
	hooks: {
		/**
		 * Logging process:
		 * 1. If local log all levels.
		 * 2. If ci/cd, disable levels - info and debug - and log the other levels, including error, warning.
		 * 3. TODO: For database, setup docker and log all levels to mariadb.
		 */
		logMethod(args, method, level) {
			if (!process.env.GITHUB_ACTIONS) {
				// Enable all log levels in local.
				return method.apply(this, args);
			}
			// In ci/cd, disable levels info and debug.
			const levelLabel = pino.levels.labels[level];
			if (['info', 'debug'].includes(levelLabel)) {
				// Equivalent to switching log level to 'silent'.
				return;
			}
			// Enable the other levels, keep as is: error, warning.
			return method.apply(this, args);
		}
	},
	base: null, // Remove pid and hostname.
	nestedKey: nestedKey,
	formatters: {
		level: (label) => {
			// Observed pinoPretty.levelFirst not working with severity key { severity: label.toUpperCase() }. Using level key works. Now console is prettified and file logs have level key with uppercased label.
			return { level: label.toUpperCase() };
		},
	},
	// mixin(_context, level) {
	// 	// Shows up inside nested key. Don't want that.
	// 	return { 'level-label': pino.levels.labels[level] }
	// },
	timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
},
	// pino.transport({
	// 	targets: [
	// 		{
	// 			target: 'pino-pretty',
	// 			options: {
	// 				colorize: true,
	// 				levelFirst: true,
	// 				translateTime: 'yyyy-mm-dd HH:MM:ss'
	// 			}
	// 		}
	// 	]
	// })
	pino.multistream([
		// { stream: pino.transport({
		// 	target: 'pino/file',
		// 	options: {
		// 		destination: `${import.meta.dirname}/logs/${filename}.log`,
		// 		mkdir: true,
		// 	},
		// })}, 
		// { stream: pino.transport({
		// 	target: 'pino-pretty',
		// 	options: {
		// 		colorize: true,
		// 		levelFirst: true,
		// 		translateTime: 'yyyy-mm-dd HH:MM:ss',
		// 	},
		// })},
		// { stream: pino.transport({
		// 	target: 'pino-roll',
		// 	options: {
		// 		file: `${import.meta.dirname}/logs/${filename}.log`,
		// 		// dateFormat: 'yyyy-mm-dd HH:MM:ss',
		// 		mkdir: true,
		// 		sync: false,
		// 	},
		// })},
		// { stream: pinoRoll({
		// 		// Without SonicBoom, got error: stream.write is not a function. With SonicBoom, got error: stream object needs to implement either StreamEntry or DestinationStream interface.
		// 		file: `${import.meta.dirname}/logs/${filename}.log`,
		// 		// dateFormat: 'yyyy-mm-dd HH:MM:ss',
		// 		mkdir: true,
		// 	})},
		{ stream: pino.destination({
			dest: `${import.meta.dirname}/logs/${filename}.log`,
			mkdir: true,
		})},
		{ stream: pinoPretty({
			colorize: true,
			levelFirst: true,
			translateTime: 'yyyy-mm-dd HH:MM:ss',
		})},
		{ stream: testStream },
	])
);

/**
 * Answered June 10, 2024. See https://stackoverflow.com/a/78604069
 */
const DDoSedAnswer = () => {
	return pino({
		// does not work with multiple targets
		// formatters: {
		//   level: (label) => {
		//     return { level: label };
		//   },
		// },

		// available workaraund
		mixin(_context, level) {
			return { 'level-label': pino.levels.labels[level] }
		},

		transport: {
			targets: [
				{
					target: "pino/file",
					options: { destination: `${import.meta.dirname}/logs/pino.log` },
				},
				{
					target: "pino-pretty",
					options: {
						colorize: true,
						ignore: 'pid,hostname,level-label'
					},
				}
			],
		},
		timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
	});
}

/**
 * Answered November 19, 2024. See https://stackoverflow.com/a/78604069
 * 
 * Destination works. Transport is not working: Logs are not printed to console.
 */
const RicardoAlvarezAnswer = () => {
	// Create a destination for the log file
	const logFileDestination = pino.destination({
		dest: `${import.meta.dirname}/logs/pino.log`, // Path to the log file
		sync: false, // Asynchronous logging for better performance
	});

	// Create a transport for pretty console logging
	const prettyConsoleTransport = pino.transport({
		target: 'pino-pretty',
		options: {
			colorize: true, // Enable colors in the console
			translateTime: 'dd/mm/yyyy HH:MM:ss', // Format timestamps
			ignore: 'pid,hostname', // Remove unnecessary fields from the output
		},
	});

	return pino(
		{
			level: 'debug', // Adjust the logging level as needed   
			formatters: {
				level(label) {
					return { severity: label };
				},   
			},
			timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
		},  
		pino.multistream([
			{ stream: prettyConsoleTransport, level:'debug' }, // Logs to the console
			{ stream: logFileDestination, level:'debug' }, // Logs to the file
		])
	);
}

// pinoLogger = DDoSedAnswer();
// pinoLogger = RicardoAlvarezAnswer();

export default pinoLogger;
export { nestedKey, pinoTest, testStream };