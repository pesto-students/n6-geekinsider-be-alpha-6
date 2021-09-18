import { Router } from 'express';
import user from './routes/user';
import job from './routes/job';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	user(app);
	job(app);
	return app
}