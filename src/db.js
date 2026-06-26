import { drizzle } from 'drizzle-orm/libsql'; 
import { createClient } from '@libsql/client';
import { users } from './models/user.js';
import { events } from './models/event.js';
import { registrations } from './models/registration.js';
import { notifications } from './models/notification.js';
import { eventMedia } from './models/eventMedia.js';
import {goal} from './models/goal.js'
import * as relationsSchema from './models/relations.js';

const client = createClient({ url: 'file:sqlite.db' });
export const schema = { 
    users, 
    events, 
    registrations, 
    notifications, 
    eventMedia, 
    goal,
    ...relationsSchema 
};

export const db = drizzle(client, { schema });