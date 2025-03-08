import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { transactions, accountStatements, accounts } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function GET({ url }) {
    try {
        // Get query parameters
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '100');
        const offset = (page - 1) * limit;
        const statementId = url.searchParams.get('statementId');

        // Get the requested statement, or latest if none specified
        const statement = statementId 
            ? await db.select().from(accountStatements)
                .where(sql`${accountStatements.id} = ${statementId}`)
                .get()
            : await db.select().from(accountStatements)
                .orderBy(sql`${accountStatements.importDate} DESC`)
                .limit(1)
                .get();

        if (!statement) {
            return json({ transactions: [], accountInfo: null });
        }

        // Get the account info
        const accountInfo = await db.select()
            .from(accounts)
            .where(sql`${accounts.id} = ${statement.accountId}`)
            .get();

        // Get transactions for this statement
        const statementTransactions = await db.select()
            .from(transactions)
            .where(sql`${transactions.accountStatementId} = ${statement.id}`)
            .orderBy(sql`${transactions.transactionDate} DESC`)
            .offset(offset)
            .limit(limit)
            .all();

        return json({
            transactions: statementTransactions,
            accountInfo: {
                ...accountInfo,
                ...statement
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

// API endpoint to toggle transaction marking
export async function PATCH({ request }) {
    try {
        const { transactionId, isMarked } = await request.json();

        await db.update(transactions)
            .set({ isMarked: isMarked ? 1 : 0 })
            .where(sql`${transactions.id} = ${transactionId}`);

        return json({ success: true });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return json({ error: 'Failed to update transaction' }, { status: 500 });
    }
}