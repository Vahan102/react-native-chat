import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const TOKEN = "YOUR_TOKEN"; 
const LINK = "YOUR_LINK_ID";
const WS_URL = "ws://192.168.123.3:3027"; 

const HTML = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <style>
        :root { --bg: #2f3136; --panel: #202225; --accent: #7289da; --danger: #f04747; --muted: #b9bbbe; }
        body { margin: 0; background: var(--bg); color: white; font-family: system-ui; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        .video-area { flex: 1; position: relative; background: #000; display: flex; justify-content: center; align-items: center; }
        video { width: 100%; height: 100%; object-fit: cover; }
        #remoteVideo { width: 100%; height: 100%; }
        #myVideo { position: absolute; top: 20px; right: 20px; width: 100px; height: 140px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.2); z-index: 10; background: #333; object-fit: cover; }
        .controls { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); display: flex; gap: 15px; padding: 12px 20px; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .btn { width: 50px; height: 50px; border-radius: 14px; border: none; background: rgba(255,255,255,0.1); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn:active { transform: scale(0.95); }
        .btn.danger { background: var(--danger); }
        .btn.active { background: var(--accent); }
        .btn svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    </style>
</head>
<body>
    <div class="video-area">
        <video id="remoteVideo" autoplay playsinline></video>
        <video id="myVideo" autoplay muted playsinline></video>
    </div>
    <div class="controls">
        <button class="btn active" id="micBtn"><svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>
        <button class="btn active" id="camBtn"><svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></button>
        <button class="btn danger" id="hangBtn"><svg viewBox="0 0 24 24"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/></svg></button>
    </div>
    <script>
        const TOKEN = "${TOKEN}";
        const LINK = "${LINK}";
        const WS_URL = "${WS_URL}/ws/add?token=" + TOKEN;
        let pc, socket, localStream; let isMicOn=true, isCamOn=true;
        
        async function start() {
            try { localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); document.getElementById('myVideo').srcObject = localStream; connectSocket(); } 
            catch (e) { console.error(e); }
        }
        function connectSocket() {
            socket = new WebSocket(WS_URL);
            socket.onopen = () => { setTimeout(initiateCall, 2000); };
            socket.onmessage = async (e) => {
                const msg = JSON.parse(e.data);
                if (!pc) createPC();
                if (msg.type === "offerForSPD") {
                    if (pc.signalingState !== "stable") await pc.setLocalDescription({type:"rollback"});
                    await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    send({type:"sendSPD", type2:"sendSPD", link:LINK, sdp:answer});
                } else if (msg.type === "answerForSPD") {
                    if (pc.signalingState !== "stable") await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
                } else if (msg.type === "iceCandidateFromServer" && msg.candidate) {
                    await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
                }
            };
        }
        function createPC() {
            pc = new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});
            localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
            pc.ontrack = e => document.getElementById('remoteVideo').srcObject = e.streams[0];
            pc.onicecandidate = e => { if(e.candidate) send({type:"sendSPD", type2:"iceCandidateFromClient", link:LINK, candidate:e.candidate}); };
        }
        async function initiateCall() {
            if (!pc) createPC();
            if (pc.signalingState === "stable") {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                send({type:"sendSPD", type2:"sendSPD", link:LINK, sdp:offer});
            }
        }
        function send(d) { socket.send(JSON.stringify(d)); }
        document.getElementById('micBtn').onclick = (e) => { isMicOn=!isMicOn; localStream.getAudioTracks().forEach(t=>t.enabled=isMicOn); e.currentTarget.classList.toggle('active', isMicOn); };
        document.getElementById('camBtn').onclick = (e) => { isCamOn=!isCamOn; localStream.getVideoTracks().forEach(t=>t.enabled=isCamOn); e.currentTarget.classList.toggle('active', isCamOn); };
        document.getElementById('hangBtn').onclick = () => { 
            if(pc) pc.close(); if(socket) socket.close(); if(localStream) localStream.getTracks().forEach(t=>t.stop()); 
            document.body.innerHTML = "<h1 style='color:white;text-align:center;margin-top:50%'>Call Ended</h1>";
            window.ReactNativeWebView.postMessage("HANGUP"); 
        };
        start();
    </script>
</body>
</html>
`;

export default function CallScreen(props: any) {
    

    const handleMessage = (event: any) => {
        if (event.nativeEvent.data === "HANGUP") {
            console.log("Call ended inside WebView");
            
            if (props && props.navigation && typeof props.navigation.goBack === 'function') {
                props.navigation.goBack();
            } else if (props && typeof props.onClose === 'function') {
                props.onClose(); 
            } else {
                Alert.alert("Call Ended", "You can now close this screen.");
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2f3136" />
            <WebView
                originWhitelist={['*']}
                source={{ html: HTML }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                onMessage={handleMessage}
                renderLoading={() => <View style={styles.loader}><ActivityIndicator size="large" color="#7289da" /></View>}
                startInLoadingState={true}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2f3136' },
    webview: { flex: 1, backgroundColor: '#2f3136' },
    loader: { ...StyleSheet.absoluteFillObject, backgroundColor: '#2f3136', justifyContent: 'center', alignItems: 'center' }
});