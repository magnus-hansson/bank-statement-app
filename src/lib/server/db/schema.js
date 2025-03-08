import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';

// Keep existing user table
export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});

// Add account information table
export const accounts = sqliteTable('accounts', {
    id: text('id').primaryKey(),
    chosenName: text('chosen_name'),
    accountHolder: text('account_holder'),
    accountForm: text('account_form'),
    accountName: text('account_name'),
    accountNumber: text('account_number'),
    system: text('system'),
    status: text('status'),
    importDate: text('import_date')
});

// Add account statement information table
export const accountStatements = sqliteTable('account_statements', {
    id: text('id').primaryKey(),
    accountId: text('account_id').references(() => accounts.id),
    dateFrom: text('date_from'),
    dateTo: text('date_to'),
    customerName: text('customer_name'),
    bookBalance: real('book_balance'),
    clearingNumber: text('clearing_number'),
    amountOfTransactions: integer('amount_of_transactions'),
    importDate: text('import_date')
});

// Add transactions table with marking capability
export const transactions = sqliteTable('transactions', {
    id: text('id').primaryKey(), // Using eventTime as unique identifier
    accountStatementId: text('account_statement_id').references(() => accountStatements.id),
    transactionText: text('transaction_text'),
    transactionDate: text('transaction_date'),
    ledgerDate: text('ledger_date'),
    transactionAmount: real('transaction_amount'),
    systemName: text('system_name'),
    serialNumber: text('serial_number'),
    bankgiroPlusgiroNumber: text('bankgiro_plusgiro_number'),
    eventTime: text('event_time'),
    isMarked: integer('is_marked').default(0), // 0=false, 1=true
    category: text('category'), // For future categorization feature
    notes: text('notes'), // For future note-taking feature
    importDate: text('import_date')
});
