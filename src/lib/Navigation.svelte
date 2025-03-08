<script>
  export let activePage = '';
</script>

<nav class="navigation">
  <ul>
    <li class={activePage === 'home' ? 'active' : ''}>
      <a href="/">Home</a>
    </li>
    <li class={activePage === 'bank-statement' ? 'active' : ''}>
      <a href="/bank-statement">Bank Statement</a>
    </li>
    <li class={activePage === 'import' ? 'active' : ''}>
      <a href="/import">Import Statement</a>
    </li>
  </ul>
</nav>

<style>
  .navigation {
    background-color: #333;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  li {
    padding: 0 1rem;
  }
  
  a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    display: block;
    transition: color 0.2s;
  }
  
  a:hover {
    color: #42a5f5;
  }
  
  .active a {
    color: #42a5f5;
    border-bottom: 2px solid #42a5f5;
  }
</style>