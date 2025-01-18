import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';
import { Match } from '../entities/match.entity';

@Injectable()
export class MatchRepository {
    private readonly collection;

    constructor(@Inject('FIRESTORE') private readonly firestore: Firestore) {
        this.collection = this.firestore.collection('matches');
    }

    async findById(matchId: string): Promise<Match | null> {
        const doc = await this.collection.doc(matchId).get();
        if (!doc.exists) {
            return null;
        }
        return { id: doc.id, ...doc.data() } as Match;
    }

    async findAll(): Promise<Match[]> {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    }

    async findMatchesByUserId(userId: string): Promise<Match[]> {
        const snapshot = await this.collection
            .where('user1Id', '==', userId)
            .get();
        const matchesAsUser1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));

        const reverseSnapshot = await this.collection
            .where('user2Id', '==', userId)
            .get();
        const matchesAsUser2 = reverseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));

        return [...matchesAsUser1, ...matchesAsUser2];
    }

    async saveMatch(match: Partial<Match>): Promise<Match> {
        const docRef = await this.collection.add(match);
        const doc = await docRef.get();
        return { id: doc.id, ...doc.data() } as Match;
    }

    async update(matchId: string, match: Partial<Match>): Promise<Match> {
        const docRef = this.collection.doc(matchId);
        await docRef.update(match);
        const updatedDoc = await docRef.get();
        return { id: updatedDoc.id, ...updatedDoc.data() } as Match;
    }

    async delete(matchId: string): Promise<void> {
        await this.collection.doc(matchId).delete();
    }
}
