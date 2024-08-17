import { getClient } from '@faustjs/next';
import config from './faust.config';

export const client = getClient(config);
