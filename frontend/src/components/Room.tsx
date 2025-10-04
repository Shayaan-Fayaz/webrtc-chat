import { useEffect, useState } from "react";

export const Room = ({ name }: { name: string }) => {
//   const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [sendingPc, setSendingPc] = useState<RTCPeerConnection | null>(null);
  const [receivingPc, setReceivingPc] = useState<RTCPeerConnection | null>(null);
  const [senderSocket, setSenderSocket] = useState<WebSocket | null>(null);
//   const [receiverSocket, setReceiverSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setSenderSocket(socket);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "sender",
        })
      );
    };

    return () => {
        socket.close();
    }
  }, []);

  useEffect(() => {
    if(!senderSocket) return;

    const pc = new RTCPeerConnection();
    setReceivingPc(pc);

    senderSocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if(message.type === "createOffer"){
            pc.setRemoteDescription(message.sdp);
            pc.onicecandidate = (event) => {
                if(event.candidate){
                    senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: event.candidate}));
                }
            }

            pc.ontrack = (event) => {
                const receiverVideo = document.getElementById('receiverVideo') as HTMLVideoElement;
                if(receiverVideo){
                    receiverVideo.controls = true;
                    receiverVideo.srcObject = new MediaStream([event.track]);
                    receiverVideo.play();
                }
            };

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            senderSocket.send(JSON.stringify({
                type: "createAnswer",
                sdp: pc.localDescription
            }));
        }else if(message.type === "iceCandidate"){
            pc.addIceCandidate(message.candidate);
        } else if(message.type="createAnswer"){
            sendingPc?.setRemoteDescription(message.sdp);
        }
    }
  }, [senderSocket, sendingPc]);

  useEffect(() => {
    async function startSendingVideo(){
        if(!senderSocket) return;

        const pc = new RTCPeerConnection();
        setSendingPc(pc);

        pc.onnegotiationneeded = async () => {
            console.log("negotitated");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            senderSocket?.send(
                JSON.stringify({
                    type: "createOffer",
                    sdp: pc.localDescription,
                })
            )
        }

        pc.onicecandidate = (event) => {
            if(event.candidate){
                senderSocket.send(
                    JSON.stringify({
                        type: 'iceCandidate',
                        candidate: event.candidate
                    })
                )
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        pc.addTrack(stream.getVideoTracks()[0]);
        const sendingVideo = document.getElementById("senderVideo")! as HTMLVideoElement;
        sendingVideo.controls = true;
        sendingVideo.srcObject = stream;
        sendingVideo.play();
    }
    startSendingVideo();
  }, [senderSocket]);

  return (
    <div>
      <h1>{name}</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ margin: '10px' }}>
          <h2>My Video (Sender)</h2>
          <video id="senderVideo" autoPlay muted style={{ width: '400px' }} />
        </div>
        <div style={{ margin: '10px' }}>
          <h2>Remote Video (Receiver)</h2>
          <video id="receiverVideo" autoPlay style={{ width: '400px' }} />
        </div>
      </div>
    </div>
  );
};
