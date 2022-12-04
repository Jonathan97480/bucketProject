
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("database.db");



export default class DatabaseManager {

    static initializeDatabase(): void {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, montant REAL, date TEXT, category TEXT, description TEXT,recurrence INTEGER,type TEXT);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS expenses_category (id INTEGER PRIMARY KEY AUTOINCREMENT, expenses_id INTEGER, category_id INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS budget (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT , montant REAL, start_montant REAL);",

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

    static createBudget(name: string, montant: number, start_montant: number): Promise<any> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO budget (name, montant,start_montant) VALUES (?, ?, ?);",
                    [name, montant, start_montant]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },

                () => {
                    console.log("OK + CREATE BUDGET")
                    resolve(true);

                }
            );
        });
    }

    static createExpenses({ montant, category, description, budget_id, name, type }: {
        montant: number,
        category: string,
        description: string,
        budget_id: number,
        name: string
        type: string
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO expenses (montant, name, category, description,type) VALUES (?, ?, ?, ?,?);",
                    [montant, name, category, description, type]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + ")
                    this.getLastExpense().then((expend) => {
                        this.getIdCategoryByName(category).then((id_category) => {
                            this.LinkExpensesToCategory(expend.id, id_category);
                            this.LinkBudgetToExpenses(budget_id, expend.id);
                            resolve(expend);
                        });

                    });

                }
            );
        });
    }
    static getBudget(): Promise<any> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM budget",
                    [],
                    (_, { rows: { _array } }) => {
                        resolve(_array);
                    }
                );
            }, (e) => { console.error("ERREUR2 + " + e) },
                () => {
                    console.log("OK + GET BUDGET")
                });
        });
    }

    static deleteBudget(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM budget WHERE id = ?;",
                    [id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE BUDGET")
                    resolve();

                }
            );
        });
    }

    static getLastExpense(): Promise<any> {
        return new Promise((resolve, reject) => {

            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM expenses ORDER BY id DESC LIMIT 1",
                    [],
                    (_, { rows: { _array } }) => {
                        resolve(_array[0]);
                    }
                );
            }, (e) => {
                console.error("ERREUR2 + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET LAST EXPENSES ID")
                }
            );
        });
    }

    static getIdCategoryByName(name: string): Promise<number> {
        return new Promise((resolve, reject) => {
            let id: number = 0;
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT id FROM category WHERE name = ?",
                    [name],
                    (_, { rows: { _array } }) => {
                        resolve(_array[0].id);
                    }
                );
            }, (e) => {
                console.error("ERREUR2 + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET ID CATEGORY BY NAME")
                }
            );
        });
    }

    static deleteExpend(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM expenses WHERE id = ?;",
                    [id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE EXPENSES")
                    resolve();

                }
            );
        });
    }

    static updateBudgetMontant(id: number, montant: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE budget SET montant = ? WHERE id = ?;",
                    [montant, id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE BUDGET MONTANT")
                    resolve();

                }
            );
        });
    }

    static deleteRelationCategoryExpenses(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM expenses_category WHERE expenses_id = ?;",
                    [id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE RELATION CATEGORY EXPENSES")
                    resolve();

                }
            );
        });
    }


    static deleteAllExpendByBudget(id_budget: number): Promise<void> {
        return new Promise((resolve, reject) => {

            this.getExpensesByBudget(id_budget).then((expend) => {
                expend.forEach((element: any) => {
                    this.deleteRelationCategoryExpenses(element.id);
                    this.deleteExpend(element.id);
                    this.deleteAllRelationByBudget(id_budget);
                });
                resolve();
            });
        });
    }

    static deleteAllRelationByBudget(id_budget: number): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM budget_expenses WHERE budget_id = ?;",
                    [id_budget]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE ALL RELATION BY BUDGET")
                    resolve();

                }
            );
        });
    }

    static updateBudget(id: number, montant: number, name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE budget SET start_montant = ?, name = ? WHERE id = ?;",
                    [montant, name, id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE BUDGET")
                    resolve();

                }
            );
        });
    }
}