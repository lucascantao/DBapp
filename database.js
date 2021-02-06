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
            log('removeAllRows - Database error: ' + event.target.error.code +
                " - " + event.target.error.message);
        };

        request.onsuccess = (event) => {
            notify('Deleting all customers...');
            const db = event.target.result;
            const txn = db.transaction('customers', 'readwrite');
            txn.onerror = (event) => {
                log('removeAllRows - Txn error: ' + event.target.error.code +
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
            log('initialLoad - Database error: ' + event.target.error.code +
                " - " + event.target.error.message);
        };

        // onsuccess event handler added
        request.onsuccess = (e) => {
            notify('Populating customers...')
            const db = request.result;
            const txn = db.transaction('customers', 'readwrite')
            const store = txn.objectStore('customers')

            customerData.forEach(customer => {
                store.put(customer)
            })

            notify('Load operation end');

            db.close()
        }

        request.onupgradeneeded = (event) => {
            notify('Populating customers...')
            const db = request.result;
            const objectStore = db.createObjectStore('customers', { keyPath: 'userid' });
            objectStore.onerror = (event) => {
                log('initialLoad - objectStore error: ' + event.target.error.code +
                    " - " + event.target.error.message);
            };

            // Create an index to search customers by name and email
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });

            // Populate the database with the initial set of rows
            customerData.forEach(function (customer) {
                objectStore.put(customer);
            });

            notify('Load operation end');
            db.close();
        };
    }

    queryAllData = () => {

        const request = window.indexedDB.open(this.dbName, 1)

        request.onerror = (e) => {
            log('Query - Database error: ' + e.target.error.code)
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
                        log(' { name: ' + key.name + ' email: ' + key.email + ' } ')
                    })
                    notify('Query operation End')
                }

            }
            
        }

        request.onupgradeneeded = (e) => {
            notify('Updgrading Database...')

            const db = request.result
            const store = db.createObjectStore('customers', { keyPath: 'userid' })

            store.onerror = (e) => {
                log('Query - ObjectStore error: ' + e.target.error.message)
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
    log('Delete all rows from the Customers database');
    let customer = new Customer(DBNAME);
    customer.removeAllRows();
}

/**
 * Add customer data to the database
 */
const loadDB = () => {
    log('Load the Customers database');

    // Customers to add to initially populate the database with
    const customerData = [
        { userid: '444', name: 'Bill', email: 'bill@company.com' },
        { userid: '555', name: 'Donna', email: 'donna@home.org' }
    ];
    let customer = new Customer(DBNAME);
    customer.initialLoad(customerData);
}

const queryDB = () => {
    log('Query data')
    let customer = new Customer(DBNAME)
    customer.queryAllData()
}

function log(str) {
    const logPanel = document.querySelector('#log-panel')
    logPanel.value += '# ' + str + '\n'
}

function List(item) {
    return `<li> ${item} </li>`
}

function queryDatabase(items) {
    const DBpanel = document.querySelector('.DB-query-list')
    items.forEach(item => {
        DBpanel.innerHTML += List(item)
    })
}

const notPanel = document.querySelector('.notification-panel')

function notify(str) {
    notPanel.classList.remove('hide')
    log(str)
    notPanel.innerHTML = `<p class="notification-text"> ${str} </p>`
}



const clear = document.querySelector('.btn-clear')
const load = document.querySelector('.btn-load')
const query = document.querySelector('.btn-query')
const clearTerminal = document.querySelector('.clear-terminal')

clear.addEventListener('click', clearDB)
load.addEventListener('click', loadDB)
query.addEventListener('click', queryDB)

notPanel.addEventListener('click', () => {
    notPanel.classList.add('hide')
})

clearTerminal.addEventListener('click', () => {
    const logPanel = document.querySelector('#log-panel')
    logPanel.value = '#\n'
})




queryDatabase(['item 1', 'item 2', 'item 3'])