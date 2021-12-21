// app entry function
function sayHello() 
{
    try {
        // attempt to acquire the Application object
        var appManager = document.getElementById("applicationManager");
        var the_app = appManager.getOwnerApplication(document);
        // check if Application object was a success
        if (the_app === null) {
            console.error("Error acquiring the Application object!");
        } 
        else {
            // we have the Application object, and we can show our app
            the_app.show();
        }
    }
    catch (e) {
        // this is not an HbbTV client, log the error to console
        console.error("Not a HbbTV client!");
    }

}