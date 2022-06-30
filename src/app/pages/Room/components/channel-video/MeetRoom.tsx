import React, { Suspense, lazy, forwardRef } from 'react';
import { Device } from 'mediasoup-client';
import { io, Socket } from 'socket.io-client';
import { API_URL } from 'app/config';
import {
  Avatar,
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react';
import { SocketClient } from 'app/core/contexts/socket-client';
import VideoClientMeet from 'app/components/VideoClientMeet';
import CallingSection from './CallingSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { getToken } from 'app/core/services/storage.service';
import { Prompt, useHistory } from 'react-router-dom';
import { useRoomSlice } from '../../slice';
import { UpdateChannelInfoDialog } from '../ChannelText';
import { useDialog } from 'app/components/Dialog/Dialog';
import { Abc, MoreVert, Videocam } from '@mui/icons-material';
// import { config } from '@app/core/config';

const MODE_STREAM = 'stream';
const MODE_SHARE_SCREEN = 'share_screen';

function MeetRoom({ roomId }) {
  const toast = useToast();
  const localScreen: any = React.useRef();
  const localStreamScreen: any = React.useRef();

  const localVideo: any = React.useRef();
  const localStream: any = React.useRef();
  const clientId: any = React.useRef();
  const device: any = React.useRef();
  const producerTransport: any = React.useRef();
  const videoProducer: any = React.useRef({});
  const audioProducer: any = React.useRef({});
  const consumerTransport: any = React.useRef();
  const videoConsumers: any = React.useRef({});
  const audioConsumers: any = React.useRef({});
  const consumersStream: any = React.useRef({});
  const socketRef: any = React.useRef();

  const [useVideo, setUseVideo] = React.useState(true);
  const [useAudio, setUseAudio] = React.useState(true);
  const [isStartMedia, setIsStartMedia] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [remoteVideos, setRemoteVideos]: any = React.useState({});
  const [isShareScreen, setIsShareScreen] = React.useState(false);

  const localUserInfo = useSelector(
    (state: RootState) => state.authSlice?.data?.user,
  );
  const currentChannelId = useSelector(
    (state: RootState) => state.room?.channelDetail?.id,
  );

  // ============ UI button ==========

  const handleStartScreenShare = () => {
    if (localStreamScreen.current) {
      console.warn('WARN: local media ALREADY started');
      return;
    }

    const mediaDevices: any = navigator.mediaDevices;
    mediaDevices
      .getDisplayMedia({ audio: useAudio, video: useVideo })
      .then((stream: any) => {
        localStreamScreen.current = stream;

        // playVideo(localScreen.current, localStreamScreen.current);
        handleConnectScreenShare();
        setIsShareScreen(true);
        const screenTrack = stream.getTracks()[0];
        screenTrack.onended = function () {
          handleDisconnectScreenShare();
        };
      })
      .catch((err: any) => {
        console.error('media ERROR:', err);
      });
  };

  async function handleConnectScreenShare() {
    if (!localStreamScreen.current) {
      console.warn('WARN: local media NOT READY');
      return;
    }

    // --- get capabilities --
    const data = await sendRequest('getRouterRtpCapabilities', {});
    console.log('getRouterRtpCapabilities:', data);
    await loadDevice(data);

    // --- get transport info ---
    console.log('--- createProducerTransport --');
    const params = await sendRequest('createProducerTransport', {
      mode: MODE_SHARE_SCREEN,
      info: localUserInfo,
    });
    console.log('transport params:', params);
    producerTransport.current = device.current.createSendTransport(params);
    console.log('createSendTransport:', producerTransport.current);

    // --- join & start publish --
    producerTransport.current.on(
      'connect',
      async ({ dtlsParameters }: any, callback: any, errback: any) => {
        console.log('--trasnport connect');
        sendRequest('connectProducerTransport', {
          dtlsParameters: dtlsParameters,
        })
          .then(callback)
          .catch(errback);
      },
    );

    producerTransport.current.on(
      'produce',
      async ({ kind, rtpParameters }: any, callback: any, errback: any) => {
        console.log('--trasnport produce');
        try {
          const { id }: any = await sendRequest('produce', {
            transportId: producerTransport.current.id,
            kind,
            rtpParameters,
            mode: MODE_SHARE_SCREEN,
          });
          callback({ id });
          console.log('--produce requested, then subscribe ---');
          subscribe();
        } catch (err) {
          errback(err);
        }
      },
    );

    producerTransport.current.on('connectionstatechange', (state: any) => {
      switch (state) {
        case 'connecting':
          console.log('publishing...');
          break;

        case 'connected':
          console.log('published');
          //  setIsConnected(true);
          break;

        case 'failed':
          console.log('failed');
          producerTransport.current.close();
          break;

        default:
          break;
      }
    });

    if (useVideo) {
      const videoTrack = localStreamScreen.current.getVideoTracks()[0];
      if (videoTrack) {
        const trackParams = { track: videoTrack };
        videoProducer.current[MODE_SHARE_SCREEN] =
          await producerTransport.current.produce(trackParams);
      }
    }
    if (useAudio) {
      const audioTrack = localStreamScreen.current.getAudioTracks()[0];
      if (audioTrack) {
        const trackParams = { track: audioTrack };
        audioProducer.current[MODE_SHARE_SCREEN] =
          await producerTransport.current.produce(trackParams);
      }
    }
  }

  function handleStopScreenShare() {
    if (localStreamScreen.current) {
      // pauseVideo(localScreen.current);
      stopLocalStream(localStreamScreen.current);
      localStreamScreen.current = null;
      setIsShareScreen(false);
    }
  }
  async function handleDisconnectScreenShare() {
    handleStopScreenShare();
    {
      const producer = videoProducer.current[MODE_SHARE_SCREEN];
      producer?.close();
      delete videoProducer.current[MODE_SHARE_SCREEN];
    }
    {
      const producer = audioProducer.current[MODE_SHARE_SCREEN];
      producer?.close();
      delete audioProducer.current[MODE_SHARE_SCREEN];
    }

    await sendRequest('producerStopShareScreen', {});
  }

  const handleStartMedia = () => {
    if (localStream.current) {
      console.warn('WARN: local media ALREADY started');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: useAudio, video: useVideo })
      .then((stream: any) => {
        localStream.current = stream;
        playVideo(localVideo.current, localStream.current);
        setIsStartMedia(true);
      })
      .catch((err: any) => {
        console.error('media ERROR:', err);
      });
  };

  function handleStopMedia() {
    if (localStream.current) {
      // pauseVideo(localVideo.current);
      stopLocalStream(localStream.current);
      localStream.current = null;
      setIsStartMedia(false);
    }
  }

  function handleDisconnect() {
    handleStopMedia();
    handleStopScreenShare();

    for (const mode in videoProducer.current) {
      const producer = videoProducer.current[mode];
      producer?.close();
      delete videoProducer.current[mode];
    }

    for (const mode in audioProducer.current) {
      const producer = audioProducer.current[mode];
      producer?.close();
      delete audioProducer.current[mode];
    }

    if (producerTransport.current) {
      producerTransport.current.close(); // localStream will stop
      producerTransport.current = null;
    }

    for (const key in videoConsumers.current) {
      for (const key2 in videoConsumers.current[key]) {
        const consumer = videoConsumers.current[key][key2];
        consumer.close();
        delete videoConsumers.current[key][key2];
      }
    }
    for (const key in audioConsumers.current) {
      for (const key2 in audioConsumers.current[key]) {
        const consumer = audioConsumers.current[key][key2];
        consumer.close();
        delete audioConsumers.current[key][key2];
      }
    }

    if (consumersStream.current) {
      consumersStream.current = {};
    }

    if (consumerTransport.current) {
      consumerTransport.current.close();
      consumerTransport.current = null;
    }

    removeAllRemoteVideo();

    disconnectSocket();
    setIsConnected(false);
    setIsLoading(false);
  }

  function playVideo(element: HTMLVideoElement, stream: any) {
    if (element.srcObject) {
      console.warn('element ALREADY playing, so ignore');
      return;
    }
    element.srcObject = stream;
    element.volume = 0;
    return element.play();
  }

  function pauseVideo(element: any) {
    element.pause();
    element.srcObject = null;
  }

  function stopLocalStream(stream: any) {
    let tracks = stream.getTracks();
    if (!tracks) {
      console.warn('NO tracks');
      return;
    }
    console.log('stop user media tracks', tracks);
    tracks.forEach((track: any) => track.stop());
  }

  function addRemoteTrack(id: any, track: any, mode: string, userInfo: any) {
    if (id === clientId.current) {
      return false;
    }

    console.log('addremotetrack');
    console.log(track);

    if (consumersStream.current[id] == undefined) {
      consumersStream.current[id] = {};
    }

    if (consumersStream.current[id][mode] == undefined) {
      const newStream = new MediaStream();
      newStream.addTrack(track);
      consumersStream.current[id][mode] = {
        stream: newStream,
        socket_id: id,
        info: userInfo,
      };
    } else {
      //add audiotrack
      consumersStream.current[id][mode].stream.addTrack(track);
    }

    setRemoteVideos((peers: any) => {
      const newPeers: any = peers;

      return { ...consumersStream.current };
    });
  }

  function addRemoteVideo(id: any) {
    let existElement = findRemoteVideo(id);
    if (existElement) {
      console.warn('remoteVideo element ALREADY exist for id=' + id);
      return existElement;
    }

    let element = document.createElement('video');
    return element;
  }

  function findRemoteVideo(id: any) {
    let element = remoteVideos.current[id];
    return element;
  }

  function removeRemoteVideo(id: any, mode: string) {
    console.log(' ---- removeRemoteVideo() id=' + id);
    if (mode == MODE_STREAM) {
      delete consumersStream.current[id];
    } else {
      delete consumersStream.current[id][mode];
    }

    setRemoteVideos((peers: any) => {
      const newPeers: any = peers;
      delete newPeers[id];

      return { ...consumersStream.current };
    });
    // if (element) {
    //     element.pause();
    //     element.srcObject = null;
    //     remoteContainer.removeChild(element);
    // } else {
    //     console.log('child element NOT FOUND');
    // }
  }

  function removeAllRemoteVideo() {
    console.log(' ---- removeAllRemoteVideo() id');
    consumersStream.current = {};
    setRemoteVideos((peers: any) => {
      const newPeers = {};

      return { ...newPeers };
    });
    // while (remoteContainer.firstChild) {
    //     remoteContainer.firstChild.pause();
    //     remoteContainer.firstChild.srcObject = null;
    //     remoteContainer.removeChild(remoteContainer.firstChild);
    // }
  }

  async function consumeAdd(
    transport: any,
    remoteSocketId: any,
    prdId: any,
    trackKind: any,
    mode: any = MODE_STREAM,
  ) {
    console.log('--start of consumeAdd -- kind=%s', trackKind);
    const { rtpCapabilities } = device.current;
    //const data = await socket.request('consume', { rtpCapabilities });
    const data = await sendRequest('consumeAdd', {
      rtpCapabilities: rtpCapabilities,
      remoteId: remoteSocketId,
      kind: trackKind,
      mode: mode,
    }).catch(err => {
      console.error('consumeAdd ERROR:', err);
    });
    const { producerId, id, kind, rtpParameters, userInfo }: any = data;
    console.log('🚀 ~ file: MeetRoom.tsx ~ line 395 ~ MeetRoom ~ data', data);
    if (prdId && prdId !== producerId) {
      console.warn('producerID NOT MATCH');
    }

    let codecOptions = {};
    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      codecOptions,
      mode,
    });
    //const stream = new MediaStream();
    //stream.addTrack(consumer.track);

    addConsumer(remoteSocketId, consumer, kind, mode);
    consumer.remoteId = remoteSocketId;
    consumer.on('transportclose', () => {
      console.log('--consumer transport closed. remoteId=' + consumer.remoteId);
      //consumer.close();
      //removeConsumer(remoteId);
      //removeRemoteVideo(consumer.remoteId);
    });
    consumer.on('producerclose', () => {
      console.log('--consumer producer closed. remoteId=' + consumer.remoteId);
      consumer.close();
      removeConsumer(consumer.remoteId, kind, mode);
      removeRemoteVideo(consumer.remoteId, mode);
    });
    consumer.on('trackended', () => {
      console.log('--consumer trackended. remoteId=' + consumer.remoteId);
      //consumer.close();
      //removeConsumer(remoteId);
      //removeRemoteVideo(consumer.remoteId);
    });

    console.log('--end of consumeAdd');
    //return stream;

    if (kind === 'video') {
      console.log('--try resumeAdd --');
      sendRequest('resumeAdd', {
        remoteId: remoteSocketId,
        kind: kind,
        mode,
      })
        .then(() => {
          console.log('resumeAdd OK');
        })
        .catch(err => {
          console.error('resumeAdd ERROR:', err);
        });
    }
    return new Promise((resolve: any, reject: any) => {
      addRemoteTrack(remoteSocketId, consumer.track, mode, userInfo);
      resolve();
    });
  }

  async function handleConnect() {
    setIsLoading(true);
    if (!localStream.current) {
      console.warn('WARN: local media NOT READY');
      return;
    }

    // --- connect socket.io ---
    await connectSocket().catch((err: any) => {
      console.error(err);
      return;
    });

    console.log('connected');

    // --- get capabilities --
    const data = await sendRequest('getRouterRtpCapabilities', {});
    console.log('getRouterRtpCapabilities:', data);
    await loadDevice(data);

    // --- get transport info ---
    console.log('--- createProducerTransport --');
    const params: any = await sendRequest('createProducerTransport', {
      mode: MODE_STREAM,
      info: localUserInfo,
    });
    console.log('transport params:', params);
    producerTransport.current = device.current.createSendTransport({
      ...params,
      appData: { ...localUserInfo },
    });
    console.log('createSendTransport:', producerTransport.current);

    // --- join & start publish --
    producerTransport.current.on(
      'connect',
      async ({ dtlsParameters }: any, callback: any, errback: any) => {
        console.log('--trasnport connect');
        sendRequest('connectProducerTransport', {
          dtlsParameters: dtlsParameters,
        })
          .then(callback)
          .catch(errback);
      },
    );

    producerTransport.current.on(
      'produce',
      async ({ kind, rtpParameters }: any, callback: any, errback: any) => {
        console.log('--trasnport produce');
        try {
          const { id }: any = await sendRequest('produce', {
            transportId: producerTransport.current.id,
            kind,
            rtpParameters,
            mode: MODE_STREAM,
            userInfo: localUserInfo,
          });
          callback({ id });
          console.log('--produce requested, then subscribe ---');
          subscribe();
        } catch (err) {
          errback(err);
        }
      },
    );

    producerTransport.current.on('connectionstatechange', (state: any) => {
      switch (state) {
        case 'connecting':
          console.log('publishing...');
          break;

        case 'connected':
          console.log('published');
          setIsConnected(true);
          setIsLoading(false);
          break;

        case 'failed':
          console.log('failed');
          producerTransport.current.close();
          break;

        default:
          break;
      }
    });

    if (useVideo) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        const trackParams = { track: videoTrack };
        videoProducer.current[MODE_STREAM] =
          await producerTransport.current.produce(trackParams);
      }
    }
    if (useAudio) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        const trackParams = { track: audioTrack };
        audioProducer.current[MODE_STREAM] =
          await producerTransport.current.produce(trackParams);
      }
    }
  }

  async function subscribe() {
    // console.log(socketRef.current);
    if (!socketRef.current) {
      await connectSocket().catch((err: any) => {
        console.error(err);
        return;
      });
    }

    // --- get capabilities --
    const data = await sendRequest('getRouterRtpCapabilities', {});
    console.log('getRouterRtpCapabilities:', data);
    await loadDevice(data);
    //  }

    // --- prepare transport ---
    console.log('--- createConsumerTransport --');
    if (!consumerTransport.current) {
      const params = await sendRequest('createConsumerTransport', {});
      console.log('transport params:', params);
      consumerTransport.current = device.current.createRecvTransport(params);
      console.log('createConsumerTransport:', consumerTransport.current);

      // --- join & start publish --
      consumerTransport.current.on(
        'connect',
        async ({ dtlsParameters }: any, callback: any, errback: any) => {
          console.log('--consumer trasnport connect');
          sendRequest('connectConsumerTransport', {
            dtlsParameters: dtlsParameters,
          })
            .then(callback)
            .catch(errback);
        },
      );

      consumerTransport.current.on('connectionstatechange', (state: any) => {
        switch (state) {
          case 'connecting':
            console.log('subscribing...');
            break;

          case 'connected':
            console.log('subscribed');
            sendRequest('getAllMessage', {}).then(data =>
              setMessageList(data as any),
            );
            //consumeCurrentProducers(clientId);
            break;

          case 'failed':
            console.log('failed');
            producerTransport.current.close();
            break;

          default:
            break;
        }
      });

      consumeCurrentProducers(clientId.current);
    }
  }

  async function loadDevice(routerRtpCapabilities: any) {
    try {
      device.current = new Device();
    } catch (error: any) {
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
    }
    await device.current.load({ routerRtpCapabilities });
  }

  function sendRequest(type: any, data: any) {
    return new Promise((resolve: any, reject: any) => {
      socketRef.current.emit(type, data, (err: any, response: any) => {
        if (!err) {
          // Success response, so pass the mediasoup response to the local Room.
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  }

  async function consumeCurrentProducers(clientId: any) {
    console.log('-- try consuleAll() --');
    const remoteInfo: any = await sendRequest('getCurrentProducers', {
      localId: clientId.current,
    }).catch(err => {
      console.error('getCurrentProducers ERROR:', err);
      return;
    });
    //console.log('remoteInfo.producerIds:', remoteInfo.producerIds);
    console.log('remoteInfo.remoteVideoIds:', remoteInfo.remoteVideoIds);
    console.log('remoteInfo.remoteAudioIds:', remoteInfo.remoteAudioIds);
    consumeAll(
      consumerTransport.current,
      remoteInfo.remoteVideoIds,
      remoteInfo.remoteAudioIds,
    );
  }

  function consumeAll(transport: any, remoteVideoIds: any, remotAudioIds: any) {
    console.log('----- consumeAll() -----');

    remoteVideoIds.forEach((rId: any) => {
      consumeAdd(transport, rId, null, 'video', MODE_STREAM).then(
        (resp: any) => {
          consumeAdd(transport, rId, null, 'video', MODE_SHARE_SCREEN);
        },
      );
    });
    let audioIdsCount = 0;
    remotAudioIds.forEach((rId: any) => {
      consumeAdd(transport, rId, null, 'audio', MODE_STREAM).then(
        (resp: any) => {
          consumeAdd(transport, rId, null, 'audio', MODE_SHARE_SCREEN);
        },
      );
    });
  }

  function disconnectSocket() {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      clientId.current = null;
      console.log('socket.io closed..');
    }
  }

  function removeConsumer(id: any, kind: any, mode: string) {
    if (mode == undefined) {
      return false;
    }
    if (kind === 'video') {
      if (mode == MODE_STREAM) {
        delete videoConsumers.current[id];
      } else {
        delete videoConsumers.current[id][mode];
      }

      console.log(
        'videoConsumers count=' + Object.keys(videoConsumers.current).length,
      );
    } else if (kind === 'audio') {
      if (mode == MODE_STREAM) {
        delete audioConsumers.current[id];
      } else {
        delete audioConsumers.current[id][mode];
      }

      console.log(
        'audioConsumers count=' + Object.keys(audioConsumers.current).length,
      );
    } else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
  }

  function addConsumer(id: any, consumer: any, kind: any, mode: any) {
    if (id === clientId.current) {
      return false;
    }
    if (kind === 'video') {
      if (videoConsumers.current[id] == undefined) {
        videoConsumers.current[id] = {};
      }
      videoConsumers.current[id][mode] = consumer;
      console.log(
        'videoConsumers count=' + Object.keys(videoConsumers.current).length,
      );
    } else if (kind === 'audio') {
      if (audioConsumers.current[id] == undefined) {
        audioConsumers.current[id] = {};
      }
      audioConsumers.current[id][mode] = consumer;

      console.log(
        'audioConsumers count=' + Object.keys(audioConsumers.current).length,
      );
    } else {
      console.warn('UNKNOWN consumer kind=' + kind);
    }
  }

  const connectSocket: any = () => {
    console.log(
      'connectSocket conference',
      API_URL + '/video-conference',
      socketRef.current,
    );
    if (socketRef.current == null) {
      if (!currentChannelId) return;
      const socketInit = io(`${API_URL}/video-conference/${currentChannelId}`, {
        transports: ['websocket'],
        auth: {
          token: getToken(),
        },
        autoConnect: false,
      });
      if (socketInit.connected) {
        socketInit.disconnect();
      }
      socketInit.connect();
      socketRef.current = socketInit;
    }

    return new Promise((resolve: any, reject: any) => {
      const socket = socketRef.current;

      socket.on('connect', function (evt: any) {
        console.log('socket.io connected()');
      });
      socket.on('error', function (err: any) {
        console.error('socket.io ERROR:', err);
        reject(err);
      });
      socket.on('message', function (message: any) {
        console.log('socket.io message:', message);
        if (message.type === 'welcome') {
          if (socket.id !== message.id) {
            console.warn(
              'WARN: something wrong with clientID',
              socket.io,
              message.id,
            );
          }

          clientId.current = message.id;
          console.log('connected to server. clientId=' + clientId.current);
          resolve();
        } else {
          console.error('UNKNOWN message from server:', message);
        }
      });
      socket.on('newProducer', function (message: any) {
        console.log('socket.io newProducer:', message);
        const remoteId = message.socketId;
        const prdId = message.producerId;
        const kind = message.kind;
        const mode = message.mode;
        const userInfo = message.userInfo;
        console.log('producer at Server', message.producer);
        console.log('🚀 ~ file: MeetRoom.tsx ~ line 783 ~ userInfo', userInfo);

        if (kind === 'video') {
          console.log(
            '--try consumeAdd remoteId=' +
              remoteId +
              ', prdId=' +
              prdId +
              ', kind=' +
              kind,
          );
          consumeAdd(consumerTransport.current, remoteId, prdId, kind, mode);
        } else if (kind === 'audio') {
          console.log(
            '--try consumeAdd remoteId=' +
              remoteId +
              ', prdId=' +
              prdId +
              ', kind=' +
              kind,
          );
          consumeAdd(consumerTransport.current, remoteId, prdId, kind, mode);
        }
      });

      socket.on('producerClosed', function (message: any) {
        console.log('socket.io producerClosed:', message);
        const localId = message.localId;
        const remoteId = message.remoteId;
        const kind = message.kind;
        const mode = message.mode;
        console.log(
          '--try removeConsumer remoteId=%s, localId=%s, track=%s',
          remoteId,
          localId,
          kind,
        );
        removeConsumer(remoteId, kind, mode);
        removeRemoteVideo(remoteId, mode);
      });

      socket.on('newMessage', data => {
        setMessageList(data);
      });
    });
  };

  const [messageList, setMessageList] = React.useState<any[]>([]);
  const sendMessage = (message) => {
    sendRequest('sendMessage', {
      ...message,
      userInfo: localUserInfo,
    })
      .then(res => {
        setMessageList(res as any);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const [isOnMic, setIsOnMic] = React.useState(useAudio);
  const [isOnCam, setIsOnCam] = React.useState(useVideo);

  const handleMuteVideo = (e: any) => {
    setIsOnCam(!isOnCam);
    localStream.current
      .getVideoTracks()
      .forEach(track => (track.enabled = !isOnCam));
  };
  const handleMuteAudio = (e: any) => {
    setIsOnMic(!isOnMic);
    localStream.current
      .getAudioTracks()
      .forEach(track => (track.enabled = !isOnMic));
  };

  React.useEffect(() => {
    if (!isStartMedia) handleStartMedia();

    return () => {
      console.log('getout');
      handleDisconnect();
    };
  }, []);

  // Channel manage
  const dialog = useDialog();
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const channel = useSelector((state: RootState) => state.room?.channelDetail);
  const isUpdateChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isUpdateChannelSuccess,
  );
  const isRemoveChannelSuccess = useSelector(
    (state: RootState) => state?.room?.isRemoveChannelSuccess,
  );

  const handleChangeName = () => {
    const onChangeName = name => {
      const data = {
        id: roomId,
        name,
      };
      console.log(data);
      dispatch(actions.updateChannel(data));
    };

    dialog.setDialog({
      title: 'Change name',
      content: <UpdateChannelInfoDialog onClose={onChangeName} />,
      onClose: dialog.setDialog(null),
      // size: '2xl',
    });
  };
  const handleRemoveChannel = id => {
    const data = {
      id,
    };
    dispatch(actions.removeChannel(data));
  };
  const menuList = id => [
    {
      title: 'Change channel name',
      func: () => handleChangeName(),
    },
    {
      title: 'Remove channel',
      func: () => handleRemoveChannel(id),
      color: 'red.500',
    },
  ];
  React.useEffect(() => {
    if (isUpdateChannelSuccess) {
      toast({
        title: 'Update channel success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearUpdateChannel());
    }
  }, [isUpdateChannelSuccess]);

  React.useEffect(() => {
    if (isRemoveChannelSuccess) {
      console.log('removed');
      toast({
        title: 'Remove channel success',
        status: 'success',
        duration: 2000,
      });
      history.replace(`/rooms/${currentRoom.id}`);
      dispatch(actions.clearRemoveChannel());
    }
  }, [isRemoveChannelSuccess]);

  const userScreenShare = navigator.mediaDevices.addEventListener(
    'devicechange',
    e => {
      console.log('devicechange', e);
    },
  );
  const channelTypeIcon = {
    text: Abc,
    video: Videocam,
  };

  return (
    <Box display="flex" height="full" flexDir="column">
      <Prompt
        when={isConnected}
        message={(location, action) => {
          console.log(location, action);
          console.log(isConnected);
          return '`Are you sure you want to quit meeting?`';
        }}
      />
      {!isConnected ? (
        <>
          <Box
            width="100%"
            backgroundColor="white"
            p={3}
            display="flex"
            justifyContent="space-between"
          >
            <Box display="flex">
              <Icon
                as={channelTypeIcon[channel?.type]}
                color="gray.500"
                mr={2}
              />
              <Text fontWeight="bold">{channel?.name}</Text>
            </Box>
            <Menu>
              <MenuButton aria-label="Classroom options">
                <Icon as={MoreVert} color="gray.500" />
              </MenuButton>
              <MenuList>
                {menuList(roomId).map(item => (
                  <MenuItem
                    key={item.title}
                    onClick={item.func}
                    color={item.color}
                  >
                    {item.title}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
          <Box display="flex" justifyContent="center" height="full">
            <Box pt={'32'}>
              <video
                ref={localVideo}
                autoPlay
                muted
                style={{
                  width: '500px',
                  height: '400px',
                  borderRadius: '5px',
                  objectFit: 'cover',
                }}
              >
                <Box backgroundColor="gray.600">
                  <Avatar name="Hieu" />
                </Box>
              </video>
              <Box
                bgColor={'white'}
                color="gray.500"
                p={2}
                px={4}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderRadius={4}
              >
                <Box display="flex" alignItems="center" flexDir="column">
                  <Switch
                    colorScheme="purple"
                    onChange={handleMuteVideo}
                    isChecked={isOnCam}
                  />
                  <label>Video</label>
                </Box>
                <Box ml={2} display="flex" alignItems="center" flexDir="column">
                  <Switch
                    colorScheme="purple"
                    onChange={handleMuteAudio}
                    isChecked={isOnMic}
                  />
                  <label>Audio</label>
                </Box>
                <Button
                  ml={3}
                  colorScheme="purple"
                  isFullWidth={true}
                  disabled={isConnected || !isStartMedia}
                  onClick={handleConnect}
                  isLoading={isLoading}
                >
                  Join
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <CallingSection
          localVideoStream={localStream}
          isOnCam={isOnCam}
          isOnMic={isOnMic}
          handleToggleCamera={handleMuteVideo}
          handleToggleMic={handleMuteAudio}
          localScreenStream={localStreamScreen}
          isStartStream={isStartMedia}
          isShareScreen={isShareScreen}
          handleStartScreenShare={handleStartScreenShare}
          handleStopScreenShare={handleDisconnectScreenShare}
          remoteVideos={remoteVideos}
          playVideo={playVideo}
          handleEndCall={handleDisconnect}
          sendMsgCallBack={sendMessage}
          messageList={messageList}
          isConnected={isConnected}
        />
      )}
    </Box>
  );
}

export default MeetRoom;
