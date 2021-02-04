#DBapp

## User Stories

-   [x] User can see a web page containing a control panel containing three
buttons - 'Load DB', 'Query DB', and 'Clear DB'. 
-   [x] User can see a notification panel where status messages will be posted. 
-   [x] User can see a scrollable log panel where execution details describing
the apps operation and interface with the Customer instance will be posted. 
-   [ ] User can see a running history of notification panel messages in the log
panel.
-   [ ] User can see a scrollable query results area where retrieved customer
data will be displayed.
-   [x] User can click the 'Load DB' button to populate the database with data.
The 'Load DB' button in your UI should be hooked to the `loadDB` event handler
that's provided. 
-   [ ] User can see a message displayed in the notification panel when the 
data load operation starts and ends.
-   [x] User can click the 'Query DB' button to list all customers in the query 
results area. The 'Query DB' button in your UI should be hooked to a `queryDB`
event handler you will add to the program. 
-   [ ] User can see a message in the notification panel when the query starts
and ends.
-   [ ] User can see a message in the query results area if there are no rows
to display.
-   [x] User can click on the 'Clear DB' button to remove all rows from the 
database. The 'Clear DB' button in your UI should be hooked to the `clearDB` 
event handler that's provided. 
-   [ ] User can see a message in the notification panel when the clear
operation starts and ends.

## Bonus features

-   [ ] User can see buttons enabled and disabled according to the following
table.

    | State               | Load DB  | Query DB | Clear DB |
    |---------------------|----------|----------|----------|
    | Initial App display | enabled  | enabled  | disabled |
    | Load DB clicked     | disabled | enabled  | enabled  |
    | Query DB clicked    | disabled | enabled  | enabled  |
    | Clear DB clicked    | enabled  | enabled  | disabled |
    
-   [ ] User can see additional Customer data fields added to those included
in the code provided. Developer should add date of last order and total sales
for the year.
-   [ ] Developer should conduct a retrospection on this project:
    - What use cases can you see for using IndexedDB in your frontend apps?
    - What advantages and disadvantages can you see over using a file or 
    local storage?
    - In general, what criteria might you use to determine if IndexedDB is right
    for your app. (Hint: 100% yes or no is not a valid answer).

