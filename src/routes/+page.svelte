<script>
  import Navigation from '$lib/Navigation.svelte';
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<Navigation activePage="home" />

<div class="container">
  <h1>Welcome to Bank Statement App</h1>
  <p>This app allows you to view and analyze your bank statements.</p>
  
  <div class="card">
    <h2>View Bank Statement</h2>
    <p>View your February bank statement and analyze transactions.</p>
    <a href="/bank-statement" class="button">Go to Bank Statement</a>
  </div>
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
  
  .card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 2rem;
    margin-top: 2rem;
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
    transition: background-color 0.2s;
  }
  
  .button:hover {
    background-color: #2196f3;
  }
</style>
