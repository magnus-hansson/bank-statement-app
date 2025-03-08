<script>
  import Navigation from '$lib/Navigation.svelte';
  import { goto } from '$app/navigation';

  let fileInput;
  let loading = false;
  let error = null;
  let success = null;

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      error = 'Please select a JSON file';
      return;
    }

    loading = true;
    error = null;
    success = null;

    try {
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to import bank statement');
      }

      success = 'Bank statement imported successfully!';
      // Clear the file input
      fileInput.value = '';
      
      // Navigate to bank statement view after a short delay
      setTimeout(() => {
        goto('/bank-statement');
      }, 2000);

    } catch (err) {
      error = err.message || 'Error importing bank statement';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Import Bank Statement</title>
</svelte:head>

<Navigation activePage="import" />

<div class="container">
  <h1>Import Bank Statement</h1>
  
  <div class="import-section">
    <p class="instructions">
      Select a JSON file containing your bank statement data to import it into the system.
    </p>

    <div class="upload-area">
      <input
        type="file"
        accept=".json"
        on:change={handleFileSelect}
        bind:this={fileInput}
        class="file-input"
        disabled={loading}
      />
      
      {#if loading}
        <div class="status loading">Importing bank statement...</div>
      {/if}
      
      {#if error}
        <div class="status error">{error}</div>
      {/if}
      
      {#if success}
        <div class="status success">{success}</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
  }

  h1 {
    margin-bottom: 2rem;
  }

  .import-section {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 2rem;
  }

  .instructions {
    margin-bottom: 2rem;
    color: #666;
  }

  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .file-input {
    width: 100%;
    max-width: 400px;
    padding: 1rem;
    border: 2px dashed #ccc;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }

  .file-input:hover {
    border-color: #42a5f5;
  }

  .status {
    padding: 1rem;
    border-radius: 4px;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .loading {
    background-color: #e3f2fd;
    color: #1976d2;
  }

  .error {
    background-color: #ffebee;
    color: #d32f2f;
  }

  .success {
    background-color: #e8f5e9;
    color: #388e3c;
  }
</style>