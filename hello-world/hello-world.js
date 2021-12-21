// app entry function
function sayHello() 
{
    try {
        // attempt to acquire the Application object
        var appManager = document.getElementById('applicationManager');
        var appObject = appManager.getOwnerApplication(document);
        // check if Application object was a success
        if (appObject === null) {
            console.error('Error acquiring the Application object!');
        } 
        else {
            // we have the Application object, and we can show our app
            appObject.show();
        }
    }
    catch (e) {
        // this is not an HbbTV client, log the error to console
        console.error('Not a HbbTV client!');
    }

}