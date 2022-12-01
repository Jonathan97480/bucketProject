
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("database.db");



export default class DatabaseManager {

    static initializeDatabase(): void {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, montant REAL, date TEXT, category TEXT, description TEXT,recurrence INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS expenses_category (id INTEGER PRIMARY KEY AUTOINCREMENT, expenses_id INTEGER, category_id INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS budget (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , montant FLOAT );",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS budget_expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, budget_id INTEGER, expenses_id INTEGER);",
            );

        }, (e) => { console.log("ERREUR + " + e) },
            () => {
                console.log("OK + ")
                this.StartCategory();


            }
        );
    }

    static initializeCategory(): void {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO category (name) VALUES ('Alimentation'), ('Logement'), ('Santé'), ('Loisirs'), ('Vêtements'), ('Autres');",
            );
        }, (e) => { console.log("ERREUR + " + e) },
            () => {
                console.info("OK + CATEGORY INITIALIZED")


            }
        );
    }

    static StartCategory(): void {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM category",
                [],
                (_, { rows: { _array } }) => {
                    _array.length == 0 ? DatabaseManager.initializeCategory() : console.info("category already initialized");
                }
            );
        }, (e) => { console.error("ERREUR2 + " + e) },
            () => {
                console.info("OK + CHECK CATEGORY INITIALIZED")


            }
        );
    }

    static getCategory(): Promise<any> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM category",
                    [],
                    (_, { rows: { _array } }) => {
                        resolve(_array);
                    }
                );
            }, (e) => { console.error("ERREUR2 + " + e) },
                () => {
                    console.info("OK + GET CATEGORY")
                });




        });
    }

    static LinkExpensesToCategory(expenses_id: number, category_id: number): void {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO expenses_category (expenses_id, category_id) VALUES (?, ?);",
                [expenses_id, category_id]
            );
        }, (e) => { console.error("ERREUR + " + e) },
            () => {
                console.log("OK + LINK EXPENSES TO CATEGORY")

            }
        );
    }

    static LinkBudgetToExpenses(budget_id: number, expenses_id: number): void {

        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO budget_expenses (budget_id, expenses_id) VALUES (?, ?);",
                [budget_id, expenses_id]
            );
        }, (e) => { console.error("ERREUR + " + e) },
            () => {
                console.info("OK + LINK BUDGET TO EXPENSES")

            }
        );
    }


    static getExpensesByBudget(budget_id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM expenses WHERE id IN (SELECT expenses_id FROM budget_expenses WHERE budget_id = ?);",
                    [budget_id],
                    (_, { rows: { _array } }) => {
                        resolve(_array);
                    }
                );
            }, (e) => { console.error("ERREUR2 + " + e) },
                () => {
                    console.log("OK + GET EXPENSES BY BUDGET")
                });
        });
    }

    static getExpensesByCategoriesByBudget(budget_id: number, category_id: number): Promise<any> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM expenses WHERE id IN (SELECT expenses_id FROM budget_expenses WHERE budget_id = ?) AND id IN (SELECT expenses_id FROM expenses_categories WHERE category_id = ?);",
                    [budget_id, category_id],
                    (_, { rows: { _array } }) => {
                        resolve(_array);
                    }
                );
            }, (e) => { console.error("ERREUR2 + " + e) },
                () => {
                    console.log("OK + GET EXPENSES BY CATEGORIES BY BUDGET")
                });
        });
    }

    static createBudget(name: string, montant: number): void {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO budget (name, montant) VALUES (?, ?);",
                [name, montant]
            );
        }, (e) => { console.error("ERREUR + " + e) },
            () => {
                console.log("OK + CREATE BUDGET")

            }
        );
    }

    static createExpenses(montant: number, date: string, category: string, description: string): void {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO expenses (montant, date, category, description) VALUES (?, ?, ?, ?);",
                [montant, date, category, description]
            );
        }, (e) => { console.error("ERREUR + " + e) },
            () => {
                console.info("OK + ")

            }
        );
    }


}