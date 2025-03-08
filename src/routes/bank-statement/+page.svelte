<script>
  import { onMount } from 'svelte';
  import Navigation from '$lib/Navigation.svelte';
  
  let bankData = null;
  let transactions = [];
  let selectedTransactions = new Set();
  let selectedTotal = 0;
  let loading = true;
  let error = null;
  let statements = [];
  let selectedStatementId = null;
  
  onMount(async () => {
    await loadStatements();
  });

  async function loadStatements() {
    try {
      const response = await fetch('/api/statements');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load statements');
      }
      
      statements = data.statements;
      if (statements.length > 0) {
        selectedStatementId = statements[0].id;
        await loadTransactions(selectedStatementId);
      }
    } catch (err) {
      error = err.message;
      console.error('Error loading statements:', err);
    }
  }
  
  async function loadTransactions(statementId = null) {
    try {
      loading = true;
      const url = new URL('/api/transactions', window.location.origin);
      if (statementId) {
        url.searchParams.set('statementId', statementId);
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load transactions');
      }
      
      bankData = data;
      transactions = data.transactions;
      
      // Initialize selected transactions from database
      selectedTransactions = new Set(
        transactions
          .filter(tx => tx.isMarked)
          .map(tx => tx.id)
      );
      
      calculateSelectedTotal();
    } catch (err) {
      error = err.message;
      console.error('Error loading transactions:', err);
    } finally {
      loading = false;
    }
  }

  async function handleStatementChange(event) {
    selectedStatementId = event.target.value;
    await loadTransactions(selectedStatementId);
  }
  
  async function toggleTransaction(transaction) {
    const transactionId = transaction.id;
    const isMarked = !selectedTransactions.has(transactionId);
    
    try {
      const response = await fetch('/api/transactions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId,
          isMarked
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      
      if (selectedTransactions.has(transactionId)) {
        selectedTransactions.delete(transactionId);
      } else {
        selectedTransactions.add(transactionId);
      }
      
      // Force Svelte to detect changes to the Set
      selectedTransactions = selectedTransactions;
      
      calculateSelectedTotal();
    } catch (err) {
      console.error('Error updating transaction:', err);
      // TODO: Show error to user
    }
  }
  
  function calculateSelectedTotal() {
    selectedTotal = transactions
      .filter(tx => selectedTransactions.has(tx.id))
      .reduce((total, tx) => total + tx.transactionAmount, 0);
  }
  
  function formatDate(dateString) {
    return dateString;
  }
  
  function formatAmount(amount) {
    return new Intl.NumberFormat('sv-SE', { 
      style: 'currency', 
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(amount);
  }
</script>

<svelte:head>
  <title>Bank Statement</title>
</svelte:head>

<Navigation activePage="bank-statement" />

<div class="container">
  <h1>Bank Statement</h1>
  
  {#if loading && !bankData}
    <div class="loading">Loading transactions...</div>
  {:else if error}
    <div class="error">
      Error: {error}
      <button on:click={() => loadStatements()}>Try Again</button>
    </div>
  {:else if !bankData}
    <div class="empty">
      <p>No bank statements found. Please import a statement first.</p>
      <a href="/import" class="button">Import Statement</a>
    </div>
  {:else}
    <div class="statement-selector">
      <label for="statement">Select Statement Period:</label>
      <select 
        id="statement" 
        value={selectedStatementId} 
        on:change={handleStatementChange}
      >
        {#each statements as statement}
          <option value={statement.id}>
            {formatDate(statement.dateFrom)} - {formatDate(statement.dateTo)} 
            ({statement.accountNumber})
          </option>
        {/each}
      </select>
    </div>

    <div class="account-info">
      <h2>Account Information</h2>
      <div class="info-container">
        <div class="info-item">
          <strong>Account Holder:</strong> {bankData.accountInfo.accountHolder}
        </div>
        <div class="info-item">
          <strong>Account Number:</strong> {bankData.accountInfo.clearingNumber}-{bankData.accountInfo.accountNumber}
        </div>
        <div class="info-item">
          <strong>Balance:</strong> {formatAmount(bankData.accountInfo.bookBalance)}
        </div>
        <div class="info-item">
          <strong>Date Range:</strong> {formatDate(bankData.accountInfo.dateFrom)} - {formatDate(bankData.accountInfo.dateTo)}
        </div>
      </div>
    </div>
    
    <div class="summary-panel">
      <div class="selection-summary">
        <strong>Selected Transactions:</strong> {selectedTransactions.size}
      </div>
      <div class="total-amount {selectedTotal < 0 ? 'negative' : 'positive'}">
        <strong>Total:</strong> {formatAmount(selectedTotal)}
      </div>
    </div>
    
    <div class="transactions">
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {#each transactions as transaction (transaction.id)}
            <tr 
              class={selectedTransactions.has(transaction.id) ? 'selected' : ''}
              on:click={() => toggleTransaction(transaction)}
            >
              <td>{formatDate(transaction.transactionDate)}</td>
              <td>{transaction.transactionText}</td>
              <td class={transaction.transactionAmount < 0 ? 'negative' : 'positive'}>
                {formatAmount(transaction.transactionAmount)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      
      {#if selectedTransactions.size > 0}
        <div class="selected-info">
          <p>Click on rows to select/deselect them and calculate their total.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  h1 {
    margin-bottom: 1rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    font-style: italic;
  }
  
  .account-info {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .info-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  
  .summary-panel {
    display: flex;
    justify-content: space-between;
    background-color: #eef5ff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  thead {
    background-color: #f0f0f0;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th:last-child, td:last-child {
    text-align: right;
  }
  
  tr {
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  tr:hover {
    background-color: #f0f7ff;
  }
  
  tr.selected {
    background-color: #2196f3;
    color: white;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  tr.selected:hover {
    background-color: #1976d2;
  }
  
  tr.selected td.negative,
  tr.selected td.positive {
    color: white;
  }
  
  .negative {
    color: #d32f2f;
  }
  
  .positive {
    color: #388e3c;
  }
  
  .checkbox-cell {
    /* Prevent double click issues with checkbox */
    width: 1%;
  }
  
  .selected-info {
    text-align: center;
    margin-top: 1rem;
    font-style: italic;
    color: #666;
  }
  
  .empty {
    text-align: center;
    padding: 2rem;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  
  .error {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .error button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    background-color: #d32f2f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .button {
    display: inline-block;
    background-color: #42a5f5;
    color: white;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    margin-top: 1rem;
  }

  .statement-selector {
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .statement-selector label {
    font-weight: 500;
    margin-right: 1rem;
  }

  .statement-selector select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    min-width: 300px;
  }

  .statement-selector select:focus {
    outline: none;
    border-color: #42a5f5;
    box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.2);
  }
</style>