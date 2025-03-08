# Bank Statement App

This is a SvelteKit application for importing, viewing, and analyzing bank statements. The application allows you to import bank statement JSON files, view transactions, mark specific transactions, and calculate the sum of marked transactions.

## Features

- Import bank statement JSON files
- View transactions for different account statements
- Mark and unmark transactions
- Calculate the sum of marked transactions

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)

## Getting Started

### Clone the repository

```sh
# Clone the repository
git clone https://github.com/magnus-hansson/bank-statement-app.git
cd bank-statement-app
```

### Install dependencies

```sh
# Install dependencies
pnpm install
```

### Set up the database

Create a `.env` file in the root directory with the following content:

```sh
DATABASE_URL=./local.db
```

Run the database migrations:

```sh
# Run database migrations
pnpm migrate
```

### Run the development server

```sh
# Start the development server
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`.

## Usage

### Importing a Bank Statement

1. Navigate to the "Import Statement" page using the navigation bar.
2. Select a JSON file containing your bank statement data.
3. The file will be uploaded and imported into the database.
4. After a successful import, you will be redirected to the bank statement view.

### Viewing Transactions

1. Navigate to the "Bank Statement" page using the navigation bar.
2. Select the desired account statement period from the dropdown.
3. View the transactions for the selected period.

### Marking Transactions

1. Click on a transaction row to mark or unmark it.
2. The total sum of marked transactions will be displayed at the top.

## Project Structure

- `src/`: Source code for the SvelteKit application
  - `lib/`: Shared components and utilities
  - `routes/`: SvelteKit routes
  - `server/`: Server-side code, including database setup and migrations
- `static/`: Static assets
- `drizzle/`: Database migration files
- `.env`: Environment variables
- `package.json`: Project configuration and dependencies

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
