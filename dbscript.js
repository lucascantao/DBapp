const add = document.querySelector('.btn-add')
const clear = document.querySelector('.btn-clear')
const show = document.querySelector('.btn-show')
const executionPanel = document.querySelector('#execution-log')

const clearBtn = document.querySelector('.clear-terminal')

clearBtn.addEventListener('click', () => {
  executionPanel.value = ''
})

const terminalPrefix = '$ '


function notify(str) {
  executionPanel.value += terminalPrefix + str + '\n'
}


class Customer {
    constructor(dbName) {
      this.dbName = dbName;
      this.dbVer = 1
      if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. \
          Such and such feature will not be available.");
      }
    }
  
    removeAllRows = () => {
      const request = window.indexedDB.open(this.dbName, this.dbVer);
  
      request.onerror = (event) => {
        notify('removeAllRows - Database error: ' + event.target.error.code +
          " - " + event.target.error.message);
      };
  
      request.onsuccess = (event) => {
        notify('Deleting all customers...');
        const db = request.result;
        console.log(db)
        const txn = db.transaction('customers', 'readwrite');
        txn.onerror = (event) => {
          notify('removeAllRows - Txn error: ', event.target.error.code,
            " - ", event.target.error.message);
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
  
    initialLoad = (customerData) => {
      const request = window.indexedDB.open(this.dbName, this.dbVer);
      
      request.onsuccess = (e) => {
        let db = request.result;
        let txn = db.transaction('customers', 'readwrite');

        txn.onerror = (e) => {
          console.log(e.target.error.message)
        }

        let objectStore = txn.objectStore('customers')
  
        // Populate the database with the initial set of rows
        customerData.forEach(function(customer) {
          objectStore.put(customer);
        });

        txn.oncomplete = () => {
          db.close()
        }
      }

      request.onerror = (event) => {
        notify('initialLoad - Database error: ' + event.target.error.code +
          " - " + event.target.error.message);
      };
  
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
        customerData.forEach(function(customer) {
          objectStore.put(customer);
        });
        db.close();
      };
      
    }

    queryData = () => {
      const request = window.indexedDB.open(this.dbName, this.dbVer)

      request.onerror = (e) => {
        alert('error on DB open()')
      }

      request.onsuccess = (e) => {
        let db = request.result;
        console.log(db)
        let txn = db.transaction('customers', 'readwrite');
        let store = txn.objectStore('customers')

        let q1 = store.getAll()
        q1.onsuccess = (e) => {
          notify('---------------------------')
          q1.result.forEach(result => {
            notify(' { userid: ' + result.userid + ', name: ' + result.name + ", email: " + result.email + ' } ')
          })
          notify('---------------------------')
        }

        db.close()
      }
    }
  }
  
  // Web page event handlers
  const DBNAME = 'customers_db';
  
  /**
   * Clear all customer data from the database
   */
  const clearDB = () => {
    notify('Delete all rows from the Customers database')
    let customer = new Customer(DBNAME);
    customer.removeAllRows();
  }
  
  /**
   * Add customer data to the database
   */
  const loadDB = () => {
    notify('Load the Customers database');
    
    const name = document.querySelector('.input-name').value
    const email = document.querySelector('.input-email').value

    const userid = Math.floor(Math.random() * 1000)

    

    // Customers to add to initially populate the database with
    const customerData = [
      { userid: userid, name: name, email: email },
    ];
    let customer = new Customer(DBNAME);
    customer.initialLoad(customerData);
  }

  const queryDB = () => {
    notify('Quering all Data:')
    let customer = new Customer(DBNAME)
    customer.queryData()
    
  }
  
add.addEventListener('click', loadDB)
clear.addEventListener('click', clearDB)
show.addEventListener('click', queryDB)