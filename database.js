class Customer {
    constructor(dbName) {
        this.dbName = dbName;
        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. \
          Such and such feature will not be available.");
        }
    }

    /**
     * Remove all rows from the database
     * @memberof Customer
     */
    removeAllRows = () => {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = (event) => {
            notify('removeAllRows - Database error: ' + event.target.error.code +
                " - " + event.target.error.message);
        };

        request.onsuccess = (event) => {
            notify('Deleting all customers...');
            const db = event.target.result;
            const txn = db.transaction('customers', 'readwrite');
            txn.onerror = (event) => {
                notify('removeAllRows - Txn error: ' + event.target.error.code +
                    " - " + event.target.error.message);
            };
            txn.oncomplete = (event) => {
                notify('All rows removed!');
            };
            const objectStore = txn.objectStore('customers');
            const getAllKeysRequest = objectStore.getAllKeys();
            getAllKeysRequest.onsuccess = (event) => {
                getAllKeysRequest.result.forEach(key => {
                    objectStore.delete(key);
                });
            }
        }
    }

    /**
     * Populate the Customer database with an initial set of customer data
     * @param {[object]} customerData Data to add
     * @memberof Customer
     */
    initialLoad = (customerData) => {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = (event) => {
            notify('initialLoad - Database error: ' + event.target.error.code +
                " - " + event.target.error.message);
        };

        //New Handler Added
        request.onsuccess = (e) => {
            notify('Populating customers...')
            const db = request.result;
            const txn = db.transaction('customers', 'readwrite')
            const store = txn.objectStore('customers')

            customerData.forEach(customer => {
                store.put(customer)
            })

            db.close()
        }

        request.onupgradeneeded = (event) => {
            notify('Populating customers...');
            const db = request.result;
            const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
            objectStore.onerror = (event) => {
                notify('initialLoad - objectStore error: ' + event.target.error.code +
                    " - " + event.target.error.message);
            };

            // Create an index to search customers by name and email
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });

            // Populate the database with the initial set of rows
            customerData.forEach(function (customer) {
                objectStore.put(customer);
            });
            db.close();
        };
    }

    queryAllData = () => {

        const request = window.indexedDB.open(this.dbName, 1)

        request.onerror = (e) => {
            notify('Query - Database error: ' + e.target.error.code)
        }
        request.onsuccess = (e) => {
            notify('Querying retrived data...')

            const db = e.target.result;
            const txn = db.transaction('customers', 'readwrite')
            const store = txn.objectStore('customers')

            const keys = store.getAll()
            
            keys.onsuccess = (e) => {
                
                console.log(keys.result)
                if (keys.result.length < 1) {
                    notify('No data retrived')
                }else {
                    e.target.result.forEach(key => {
                        notify(' { name: ' + key.name + ' email: ' + key.email + ' } ')
                    })
                }

            }
            
        }

        request.onupgradeneeded = (e) => {
            notify('Updgrading Database...')

            const db = request.result
            const store = db.createObjectStore('customers', { keyPath: 'userid' })
            // const txn = db.transaction('customers', 'readwrite')

            store.onerror = (e) => {
                notify('Query - ObjectStore error: ' + e.target.error.message)
            }

            store.createIndex('name', 'name', { unique: false })
            store.createIndex('email', 'email', { unique: true })
            
            console.log(store)
            db.close()
        }
    }
}

// Web page event handlers
const DBNAME = 'customer_db';

/**
 * Clear all customer data from the database
 */
const clearDB = () => {
    notify('Delete all rows from the Customers database');
    let customer = new Customer(DBNAME);
    customer.removeAllRows();
}

/**
 * Add customer data to the database
 */
const loadDB = () => {
    notify('Load the Customers database');

    // Customers to add to initially populate the database with
    const customerData = [
        { userid: '444', name: 'Bill', email: 'bill@company.com' },
        { userid: '555', name: 'Donna', email: 'donna@home.org' }
    ];
    let customer = new Customer(DBNAME);
    customer.initialLoad(customerData);
}

const queryDB = () => {
    notify('Query data')
    let customer = new Customer(DBNAME)
    customer.queryAllData()
}

function notify(str) {
    const logPanel = document.querySelector('#execution-log')
    logPanel.value += '$>>> ' + str + '\n'
}

const clear = document.querySelector('.btn-clear')
const load = document.querySelector('.btn-load')
const query = document.querySelector('.btn-query')
const clearTerminal = document.querySelector('.clear-terminal')

clear.addEventListener('click', clearDB)
load.addEventListener('click', loadDB)
query.addEventListener('click', queryDB)
clearTerminal.addEventListener('click', () => {
    const logPanel = document.querySelector('#execution-log')
    logPanel.value = '$>>>'
})