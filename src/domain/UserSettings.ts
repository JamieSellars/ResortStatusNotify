import { LiftSubscription } from './LiftSubscription';

export interface UserSettings
{
    displayName?: string,
    fcmTokens?: any[],
    subscriptions?: LiftSubscription[]
}