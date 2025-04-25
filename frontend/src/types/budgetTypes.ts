export interface Budget {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    period: string | null;
    start_date: string | null;
    end_date: string | null;
    is_main: boolean;
    description: string | null;
}

export interface BudgetListResponse {
    budgets: Budget[];
}

export interface BudgetPayload {
    name: string;
    amount: number;
    period: string | null;
    start_date: Date | null;
    end_date: Date | null;
    is_main: boolean;
    description: string | null;
}

export interface CreateBudgetResponse {
    message: string;
    budget: Budget;
}

export interface UpdateBudgetPayload extends BudgetPayload {
    budgetId: string;
}