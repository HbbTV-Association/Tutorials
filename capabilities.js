// app entry function
//const VK_UP = 38;    // Up arrow key
//const VK_DOWN = 40;  // Down arrow key

function appInit() {
    try {
        // attempt to acquire the Application object
        var appManager = document.getElementById('applicationManager');
        var appObject = appManager.getOwnerApplication(document);
        // check if Application object was a success
        if (appObject === null) {
            // error acquiring the Application object!
        }
        else {
            // we have the Application object, and we can show our app
            appObject.show();
            const keyset = appObject.privateData.keyset;
            if (keyset.NAVIGATION) {
                keyset.setValue(keyset.RED || keyset.GREEN || keyset.YELLOW || keyset.BLUE || keyset.NAVIGATION || keyset.VCR || keyset.NUMERIC);
            } else {
                keyset.setValue(0x13F);
            }
            keyset.setValue(0x13F);
        }
    }
    catch (e) {
        // this is not an HbbTV client, catch the error.
        return;
    }

    document.addEventListener('keydown', function (event) {
        document.getElementById("keyBox").textContent = `keyCode: ${event.keyCode}\ncode: ${event.code} key: ${event.key}`;
        const textBox = document.getElementById('textBox');
        const scrollStep = 20; // Pixels to scroll per key press

        switch (event.keyCode) {
            case VK_UP:   // Scroll up on UP arrow key
                // document.getElementById("hbbtv-version").innerText = "UP";
                textBox.scrollTop = Math.max(0, textBox.scrollTop - scrollStep);
                event.preventDefault();
                break;
            case VK_DOWN: // Scroll down on DOWN arrow key
                //  document.getElementById("hbbtv-version").innerText = "DOWN";
                textBox.scrollTop = Math.min(
                    textBox.scrollHeight - textBox.clientHeight,
                    textBox.scrollTop + scrollStep
                );
                event.preventDefault();
                break;
            default:
                break;
        }
    });
    showHbbTVVersion(getHbbTVVersion());
    checkKeyset();
    checkCapabilities();
    checkConfiguration();
    checkDebug();
    checkMediaSwitcher();

}
function getHbbTVVersion() {

    // fetch the user agent string from the navigator object
    const userAgent = navigator.userAgent;
    // find the version number within the user agent string 
    const hbbtvVersion = userAgent.match(/HbbTV\/([0-9.]+)/);

    if (hbbtvVersion && hbbtvVersion[1]) {
        return hbbtvVersion[1];
    } else {
        return null;
    }

}
function isVersionGreaterOrEqual(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (var i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        var v1 = v1Parts[i] || 0;
        var v2 = v2Parts[i] || 0;
        if (v1 > v2) return true;
        if (v1 < v2) return false;
    }
    return true; // If all parts are equal, return true
}
function checkKeyset() {
    const appManager = document.getElementById('applicationManager');
    const appObject = appManager.getOwnerApplication(document);
    const keyset = appObject.privateData.keyset;

    let output = "";
    try {
        output = "Value: " + keyset.value;
        console.log("Value: ", keyset.value);
        output = output + "\nNAVIGATION: " + keyset.NAVIGATION;
        output = output + "\nVCR: " + keyset.VCR;
        output = output + "\notherKeys: " + keyset.otherKeys;
        console.log("otherKeys: ", keyset.otherKeys);
        output = output + "\nmaximumValue: " + keyset.maximumValue;
        console.log("maximumValue: ", keyset.maximumValue);
        output = output + "\nmaximumOtherKeys: " + keyset.maximumOtherKeys;
        console.log("maximumOtherKeys: ", keyset.maximumOtherKeys);
        output = output + "\nsupportsPointer: " + keyset.supportsPointer;
        console.log("supportsPointer: ", keyset.supportsPointer);

    }
    catch (e) {
        console.log("Error: ", e);
        output = "Keyset not supported";
    }
    document.getElementById("keyset-field").innerText = output;

}
function checkCapabilities() {

    let output = "";
    try {
        const capabilities = document.getElementById('capabilities');

        document.getElementById("capabilities-xml").innerText = new XMLSerializer().serializeToString(capabilities.xmlCapabilities);;

        output = "extraSDVideoDecodes: " + capabilities?.extraSDVideoDecodes;
        console.log("extraSDVideoDecodes", capabilities?.extraSDVideoDecodes);
        // debug("extraSDVideoDecodes: " + capabilities.extraSDVideoDecodes);
        output = output + "\nextraHDVideoDecodes: " + capabilities?.extraHDVideoDecodes;
        console.log("extraHDVideoDecodes", capabilities?.extraHDVideoDecodes);
        output = output + "\nextraUHDVideoDecodes: " + capabilities?.extraUHDVideoDecodes;
        console.log("extraUHDVideoDecodes", capabilities?.extraUHDVideoDecodes);

        for (let i = 1; i <= capabilities?.extraSDVideoDecodes; i++) {
            try {
                output = output + "\nBroadcast Capabilities " + i + ": " + JSON.stringify(capabilities.broadcastCapabilities(i));
            }
            catch (e) {
                console.log("Error: ", e);
                output = output + "\nBroadcast Capabilities not supported";
                break;
            }
        }
        for (let i = 1; i <= capabilities?.extraSDVideoDecodes; i++) {
            try {
                output = output + "\nBroadband Capabilities " + i + ": " + JSON.stringify(capabilities.broadbandCapabilities(i));
            }
            catch (e) {
                console.log("Error: ", e);
                output = output + "\nBroadband Capabilities not supported";
                break;
            }
        }

        const DLCap = capabilities.hasCapability('+DL');
        output = output + "\nDL Capability: " + DLCap;
        const PVRCap = capabilities.hasCapability('+PVR');
        output = output + "\nPVR Capability: " + PVRCap;
        const DRMCap = capabilities.hasCapability('+DRM');
        output = output + "\nDRM Capability: " + DRMCap;
        const IPCCap = capabilities.hasCapability('+IPC');
        output = output + "\nIPC Capability: " + IPCCap;
        const AFSCap = capabilities.hasCapability('+AFS');
        output = output + "\nAFS Capability: " + AFSCap;

        // let jsonCapabilities = xmlToJson(capabilities.xmlCapabilities);
        // output = output + "\n" + JSON.stringify(jsonCapabilities);
        console.log("Capabilities:", capabilities.xmlCapabilities);
        // output = output + "\n" + new XMLSerializer().serializeToString(capabilities.xmlCapabilities);
        // const serializedXML = new XMLSerializer().serializeToString(capabilities.xmlCapabilities);
        // const parser = new DOMParser();
        // const xmlDoc = parser.parseFromString(serializedXML, "text/xml");
        // console.log("XML Document:", xmlDoc);
        // const profileList = capabilities.xmlCapabilities.getElementsByTagName("profilelist");
        const uiProfiles = capabilities.xmlCapabilities.getElementsByTagName("ui_profile");
        for (let uiProfile of uiProfiles) {
            console.log("UI Profile Name: ", uiProfile.getAttribute("name"));
            output = output + "\nUI Profile: ";
            const uiComponents = uiProfile.getAttribute("name").split("+");
            for (let uiComponent of uiComponents) {
                output = output + ", " + uiComponent;
            }
            const uiProfileExts = uiProfile.getElementsByTagName("ext");
            for (let uiProfileExt of uiProfileExts) {
                for (let node of uiProfileExt.childNodes) {

                    output = output + "\nUI Profile Ext: " + node?.nodeName + " : " + node?.childNodes[0]?.nodeValue;
                    if (node?.attributes?.length > 0) {
                        for (let attr of node.attributes) {
                            output = output + " " + attr?.name + ": " + attr?.value + ",";
                        }
                    }
                }
            }
        }
        // Audio Profiles
        const audioProfiles = capabilities.xmlCapabilities.getElementsByTagName("audio_profile");
        for (let profile of audioProfiles) {
            output = output + "\nAudio Profile Name: ";
            for (let attr of profile.attributes) {
                output = output + " " + attr.name + ": " + attr.value + ",";
            }
        }
        //Video Profiles
        const videoProfiles = capabilities.xmlCapabilities.getElementsByTagName("video_profile");
        for (let profile of videoProfiles) {
            output = output + "\nVideo Profile Name:"
            for (let attr of profile.attributes) {
                output = output + " " + attr.name + ": " + attr.value + ',';
            }
        }
        const html5Medias = capabilities.xmlCapabilities.getElementsByTagName("html5_media");
        for (let html5Media of html5Medias) {
            console.log("HTML5 Media: ", html5Media.childNodes[0].nodeValue);
            output = output + "\nHTML5 Media: " + html5Media.childNodes[0].nodeValue;
        }
        const videoDisplayFormats = capabilities.xmlCapabilities.getElementsByTagName("video_display_format");
        for (let profile of videoDisplayFormats) {
            output = output + "\nVideo Display Format: ";
            for (let attr of profile.attributes) {
                output = output + " " + attr.name + ": " + attr.value + ',';
            }
        }
        // Cookies
        output = output + "\nCookies Enabled: ", navigator.cookieEnabled;
        document.getElementById("capabilities-field").innerText = output;
        return true;
    }
    catch (e) {
        output = output + "ERROR: " + e;
        console.log("Error", e)
        document.getElementById("capabilities-field").innerText = output;
        return false;
    }
}
function checkConfiguration() {
    let output = "";
    try {
        const configObj = document.getElementById('configuration').configuration;
        console.log("ConfigObj:", configObj);
        if (configObj) {
            output = output + "\nPreffered Audio Language: " + configObj?.preferredAudioLanguage;
            output = output + "\nPreffered Subtitle Language: " + configObj?.preferredSubtitleLanguage;
            output = output + "\nPreffered UI Language: " + configObj?.preferredUILanguage;
            output = output + "\nCountry ID: " + configObj?.countryId;
            output = output + "\nSubtitles Enabled: " + configObj?.subtitlesEnabled;
            // timeShiftSynchronized
            output = output + "\nTime Shift Synchronized: " + configObj?.timeShiftSynchronized;
            // audioDescriptionEnabled
            output = output + "\nAudio Description Enabled: " + configObj?.audioDescriptionEnabled;
            // dtt_network_ids
            output = output + "\nDTT Network IDs: " + configObj?.dtt_network_ids[0];
            // deviceId
            document.getElementById("configuration-field").innerText = output;
            console.log("output:", output);

        }
    }
    catch (e) {
        console.log("Error", e)
        document.getElementById("configuration-field").innerText = "Tests failed";

    }
    try {
        const configObj = document.getElementById('configuration').configuration;
        output = "Device ID: " + configObj?.deviceId;
        document.getElementById("identifier-field").innerText = output;
        if (configObj.deviceId.startsWith("#")) {
            if (configObj.deviceId === "#1") {
                configObj.requestAccessToDistinctiveIdentifier(identifierCallBack)
            }
        }
        console.log("output:", output);
    }
    catch (e) {
        console.log("Error", e)
        // document.getElementById("identifier-field").innerText = "Tests failed";
        return false;
    }
}
function checkDebug() {
    let output = "";
    try {
        const capabilities = document.getElementById('capabilities');
        debug(new XMLSerializer().serializeToString(capabilities.xmlCapabilities));
        document.getElementById("debug-test").innerText = "Debug successful";
        return true;
    }
    catch (e) {
        document.getElementById("debug-test").innerText = "Debug failed";
        console.log("Error", e)
        return false;
    }
}
function checkMediaSwitcher() {

    try {
        const mediaSwitcher = document.getElementById('mediaSwitcher');
        console.log("MediaSwitcher:", mediaSwitcher);
        if (typeof mediaSwitcher.switchMediaPresentation === 'function') {
            document.getElementById("media-switcher").innerText = "switchMediaPresentation exists";
        } else {
            document.getElementById("media-switcher").innerText = "switchMediaPresentation does not exist";
        }
    }
    catch (e) {
        console.log("Error", e)
        document.getElementById("media-switcher").innerText = "Tests failed";
        return false;
    }
}
function identifierCallBack(result) {
    console.log("Identifier Result:", result, document.getElementById('configuration').configuration.deviceId);
    document.getElementById("identifier-field").innerText = "Identifier: " + document.getElementById('configuration').configuration.deviceId;
}

function showHbbTVVersion(hbbtvVersion) {
    if (hbbtvVersion) {
        document.getElementById("hbbtv-version").innerText = "HbbTV Version: " + hbbtvVersion;
    } else {
        console.log("HbbTV Version not found in user agent.");
        document.getElementById("hbbtv-version").innerText = "HbbTV Version not found.";
    }
}

function xmlToJson(xml) {
    const obj = {};
    if (xml.nodeType === 1) { // element
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let j = 0; j < xml.attributes.length; j++) {
                const attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === 3) { // text
        obj["_text"] = xml.nodeValue;
    }

    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i);
            const nodeName = item.nodeName;
            if (typeof (obj[nodeName]) === "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) === "undefined") {
                    const old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}