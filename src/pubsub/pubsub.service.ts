import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

export enum PubsubEvents {
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
}

@Injectable()
export class PubsubService {
  private pubsub: PubSub;

  constructor() {
    this.pubsub = new PubSub();
  }

  /**
   * Returns an async iterator for the given trigger, used in @Subscription() resolvers.
   */
  asyncIterator(trigger: string) {
    return this.pubsub.asyncIterator(trigger);
  }

  /**
   * Publishes a payload to a trigger, used to notify subscribers of events.
   */
  publish(trigger: string, payload: any): Promise<void> {
    return this.pubsub.publish(trigger, payload);
  }
}
