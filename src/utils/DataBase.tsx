
import * as SQLite from 'expo-sqlite';
import { PoleExpend } from '../redux/expendSlice';
import { listInterface } from '../redux/listSlice';

const db = SQLite.openDatabase("database.db");



export default class DatabaseManager {

    static initializeDatabase(): void {
        db.transaction(tx => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, montant REAL, montant_total REAL, date TEXT, category TEXT, description TEXT,recurrence INTEGER,type TEXT, quantity INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS expenses_category (id INTEGER PRIMARY KEY AUTOINCREMENT, expenses_id INTEGER, category_id INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS budget (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, montant REAL, start_montant REAL, date TEXT, is_list INTEGER);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS budget_expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, budget_id INTEGER, expenses_id INTEGER);",
            );

            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, montant REAL, items TEXT, validate INTEGER, date TEXT, task INTEGER, task_terminer INTEGER);",
            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS list_budget (id INTEGER PRIMARY KEY AUTOINCREMENT, id_list INTEGER, id_budget INTEGER );",
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

        const date = this.CreateDateCurentString();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO budget (name, montant,start_montant, date, is_list) VALUES (?, ?, ?, ?, ?);",
                    [name, montant, start_montant, date, 0]
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

    static createExpenses({ montant, category, montant_total, description, budget_id, name, type, quantity }: {
        montant: number,
        category: string,
        description: string,
        budget_id: number,
        name: string,
        type: string,
        quantity: number,
        montant_total: number
    }): Promise<any> {

        const date_string = this.CreateDateCurentString()

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO expenses (montant, montant_total,name, category, description, type, quantity, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
                    [montant, montant_total, name, category, description, type, quantity, date_string]
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

    static updateBudget(id: number, montant: number, name: string, is_list: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE budget SET start_montant = ?, name = ?, is_list = ? WHERE id = ?;",
                    [montant, name, id, is_list ? 1 : 0]
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

    static CreateDateCurentString(): string {
        const date = new Date();
        const date_string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return date_string;
    }

    static updateExpend({ id, montant, name, montant_total, quantity, type, category }:
        {
            id: number,
            montant: number,
            name: string,
            montant_total:
            number,
            quantity: number,
            type: string,
            category: string
        }

    ): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE expenses SET montant = ?, name = ?,  montant_total = ?, quantity = ?, type=?, category=? WHERE id = ?;",
                    [montant, name, montant_total, quantity, type, category, id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE EXPEND")
                    resolve();

                }
            );
        });
    }


    static getAllList(): Promise<listInterface[]> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM list",
                    [],
                    (_, { rows: { _array } }) => {

                        const list: listInterface[] = _array.map((item: any) => {
                            return {
                                id: item.id,
                                name: item.name,
                                montant: item.montant,
                                date: item.date,
                                items: JSON.parse(item.items),
                                validate: item.validate,
                                task: item.task,
                                taskTerminer: item.task_terminer
                            }

                        });

                        resolve(list);
                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET LIST")
                }
            );
        });
    }

    static getListByIdBudget(id_budget: number): Promise<listInterface> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM list_budget WHERE id_budget = ?",
                    [id_budget],
                    (_, { rows: { _array } }) => {


                        this.getListById(_array[0].id_list).then((list) => {
                            resolve(list);
                        });

                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET LIST BY ID BUDGET")
                }
            );
        });

    }


    static getListById(id: number): Promise<listInterface> {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM list WHERE id = ?",
                    [id],
                    (_, { rows: { _array } }) => {


                        const list: listInterface = {
                            id: _array[0].id,
                            name: _array[0].name,
                            montant: _array[0].montant,
                            date: _array[0].date,
                            items: JSON.parse(_array[0].items),
                            validate: _array[0].validate,
                            task: _array[0].task,
                            taskTerminer: _array[0].task_terminer

                        }
                        resolve(list);
                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET LIST BY ID")
                }
            );
        });

    }

    static createListByBudget(budget: PoleExpend): Promise<listInterface> {
        const task = budget.listeExpend.length;
        return new Promise((resolve, reject) => {
            const list: listInterface = {
                id: 0,
                name: budget.nom,
                montant: budget.montant,
                date: this.CreateDateCurentString(),
                items: [],
                validate: false,
                task: task,
                taskTerminer: 0
            }

            const items = budget.listeExpend.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    date: item.date,
                    montant: item.montant,
                    quantity: item.quantity,
                    type: item.type,
                    category: item.category,
                    isChecked: false
                }
            })

            list.items = items;

            db.transaction(tx => {

                tx.executeSql(
                    "INSERT INTO list (name, montant, date, items, validate, task, task_terminer) VALUES (?, ?, ?, ?, ?, ?, ?);",
                    [list.name, list.montant, list.date, JSON.stringify(list.items), list.validate ? 1 : 0, list.task, list.taskTerminer],
                    (_, { insertId }) => {

                        if (insertId) {

                            this.LinkListToBudget(insertId, budget.id).then(() => {

                                this.getListById(insertId).then((list) => {

                                    this.updateBudget(budget.id, budget.montant, budget.nom, true).then(() => {
                                        resolve(list);
                                    });


                                });

                            });

                        } else {
                            console.error("ERREUR + INSERT LIST")
                        }
                    }

                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            }, () => {
                console.info("OK + CREATE LIST")
            });
        });

    }


    static updateList({ id, name, montant, date, items, validate, task }: {
        id: number,
        name: string,
        montant: number,
        date: string,
        task: number
        items: {
            id: number,
            name: string,
            montant: number,
            date: string,
            category: string,
            quantity: number,
            type: string,
            isChecked: boolean,
        }[],
        validate: boolean
    }): Promise<void> {

        const listItemValidate = items.filter((item) => {
            return item.isChecked;
        })
        console.log("listItemValidate", listItemValidate.length)
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE list SET name = ?, montant = ?, date = ?, items = ?, validate = ?, task_terminer = ?, task = ? WHERE id = ?;",
                    [name, montant, date, JSON.stringify(items), validate ? 1 : 0, listItemValidate.length, task, id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE LIST")
                    resolve();

                }
            );
        });
    }

    static deleteList(id: number, id_budget: number): Promise<void> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM list WHERE id = ?;",
                    [id]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE LIST")

                    this.getBudgetById(id_budget).then((budget) => {

                        this.updateBudget(budget.id, budget.montant, budget.nom, false).then(() => {
                            this.deleteListByIdBudget(id_budget).then(() => {
                                resolve();
                            });
                        });
                    });




                }
            );
        });

    }

    static deleteListByIdBudget(id_budget: number): Promise<void> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM list_budget WHERE id_budget = ?;",
                    [id_budget]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE LIST BY ID BUDGET")


                    resolve();

                }
            );
        });

    }

    static LinkListToBudget(id_budget: number, id_list: number): Promise<void> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO list_budget (id_budget, id_list) VALUES (?, ?);",
                    [id_budget, id_list]
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + LINK LIST TO BUDGET")
                    resolve();

                }
            );
        });
    }

    static getIdBudgetByListId(id_list: number): Promise<number> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM list_budget WHERE id_list = ?",
                    [id_list],
                    (_, { rows: { _array } }) => {

                        if (_array.length > 0) {

                            resolve(_array[0].id_budget);

                        } else {
                            resolve(0);
                        }

                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET BUDGET BY LIST")
                }
            );
        });
    }

    static getBudgetById(id: number): Promise<PoleExpend> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM budget WHERE id = ?",
                    [id],
                    (_, { rows: { _array } }) => {

                        if (_array.length > 0) {

                            const budget = _array[0];

                            const poleExpend: PoleExpend = {
                                id: budget.id,
                                nom: budget.nom,
                                montant: budget.montant,
                                listeExpend: [],
                                date: budget.date,
                                isList: budget.is_list ? true : false,
                                montantStart: budget.montant_start,
                            }

                            resolve(poleExpend);

                        } else {
                            resolve({} as PoleExpend);
                        }

                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET BUDGET BY ID")
                }
            );
        });

    }
}
