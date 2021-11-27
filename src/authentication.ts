import { Application } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';

export default (app: Application) => {
	const authService = new AuthenticationService(app);

	authService.register('jwt', new JWTStrategy());
	authService.register('local', new LocalStrategy());

	app.use('/authentication', authService);
}
