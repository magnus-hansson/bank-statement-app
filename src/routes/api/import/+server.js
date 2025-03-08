import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { accounts, accountStatements, transactions } from '$lib/server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

const childrenNames = env.CHILDREN_NAMES.split(',');

export async function POST({ request }) {
    try {
        const data = await request.json();
        const importDate = new Date().toISOString();

        // Begin transaction for data integrity
        await db.transaction(async (tx) => {
            // Process accounts
            for (const account of data.accounts) {
                const accountId = uuidv4();
                
                await tx.insert(accounts).values({
                    id: accountId,
                    chosenName: account.chosenName || '',
                    accountHolder: account.accountHolder || '',
                    accountForm: account.accountForm || '',
                    accountName: account.accountName || '',
                    accountNumber: account.accountNumber || '',
                    system: account.system || '',
                    status: account.status || '',
                    importDate
                }).onConflictDoNothing();
            }

            // Find the account for this statement
            const accountNumber = data.accountInformation?.accountNumber;
            const existingAccount = await tx.select().from(accounts)
                .where(sql`${accounts.accountNumber} = ${accountNumber}`).get();
            
            const accountId = existingAccount?.id || uuidv4();

            // Create account statement record
            const statementId = uuidv4();
            await tx.insert(accountStatements).values({
                id: statementId,
                accountId,
                dateFrom: data.dateFrom || '',
                dateTo: data.dateTo || '',
                customerName: data.customerName || '',
                bookBalance: parseFloat(data.accountInformation?.bookBalance || '0'),
                clearingNumber: data.accountInformation?.clearingNumber || '',
                amountOfTransactions: parseInt(data.accountInformation?.amountOfTransactions || '0', 10),
                importDate
            });

            // Process transactions
            if (data.inlaAccountTransactions && Array.isArray(data.inlaAccountTransactions)) {
                for (const tx_data of data.inlaAccountTransactions) {
                    // Use eventTime as a unique identifier (with slight modification for uniqueness)
                    const txId = tx_data.eventTime + '-' + uuidv4().substring(0, 8);
                    const isMarked = childrenNames.includes(tx_data.transactionText) && parseFloat(tx_data.transactionAmount) < 0 ? 1 : 0;
                    
                    await tx.insert(transactions).values({
                        id: txId,
                        accountStatementId: statementId,
                        transactionText: tx_data.transactionText || '',
                        transactionDate: tx_data.transactionDate || '',
                        ledgerDate: tx_data.ledgerDate || '',
                        transactionAmount: parseFloat(tx_data.transactionAmount || '0'),
                        systemName: tx_data.systemName || '',
                        serialNumber: tx_data.serialNumber || '',
                        bankgiroPlusgiroNumber: tx_data.bankgiroPlusgiroNumber || '',
                        eventTime: tx_data.eventTime || '',
                        isMarked,
                        importDate
                    });
                }
            }
        });

        return json({ success: true, message: 'Bank statement imported successfully' });
    } catch (error) {
        console.error('Error importing bank statement:', error);
        return json({ success: false, message: error.message }, { status: 500 });
    }
}