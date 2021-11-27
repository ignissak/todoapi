import feathers from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import "reflect-metadata";
import { Connection } from 'typeorm';
import authentication from './authentication';
import services from './services';
import { Application } from './declarations';
import configuration from '@feathersjs/configuration';

export class App {

	private static connection: Connection;
	public express: Application;

	public static getConnection(): Connection {
		return this.connection;
	}

	constructor(conn: Connection) {
		App.connection = conn;
		this.express = express(feathers());
		this.setup();
	}

	private setup(): void {
		this.express.configure(configuration());
		// Express middleware to parse HTTP JSON bodies
		this.express.use(express.json());
		// Express middleware to parse URL-encoded params
		this.express.use(express.urlencoded({ extended: true }));
		// Express middleware to to host static files from the current folder
		this.express.use(express.static(__dirname));
		// Add REST API support
		this.express.configure(express.rest());
		// Configure Socket.io real-time APIs
		this.express.configure(socketio());
		// Express middleware with a nicer error handler
		this.express.use(express.errorHandler());

		//this.express.configure(authentication);

		this.express.configure(services);

		// Add any new real-time connection to the `everybody` channel
		this.express.on('connection', connection =>
			this.express.channel('everybody').join(connection)
		);
		// Publish all events to the `everybody` channel
		this.express.publish(data => this.express.channel('everybody'));

		// Start the server
		this.express.listen(3030).on('listening', () =>
			console.log('Feathers server listening on localhost:3030')
		);

	}


}
