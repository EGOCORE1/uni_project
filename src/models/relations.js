import { relations } from 'drizzle-orm';
import { events } from './event.js';
import { eventMedia } from './eventMedia.js';

export const eventsRelations = relations(events, ({ many }) => ({
    media: many(eventMedia),
}));

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
    event: one(events, {
        fields: [eventMedia.event_Id],
        references: [events.id],
    }),
}));