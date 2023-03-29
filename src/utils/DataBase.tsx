
import * as SQLite from 'expo-sqlite';
import { CompteInterface, TransactionInterface } from '../redux/comptesSlice';
import { listInterface, stepInterface } from '../redux/listSlice';

const db = SQLite.openDatabase("database.db");



export default class DatabaseManager {

    static initializeDatabase(): void {
        db.transaction(tx => {

            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, identifiant TEXT, password TEXT);",

            );
            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);",

            );

            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS compte_users (id INTEGER PRIMARY KEY AUTOINCREMENT, compte_id INTEGER, user_id INTEGER);",
            );


            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, montant REAL, items TEXT, validate INTEGER, date TEXT, task INTEGER, task_terminer INTEGER);",
            );


            tx.executeSql(

                "CREATE TABLE IF NOT EXISTS compte (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, pay REAL , withdrawal REAL , deposit REAL, transactions TEXT, date TEXT, discovered INTEGER, discoveredMontant REAL );",
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

    static GetAllCategory(): Promise<any> {
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

    static CreateDateCurentString(): string {
        const date = new Date();
        const date_string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        return date_string;
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
                                steps: JSON.parse(item.items),
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
                            steps: JSON.parse(_array[0].items),
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


    static createList(name: string): Promise<listInterface> {

        const list: listInterface = {
            id: 0,
            name: name,
            montant: 0,
            date: this.CreateDateCurentString(),
            steps: [],
            validate: false,
            task: 0,
            taskTerminer: 0
        }

        return new Promise((resolve, reject) => {
            db.transaction(tx => {

                tx.executeSql(
                    "INSERT INTO list (name, montant, date, items, validate, task, task_terminer) VALUES (?, ?, ?, ?, ?, ?, ?);",
                    [list.name, list.montant, list.date, JSON.stringify(list.steps), list.validate ? 1 : 0, list.task, list.taskTerminer],
                    (_, { insertId }) => {

                        if (insertId) {
                            this.getListById(insertId).then((list) => {
                                resolve(list);
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


    static updateList({ id, name, montant, date, steps, validate, task }: {
        id: number,
        name: string,
        montant: number,
        date: string,
        task: number
        steps: stepInterface[],
        validate: boolean
    }): Promise<listInterface> {

        const listStepValidate = steps.filter((step: stepInterface) => {
            return step.isChecked;
        })

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "UPDATE list SET name = ?, montant = ?, date = ?, items = ?, validate = ?, task_terminer = ?, task = ? WHERE id = ?;",
                    [name, montant, date, JSON.stringify(steps), validate ? 1 : 0, listStepValidate.length, task, id],
                    (_, { rowsAffected }) => {

                        DatabaseManager.getListById(id).then((list) => {
                            resolve(list);
                        });


                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE LIST")


                }
            );
        });
    }

    static deleteList(id: number): Promise<void> {

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
                    resolve();
                }
            );
        });

    }

    static CreateCompte({ _idUser, _name, _discovered, _discoveredMontant }: {
        _idUser: number
        _name: string,
        _discovered: boolean,
        _discoveredMontant: number

    }): Promise<CompteInterface> {

        const date = this.CreateDateCurentString();
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO compte (name, date, discovered, discoveredMontant) VALUES (?,?,?,?);",
                    [_name, date, _discovered ? 1 : 0, _discoveredMontant],
                    (_, { insertId }) => {
                        if (insertId != undefined && insertId > 0) {
                            tx.executeSql(
                                "INSERT INTO compte_users (user_id, compte_id) VALUES (?,?);",
                                [_idUser, parseInt(insertId.toString())],
                                (_) => {

                                    this.GetCompteByID(insertId).then((compte) => {
                                        resolve(compte);
                                    });

                                },


                            );
                        }


                    }

                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            }, () => {
                console.info("OK + CREATE COMPTE")
            });
        });



    }

    static GetCompteByID(id: number): Promise<CompteInterface> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM compte WHERE id = ?",
                    [id],
                    (_, { rows: { _array } }) => {

                        if (_array.length > 0) {

                            const compte = _array[0];

                            const compteInterface: CompteInterface = {
                                id: compte.id,
                                name: compte.name,
                                pay: compte.pay,
                                date: compte.date,
                                withdrawal: compte.withdrawal,
                                deposit: compte.deposit,
                                transactions: JSON.parse(compte.transactions) as TransactionInterface[],
                                discovered: compte.discovered == 1 ? true : false,
                                discoveredMontant: compte.discoveredMontant,
                            }

                            resolve(compteInterface);

                        } else {
                            resolve({} as CompteInterface);
                        }

                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET COMPTE BY ID")
                }
            );
        });

    }

    static async GetIDComptesByIDUser(id: number): Promise<{
        user_id: number,
        compte_id: number
    }[]> {
        return new Promise((resolve, reject) => {

            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM compte_users WHERE user_id = ?",
                    [id],
                    (_, { rows: { _array } }) => {

                        resolve(_array);

                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET COMPTE BY ID")
                }
            );
        });

    }

    static async GetAllComptesByListID(listID: number[]): Promise<CompteInterface[]> {

        const comptes: CompteInterface[] = [];

        for (let i = 0; i < listID.length; i++) {
            const compte = await this.GetCompteByID(listID[i]);
            comptes.push(compte);
        }

        return comptes;
    }


    static UpdateCompte = (id: number, name: string, pay: number, withdrawal: number, deposit: number, transactions: TransactionInterface[], discoveredMontant?: number, discovered?: boolean): Promise<CompteInterface> => {


        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                discoveredMontant ?
                    tx.executeSql(
                        "UPDATE compte SET name = ?, pay = ?, withdrawal = ?, deposit = ?, transactions = ?, discoveredMontant = ?, discovered = ?  WHERE id = ?",
                        [name, pay, withdrawal, deposit, JSON.stringify(transactions), discoveredMontant, discovered ? 1 : 0, id],
                        (_, { rows: { _array } }) => {

                            this.GetCompteByID(id).then((compte) => {

                                resolve(compte);

                            }).catch((e) => {

                                console.error("ERREUR + " + e)
                                reject(e);

                            }
                            );
                        }
                    ) :
                    tx.executeSql(
                        "UPDATE compte SET name = ?, pay = ?, withdrawal = ?, deposit = ?, transactions = ?  WHERE id = ?",
                        [name, pay, withdrawal, deposit, JSON.stringify(transactions), id],
                        (_, { rows: { _array } }) => {

                            this.GetCompteByID(id).then((compte) => {

                                resolve(compte);

                            }).catch((e) => {

                                console.error("ERREUR + " + e)
                                reject(e);

                            }
                            );
                        }
                    )
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + UPDATE COMPTE")



                }
            );
        });

    }

    static DeleteCompteById(id_compte: number, id_user: number): Promise<boolean> {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "DELETE FROM compte WHERE id = ?",
                    [id_compte],
                    (_, { rows: { _array } }) => {
                        tx.executeSql(
                            "DELETE FROM compte_users WHERE user_id = ?",
                            [id_user],
                            (_, { rows: { _array } }) => {
                                resolve(true);
                            }
                        );
                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + DELETE COMPTE BY ID")


                }
            );
        });

    }


    static GetIsAsUser = (): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM users",
                    [],
                    (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + GET IS AS USER")
                }
            );
        });

    }

    static RegisterUser = (identifiant: string, password: string): Promise<boolean> => {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "INSERT INTO users ( identifiant, password) VALUES ( ?, ?)",
                    [identifiant, password]

                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + REGISTER USER")
                    resolve(true);
                }
            );
        });

    }

    static LoginUser = (identifiant: string, password: string): Promise<{
        id: number,
        identifiant: string,
        password: string
    } | boolean> => {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT * FROM users WHERE identifiant = ? AND password = ?",
                    [identifiant, password],
                    (_, { rows: { _array } }) => {

                        if (_array.length > 0) {

                            resolve({
                                id: _array[0].id,
                                identifiant: _array[0].identifiant,
                                password: _array[0].password
                            });
                        } else {
                            resolve(false);
                        }
                    }
                );
            }, (e) => {
                console.error("ERREUR + " + e)
                reject(e);
            },
                () => {
                    console.info("OK + LOGIN USER")
                }
            );
        });

    }

}
