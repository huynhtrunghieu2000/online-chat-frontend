import * as mediasoupClient from 'mediasoup-client';
import {
  Consumer,
  Device,
  Producer,
  RtpCapabilities,
  Transport,
} from 'mediasoup-client/lib/types';

import io from 'socket.io-client';
import { SocketClient } from './socket-client';

let device: Device;
let rtpCapabilities: RtpCapabilities;
let producerTransport: Transport;
let consumerTransports: any[] = [];
let audioProducer: Producer;
let videoProducer: Producer;
let localStream: MediaStream;
let otherStream: any[] = [];
let params = {
  // mediasoup params
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

let audioParams;
let videoParams: any = { params };
let consumingTransports: any[] = [];
export const VideoCallContainer = () => {};
export const useMediaSoup = () => {
  // Input: user video stream
  // Output: list client video stream[], join room function,
  const socket = SocketClient.getInstance().Socket || new SocketClient().Socket;

  const getLocalVideoStream = () => localStream;
  const getListVideoStream = () => otherStream;

  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerOptions
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce

  const streamSuccess = (stream: MediaStream) => {
    // 2
    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    // joinRoom();
  };

  const joinRoom = channel => {
    //3
    socket.emit('joinRoom', { channel }, data => {
      console.log(`Router RTP Capabilities... ${data.rtpCapabilities}`);
      // we assign to local variable and will be used when
      // loading the client Device (see createDevice above)
      rtpCapabilities = data.rtpCapabilities;

      // once we have rtpCapabilities from the Router, create Device
      createDevice();
    });
  };

  // A device is an endpoint connecting to a Router on the
  // server side to send/recive media
  const createDevice = async () => {
    // 4
    try {
      device = new mediasoupClient.Device();
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities,
      });

      console.log('Device RTP Capabilities', device.rtpCapabilities);

      // once the device loads, create transport
      createSendTransport();
    } catch (error: any) {
      console.log(error);
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported');
    }
  };

  const createSendTransport = () => {
    // 5
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit('createWebRtcTransport', { consumer: false }, ({ params }) => {
      // The server sends back params needed
      // to create Send Transport on the client side
      if (params.error) {
        console.log(params.error);
        return;
      }

      console.log(params);

      // creates a new WebRTC Transport to send media
      // based on the server's producer transport params
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      producerTransport = device.createSendTransport(params);
      // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
      // this event is raised when a first call to transport.produce() is made
      // see connectSendTransport() below
      producerTransport.on(
        'connect',
        async ({ dtlsParameters }, callback, errback) => {
          try {
            // Signal local DTLS parameters to the server side transport
            // see server's socket.on('transport-connect', ...)
            await socket.emit('transport-connect', {
              dtlsParameters,
            });

            // Tell the transport that parameters were transmitted.
            callback();
          } catch (error) {
            errback(error);
          }
        },
      );

      producerTransport.on('produce', async (parameters, callback, errback) => {
        try {
          // tell the server to create a Producer
          // with the following parameters and produce
          // and expect back a server side producer id
          // see server's socket.on('transport-produce', ...)
          await socket.emit(
            'transport-produce',
            {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
            },
            ({ id, producersExist }) => {
              // Tell the transport that parameters were transmitted and provide it with the
              // server side producer's id.
              callback({ id });

              // if producers exist, then join room
              if (producersExist) getProducers();
            },
          );
        } catch (error) {
          errback(error);
        }
      });

      connectSendTransport();
    });
  };

  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above

    audioProducer = await producerTransport.produce(audioParams);
    videoProducer = await producerTransport.produce(videoParams);

    audioProducer.on('trackended', () => {
      console.log('audio track ended');

      // close audio track
    });

    audioProducer.on('transportclose', () => {
      console.log('audio transport ended');

      // close audio track
    });

    videoProducer.on('trackended', () => {
      console.log('video track ended');

      // close video track
    });

    videoProducer.on('transportclose', () => {
      console.log('video transport ended');

      // close video track
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: number) => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    await socket.emit(
      'createWebRtcTransport',
      { consumer: true },
      ({ params }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log(`PARAMS... ${params}`);

        let consumerTransport;
        try {
          console.log('checkdevice', device);
          consumerTransport = device.createRecvTransport(params);
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.
          console.log(error);
          return;
        }

        consumerTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socket.on('transport-recv-connect', ...)
              await socket.emit('transport-recv-connect', {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error);
            }
          },
        );

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      },
    );
  };

  // server informs the client of a new producer just joined
  socket.on('new-producer', ({ producerId }) =>
    signalNewConsumerTransport(producerId),
  );

  const getProducers = () => {
    socket.emit('getProducers', producerIds => {
      console.log(producerIds);
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport);
    });
  };

  const connectRecvTransport = async (
    consumerTransport: Transport,
    remoteProducerId,
    serverConsumerTransportId,
  ) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
    await socket.emit(
      'consume',
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
          console.log('Cannot Consume');
          return;
        }

        console.log(`Consumer Params ${params}`);
        // then consume with the local consumer transport
        // which creates a consumer
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });
        console.log(consumerTransports);
        consumerTransports = [
          ...consumerTransports,
          {
            ...consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];
        // destructure and retrieve the video track from the producer
        const { track } = consumer;
        otherStream.push({
          id: remoteProducerId,
          kind: params.kind,
          track: new MediaStream([track]),
        });

        // the server consumer started with media paused
        // so we need to inform the server to resume
        socket.emit('consumer-resume', {
          serverConsumerId: params.serverConsumerId,
        });
      },
    );
  };

  socket.on('producer-closed', ({ remoteProducerId }) => {
    // server notification is received when a producer is closed
    // we need to close the client-side consumer and associated transport
    const producerToClose = consumerTransports.find(
      transportData => transportData.producerId === remoteProducerId,
    );
    producerToClose.consumerTransport.close();
    producerToClose.consumer.close();

    // remove the consumer transport from the list
    consumerTransports = consumerTransports.filter(
      transportData => transportData.producerId !== remoteProducerId,
    );
    otherStream.filter(stream => stream.id !== remoteProducerId);
    // remove the video div element
    // listVideoElement.filter(element => element.id !== `td-${remoteProducerId}`);
  });
  return { getLocalVideoStream, getListVideoStream, streamSuccess, joinRoom };
};
