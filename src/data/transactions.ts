export type TransactionType = 'income' | 'expense'

export type TransactionCategory =
  | 'Salary'
  | 'Food'
  | 'Shopping'
  | 'Groceries'
  | 'Rent'
  | 'Utilities'
  | 'Travel'
  | 'Health'
  | 'Education'
  | 'Entertainment'
  | 'Subscriptions'
  | 'Transport'
  | 'Freelance'
  | 'Investments'
  | 'Other'

export type Transaction = {
  id: string
  date: string // ISO date (YYYY-MM-DD)
  amount: number // always a positive number; sign is determined by `type`
  category: TransactionCategory
  type: TransactionType
}

export const transactions: Transaction[] = [
  {
    id: 'txn_2026_03_001',
    date: '2026-03-31',
    amount: 4200,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 'txn_2026_03_002',
    date: '2026-03-30',
    amount: 185.42,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_003',
    date: '2026-03-29',
    amount: 64.75,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_004',
    date: '2026-03-28',
    amount: 129.99,
    category: 'Subscriptions',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_005',
    date: '2026-03-27',
    amount: 73.5,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_006',
    date: '2026-03-26',
    amount: 2500,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: 'txn_2026_03_007',
    date: '2026-03-25',
    amount: 980,
    category: 'Rent',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_008',
    date: '2026-03-24',
    amount: 112.3,
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_009',
    date: '2026-03-23',
    amount: 149.0,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_010',
    date: '2026-03-22',
    amount: 26.5,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_011',
    date: '2026-03-21',
    amount: 90.25,
    category: 'Health',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_012',
    date: '2026-03-20',
    amount: 620,
    category: 'Investments',
    type: 'income',
  },
  {
    id: 'txn_2026_03_013',
    date: '2026-03-19',
    amount: 155.75,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_014',
    date: '2026-03-18',
    amount: 58.99,
    category: 'Education',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_015',
    date: '2026-03-17',
    amount: 230,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_016',
    date: '2026-03-16',
    amount: 64.0,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_017',
    date: '2026-03-15',
    amount: 180,
    category: 'Travel',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_018',
    date: '2026-03-14',
    amount: 75.2,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_019',
    date: '2026-03-13',
    amount: 4200,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 'txn_2026_03_020',
    date: '2026-03-12',
    amount: 99.99,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_021',
    date: '2026-03-11',
    amount: 34.5,
    category: 'Food',
    type: 'expense',
  },
  {
    id: 'txn_2026_03_022',
    date: '2026-03-10',
    amount: 260.75,
    category: 'Other',
    type: 'expense',
  },
]

