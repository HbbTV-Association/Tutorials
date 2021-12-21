var broadcast_object = {
    video_obj: null,
    current_live_channel: null,
    initialize: function(){
        broadcast_object.video_obj = document.getElementById("video");
        broadcast_object.video_obj.addEventListener('PlayStateChange', broadcast_object.playStateChangeEventHandler);
        try {
            broadcast_object.video_obj.bindToCurrentChannel();
            broadcast_object.video_obj.setFullScreen(false);
            broadcast_object.current_live_channel = broadcast_object.video_obj.currentChannel;
            return true;
        } catch (error) {
            broadcast_object.current_live_channel = null;
            return false;
        }
    },
    getChannelList: function() {
        try {
            return broadcast_object.video_obj.getChannelConfig().channelList;
        } catch (error) {
            return null;
        }
    },
    getChannelInfo: function(ch) {
        var retval = "" + ch.name + " (" + ch.onid + "," + ch.tsid + "," + ch.sid + ")";
        return retval;
    },
    playStateChangeEventHandler: function () {
        switch (broadcast_object.video_obj.playState) {
            case 0:	// unrealized
                document.getElementById('playState_field').innerHTML = "Unrealized";
                break;
            case 1:	// connecting
                document.getElementById('playState_field').innerHTML = "Connecting";
                break;
            case 2:	// presenting
                document.getElementById('playState_field').innerHTML = "Presenting";
                break;
            case 3:	// stopped
                document.getElementById('playState_field').innerHTML = "Stopped";
                break;
            default:
                document.getElementById('playState_field').innerHTML = "Error";
        }
    }    
};

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
            var i, li, available_channels;
            // we have the Application object, and we proceed with broadcast_object initialization
            if (broadcast_object.initialize()) {
                // initialization OK, so display message and current channel
                document.getElementById('inititalization_field').innerHTML = "Success";
                if (broadcast_object.current_live_channel !== null) {
                    document.getElementById('currentChannel_field').innerHTML = "" + broadcast_object.getChannelInfo(broadcast_object.current_live_channel);
                }
                else {
                    document.getElementById('currentChannel_field').innerHTML = "null"; 
                }
                // get available channels
                available_channels = broadcast_object.getChannelList();
                // append channels to list
                try {
                    if (available_channels.length > 0) {
                        for (i = 0; i < available_channels.length; i++) {
                            li = document.createElement('li');
                            li.innerHTML = broadcast_object.getChannelInfo(available_channels.item(i));
                            document.getElementById('channelList_field').appendChild(li);
                        }
                    }
                    else {
                        throw "No channels in list";
                    }
                }
                catch (channel_error) {
                    console.error("channel_error: " + channel_error);
                    li = document.createElement('li');
                    li.innerHTML = "channel_error: " + channel_error;
                    document.getElementById('channelList_field').appendChild(li);
                }
            }
            else {
                // initialization not OK, so show the message
                document.getElementById('inititalization_field').innerHTML = "Failure";
            }
            // show our app
            the_app.show();
        }
    }
    catch (e) {
        // this is not an HbbTV client, log the error to console
        console.error("Not a HbbTV client!");
    }
}