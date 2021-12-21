// scene implementation
var scene = {
    app_obj:null,
    app_area: null,
    app_area_visible: false,
    red_button_notification_field: null,
    lastNavigationButtonPressed: null,
    lastPlaybackButtonPressed: null,
    lastNumericButtonPressed: null,
    shouldReactToPlaybackButtons: false,
    shouldReactToNumericButtons: false,
    timeout: 0,
    initialize: function(the_app) {
        scene.app_obj = the_app;
        scene.app_area = document.getElementById("app_area");
        scene.red_button_notification_field = document.getElementById("red_button_notification_field");
        // register RC button event listener
        rc_utils.registerKeyEventListener();
        // initial state is app_area hidden
        scene.hideAppArea();
        // render the scene so it is ready to be shown
        scene.render();
    },
    getRelevantButtonsMask: function(){
        // mask includes color buttons
        var mask = rc_utils.MASK_CONSTANT_RED + rc_utils.MASK_CONSTANT_GREEN + rc_utils.MASK_CONSTANT_YELLOW + rc_utils.MASK_CONSTANT_BLUE;
        // and navigation
        mask += rc_utils.MASK_CONSTANT_NAVIGATION;
        // add playback buttons if scene should react to them
        if (scene.shouldReactToPlaybackButtons) {mask += rc_utils.MASK_CONSTANT_PLAYBACK;}
        // add numeric buttons if scene should react to them
        if (scene.shouldReactToNumericButtons) {mask += rc_utils.MASK_CONSTANT_NUMERIC;}
        // return calculated button mask  
        return mask;
    },
    showAppArea: function(){
        scene.app_area.style.visibility = "visible";
        scene.red_button_notification_field.style.visibility = "hidden";
        scene.app_area_visible = true;
        // when shown, app reacts to all buttons relevant on the scene
        rc_utils.setKeyset(scene.app_obj, scene.getRelevantButtonsMask());
    },
    hideAppArea: function(){
        scene.app_area.style.visibility = "hidden";
        scene.red_button_notification_field.style.visibility = "visible";
        scene.app_area_visible = false;
        // when hidden, app reacts only to red button key press (show app scene)
        rc_utils.setKeyset(scene.app_obj, rc_utils.MASK_CONSTANT_RED);
    },
    render: function(){
        // do navigation buttons
        if (scene.lastNavigationButtonPressed === null) {
            document.getElementById('navigation_field').innerHTML = "Please press one of the navigation buttons (arrows, OK/ENTER, back).";
        }
        else {
            document.getElementById('navigation_field').innerHTML = scene.lastNavigationButtonPressed;
        }
        // do playback buttons
        if (scene.shouldReactToPlaybackButtons) {
            if (scene.lastPlaybackButtonPressed === null) {
                document.getElementById('playback_field').innerHTML = "Please press one of the playback buttons (trick play controls).";
            }
            else {
                document.getElementById('playback_field').innerHTML = scene.lastPlaybackButtonPressed;
            }
            document.getElementById('toggle_playback_field').innerHTML = "Disable playback buttons";
        }
        else {
            document.getElementById('playback_field').innerHTML = "Please press the green button to enable playback buttons.";            
            document.getElementById('toggle_playback_field').innerHTML = "Enable playback buttons";
        }
        // do numeric buttons
        if (scene.shouldReactToNumericButtons) {
            if (scene.lastNumericButtonPressed === null) {
                document.getElementById('numeric_field').innerHTML = "Please press one of the numeric buttons (0 ... 9).";
            }
            else {
                document.getElementById('numeric_field').innerHTML = scene.lastNumericButtonPressed;
            }
            document.getElementById('toggle_numeric_field').innerHTML = "Disable numeric buttons";
        }
        else {
            document.getElementById('numeric_field').innerHTML = "Please press the yellow button to enable numeric buttons.";            
            document.getElementById('toggle_numeric_field').innerHTML = "Enable numeric buttons";
        }
        // do prevent field
        document.getElementById('prevent_field').innerHTML = "Please press the blue button to prevent the app from receiving button events for 10 seconds.";
    },
    timerTick: function() {
        // check if timeout occured
        if (scene.timeout > 0) {
            // not yet, display message
            document.getElementById('prevent_field').innerHTML = "The app shall not receive RC button events for " + scene.timeout + " seconds.";
            // decrement timeout and reschedule for 1 second
            scene.timeout--;
            setTimeout(scene.timerTick, 1000);
        }
        else {
            // timeout occured, start reacting to buttons again
            rc_utils.setKeyset(scene.app_obj, scene.getRelevantButtonsMask());
            // and rerender scene
            scene.render();
        }    
    }
};

// RC button press handler function
function handleKeyCode(kc) {
    try {
        // process buttons
        if (kc===VK_RED) {
            // red button shows & hides the app scene
            if (scene.app_area_visible) {
                scene.hideAppArea()
            }
            else {
                scene.showAppArea();
            }
        }
        else if (kc===VK_GREEN) {
            // green button toggles playback buttons
            if (scene.shouldReactToPlaybackButtons) {
                scene.shouldReactToPlaybackButtons = false;
            }
            else {
                scene.shouldReactToPlaybackButtons = true;
                scene.lastPlaybackButtonPressed = null;
            }
            rc_utils.setKeyset(scene.app_obj, scene.getRelevantButtonsMask());
            // render scene
            scene.render();
        }
        else if (kc===VK_YELLOW) {
            // yellow button toggles numeric buttons
            if (scene.shouldReactToNumericButtons) {
                scene.shouldReactToNumericButtons = false;
            }
            else {
                scene.shouldReactToNumericButtons = true;
                scene.lastNumericButtonPressed = null;
            }
            rc_utils.setKeyset(scene.app_obj, scene.getRelevantButtonsMask());
            // render scene
            scene.render();
        }
        else if (kc===VK_BLUE) {
            // blue button prevents user input for 10 seconds
            rc_utils.setKeyset(scene.app_obj, 0); // this will prevent the app from receiving furher RC button events
            scene.timeout = 10;
            scene.timerTick();
        }
        else if (kc===VK_LEFT) {
            // left button
            scene.lastNavigationButtonPressed = "LEFT";
            // render scene
            scene.render();
        }
        else if (kc===VK_RIGHT) {
            // right button
            scene.lastNavigationButtonPressed = "RIGHT";
            // render scene
            scene.render();
        }
        else if (kc===VK_DOWN) {
            // down button
            scene.lastNavigationButtonPressed = "DOWN";
            // render scene
            scene.render();
        }
        else if (kc===VK_UP) {
            // up button
            scene.lastNavigationButtonPressed = "UP";
            // render scene
            scene.render();
        }
        else if (kc===VK_ENTER) {
            // OK/ENTER button
            scene.lastNavigationButtonPressed = "OK / ENTER";
            // render scene
            scene.render();
        }
        else if (kc===VK_BACK) {
            // BACK button
            scene.lastNavigationButtonPressed = "BACK";
            // render scene
            scene.render();
        }
        else if (kc===VK_PLAY) {
            // PLAY button
            scene.lastPlaybackButtonPressed = "PLAY";
            // render scene
            scene.render();
        }
        else if (kc===VK_PAUSE) {
            // PAUSE button
            scene.lastPlaybackButtonPressed = "PAUSE";
            // render scene
            scene.render();
        }
        else if (kc===VK_PLAY_PAUSE) {
            // PLAY / PAUSE button
            scene.lastPlaybackButtonPressed = "PLAY / PAUSE";
            // render scene
            scene.render();
        }
        else if (kc===VK_STOP) {
            // STOP button
            scene.lastPlaybackButtonPressed = "STOP";
            // render scene
            scene.render();
        }
        else if (kc===VK_FAST_FWD) {
            // FFWD button
            scene.lastPlaybackButtonPressed = "FFWD";
            // render scene
            scene.render();
        }
        else if (kc===VK_REWIND) {
            // RWD button
            scene.lastPlaybackButtonPressed = "RWD";
            // render scene
            scene.render();
        }
        else if (kc===VK_0) {
            // 0 numeric button
            scene.lastNumericButtonPressed = "0";
            // render scene
            scene.render();
        }
        else if (kc===VK_1) {
            // 1 numeric button
            scene.lastNumericButtonPressed = "1";
            // render scene
            scene.render();
        }
        else if (kc===VK_2) {
            // 2 numeric button
            scene.lastNumericButtonPressed = "2";
            // render scene
            scene.render();
        }
        else if (kc===VK_3) {
            // 3 numeric button
            scene.lastNumericButtonPressed = "3";
            // render scene
            scene.render();
        }
        else if (kc===VK_4) {
            // 4 numeric button
            scene.lastNumericButtonPressed = "4";
            // render scene
            scene.render();
        }
        else if (kc===VK_5) {
            // 5 numeric button
            scene.lastNumericButtonPressed = "5";
            // render scene
            scene.render();
        }
        else if (kc===VK_6) {
            // 6 numeric button
            scene.lastNumericButtonPressed = "6";
            // render scene
            scene.render();
        }
        else if (kc===VK_7) {
            // 7 numeric button
            scene.lastNumericButtonPressed = "7";
            // render scene
            scene.render();
        }
        else if (kc===VK_8) {
            // 8 numeric button
            scene.lastNumericButtonPressed = "8";
            // render scene
            scene.render();
        }
        else if (kc===VK_9) {
            // 9 numeric button
            scene.lastNumericButtonPressed = "9";
            // render scene
            scene.render();
        }
    }
    catch (e) {
        console.error("handleKeyCode error" + e);
    }
    // we return true to prevent default action for processed keys
    return true;
}

// app entry function
function start() 
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
            // we have the Application object, and we can initialize the scene and show our app
            scene.initialize(the_app);
            the_app.show();
        }
    }
    catch (e) {
        // this is not an HbbTV client, log the error to console
        console.error("Not a HbbTV client!");
    }
}