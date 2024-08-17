import { getClient } from '@faustjs/core';
import config from './faust.config'; // 引入配置文件

export const client = getClient(config);
