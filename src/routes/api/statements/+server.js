import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accountStatements, accounts } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        const statements = await db.select({
            id: accountStatements.id,
            dateFrom: accountStatements.dateFrom,
            dateTo: accountStatements.dateTo,
            customerName: accountStatements.customerName,
            bookBalance: accountStatements.bookBalance,
            importDate: accountStatements.importDate,
            accountHolder: accounts.accountHolder,
            accountNumber: accounts.accountNumber,
            clearingNumber: accountStatements.clearingNumber
        })
        .from(accountStatements)
        .leftJoin(accounts, sql`${accountStatements.accountId} = ${accounts.id}`)
        .orderBy(sql`${accountStatements.importDate} DESC`)
        .all();

        return json({ statements });
    } catch (error) {
        console.error('Error fetching statements:', error);
        return json({ error: 'Failed to fetch statements' }, { status: 500 });
    }
}