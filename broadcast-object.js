var broadcastObject = {
    videoObj: null,
    currentLiveChannel: null,
    initialize: function(){
        broadcastObject.videoObj = document.getElementById('broadcastVideo');
        broadcastObject.videoObj.addEventListener('PlayStateChange', broadcastObject.playStateChangeEventHandler);
        try {
            broadcastObject.videoObj.bindToCurrentChannel();
            broadcastObject.videoObj.setFullScreen(false);
            broadcastObject.currentLiveChannel = broadcastObject.videoObj.currentChannel;
            return true;
        } catch (error) {
            broadcastObject.currentLiveChannel = null;
            return false;
        }
    },
    getChannelList: function() {
        try {
            return broadcastObject.videoObj.getChannelConfig().channelList;
        } catch (error) {
            return null;
        }
    },
    getChannelInfo: function(ch) {
        var channelInfo = '' + ch.name +  '(' + ch.onid + ',' + ch.tsid + ',' + ch.sid + ')';
        return channelInfo;
    },
    playStateChangeEventHandler: function () {
        var playStateField = document.getElementById('playState_field');
        switch (broadcastObject.videoObj.playState) {
            case 0:	// unrealized
                playStateField.innerHTML = 'Unrealized';
                break;
            case 1:	// connecting
                playStateField.innerHTML = 'Connecting';
                break;
            case 2:	// presenting
                playStateField.innerHTML = 'Presenting';
                break;
            case 3:	// stopped
                playStateField.innerHTML = 'Stopped';
                break;
            default:
                playStateField.innerHTML = 'Error';
        }
    }    
};

// app entry function
function start() 
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
            var i, li, availableChannels;
            // we have the Application object, and we proceed with broadcast_object initialization
            if (broadcastObject.initialize()) {
                // initialization OK, so display message and current channel
                document.getElementById('inititalization_field').innerHTML = 'Success';
                if (broadcastObject.currentLiveChannel !== null) {
                    document.getElementById('currentChannel_field').innerHTML = broadcastObject.getChannelInfo(broadcastObject.currentLiveChannel);
                }
                else {
                    document.getElementById('currentChannel_field').innerHTML = 'null'; 
                }
                // get available channels
                availableChannels = broadcastObject.getChannelList();
                // append channels to list
                try {
                    if (availableChannels.length > 0) {
                        for (i = 0; i < availableChannels.length; i++) {
                            li = document.createElement('li');
                            li.innerHTML = broadcastObject.getChannelInfo(availableChannels.item(i));
                            document.getElementById('channelList_field').appendChild(li);
                        }
                    }
                    else {
                        throw 'No channels in list';
                    }
                }
                catch (channelError) {
                    console.error('channel_error: ' + channelError);
                    li = document.createElement('li');
                    li.innerHTML = 'channel_error: ' + channelError;
                    document.getElementById('channelList_field').appendChild(li);
                }
            }
            else {
                // initialization not OK, so show the message
                document.getElementById('inititalization_field').innerHTML = 'Failure';
            }
            // show our app
            appObject.show();
        }
    }
    catch (e) {
        // this is not an HbbTV client, log the error to console
        console.error('Not a HbbTV client!');
    }
}