import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// استيراد الجداول
import { users } from './models/user.js';
import { events } from './models/event.js';
import { registrations } from './models/registration.js';
import { notifications } from './models/notification.js';
import { eventMedia } from './models/eventMedia.js';

// استيراد العلاقات من الملف الجديد الذي أنشأتِه
import * as relationsSchema from './models/relations.js';

const client = createClient({ url: 'file:sqlite.db' });

// دمج الجداول مع العلاقات في كائن الـ schema
export const schema = { 
    users, 
    events, 
    registrations, 
    notifications, 
    eventMedia, 
    ...relationsSchema 
};

export const db = drizzle(client, { schema });