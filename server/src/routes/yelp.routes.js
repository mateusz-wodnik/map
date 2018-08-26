import { Router } from 'express';
import * as YelpController from '../controllers/yelp.controller';

const router = new Router();

// Get all Posts
router.route('/:query').get(YelpController.getCompanies);

export default router;
