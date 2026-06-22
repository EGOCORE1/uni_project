import { relations } from 'drizzle-orm';
import { events } from './event.js';
import { eventMedia } from './eventMedia.js';
export const eventRelation =relations(events,({ many })=> ({media : many(eventMedia)}))
export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
    event: one(events, {
        fields: [eventMedia.event_id], 
        references: [events.id],
    }),
}));