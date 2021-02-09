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
                updateDatabasePanel([])
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

            const keys = store.getAll()

            keys.onsuccess = (e) => {
                updateDatabasePanel(e.target.result)
            }

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

                updateDatabasePanel(keys.result)

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
            store.createIndex('date', 'date', { unique: false })
            store.createIndex('sales', 'sales', { unique: false })
            
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

    load.classList.remove('disabled')
    clear.classList.add('disabled')
}

/**
 * Add customer data to the database
 */
const loadDB = () => {
    log('Load the Customers database');

    // Customers to add to initially populate the database with
    const customerData = [
        { userid: '444', name: 'Bill', email: 'bill@company.com', date: '22-1-7', sales: '3621' },
        { userid: '555', name: 'Donna', email: 'donna@home.org', date: '22-12-11', sales: '10219' }
    ];
    let customer = new Customer(DBNAME);
    customer.initialLoad(customerData);

    load.classList.add('disabled')
    clear.classList.remove('disabled')
}

const queryDB = () => {
    log('Query data')
    let customer = new Customer(DBNAME)
    customer.queryAllData()

    load.classList.add('disabled')
    clear.classList.remove('disabled')
}

function log(str) {
    const logPanel = document.querySelector('#log-panel')
    logPanel.value += '# ' + str + '\n'

    document.querySelector('#log-panel').scrollTop = document.querySelector('#log-panel').scrollHeight
    document.querySelector('.notification-panel').scrollTop = document.querySelector('.notification-panel').scrollHeight
}

function List(item) {
    return `<div class='DB-row'> ${item} </div>`
}

function Message(msg) {
    return `<div class='notification-message'> <p class='notification-text'> ${msg} </p> </div>`
}

function updateDatabasePanel(items) {
    const DBpanel = document.querySelector('.DB-query-list')
    const header = document.querySelector('.query-header')


    DBpanel.querySelector('.index').innerHTML = List('#')
    DBpanel.querySelector('.userid').innerHTML = List('userid')
    DBpanel.querySelector('.name').innerHTML = List('name')
    DBpanel.querySelector('.email').innerHTML = List('email')
    DBpanel.querySelector('.date').innerHTML = List('date')
    DBpanel.querySelector('.sales').innerHTML = List('sales')

    if(items.length > 0) {
        header.classList.remove('alert')
        header.innerHTML = ''
        items.forEach((item, index) => {
            DBpanel.querySelector('.index').innerHTML += List(index)
            DBpanel.querySelector('.userid').innerHTML += List(item.userid)
            DBpanel.querySelector('.name').innerHTML += List(item.name)
            DBpanel.querySelector('.email').innerHTML += List(item.email)
            DBpanel.querySelector('.date').innerHTML += List(item.date)
            DBpanel.querySelector('.sales').innerHTML += List(item.sales)
        })
    }else {
        header.classList.add('alert')
        header.innerHTML = 'No Rows To Display'
    }

}


function notify(str) {
    const notPanel = document.querySelector('.notification-panel')
    notPanel.innerHTML += Message(str)
    log(str)
}

const clear = document.querySelector('.btn-clear')
const load = document.querySelector('.btn-load')
const query = document.querySelector('.btn-query')
// const clearTerminal = document.querySelector('.clear-terminal')

clear.addEventListener('click', clearDB)
load.addEventListener('click', loadDB)
query.addEventListener('click', queryDB)


// clearTerminal.addEventListener('click', () => {
//     const logPanel = document.querySelector('#log-panel')
//     logPanel.value = '#\n'
// })