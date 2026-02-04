import { Expo } from 'expo-server-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const expo = new Expo();

/**
 * Send push notifications to a list of tokens.
 * @param {string[]} tokens - Array of Expo Push Tokens
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data
 */
export const sendPushNotifications = async (tokens, title, body, data = {}) => {
    const messages = [];

    for (const token of tokens) {
        if (!Expo.isExpoPushToken(token)) {
            console.error(`Push token ${token} is not a valid Expo push token`);
            continue;
        }

        messages.push({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data,
            priority: 'high',
            channelId: 'default',
        });
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log('Tickets:', ticketChunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error sending chunks:', error);
        }
    }

    return tickets;
};

/**
 * Send a notification to all users in a specific neighborhood, excluding the sender.
 * @param {number} vecindarioId - The neighborhood ID
 * @param {number} senderInfo - The sender's info (to exclude)
 * @param {string} title 
 * @param {string} body 
 * @param {object} data 
 */
export const sendToNeighborhood = async (vecindarioId, senderInfo, title, body, data = {}) => {
    try {
        const senderId = senderInfo.usuarioId;

        // Find all users in the neighborhood who have a push token
        console.log(`Searching for users in vecindarioId: ${vecindarioId}, excluding sender: ${senderId}`);

        const users = await prisma.usuario.findMany({
            where: {
                vecindarioId: parseInt(vecindarioId),
                NOT: {
                    usuarioId: parseInt(senderId) // Exclude sender
                },
                pushToken: {
                    not: null // Only users with tokens
                }
            },
            select: {
                pushToken: true,
                usuarioId: true, // Log who we found
                vecindarioId: true
            }
        });

        console.log(`Found ${users.length} eligible users for push notification.`);
        if (users.length > 0) {
            console.log(`User IDs: ${users.map(u => u.usuarioId).join(', ')}`);
        }

        const tokens = users.map(u => u.pushToken).filter(t => t); // Ensure no nulls/undefined based on query but safety check

        if (tokens.length === 0) {
            console.log('No push tokens found for this neighborhood check.');
            return;
        }

        console.log(`Sending push notification to ${tokens.length} users in vecindario ${vecindarioId}`);

        await sendPushNotifications(tokens, title, body, data);

    } catch (error) {
        console.error('Error in sendToNeighborhood:', error);
    }
};
