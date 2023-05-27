<p align="center">
  <img src="https://github.com/huynhtrunghieu2000/video-conference-frontend/assets/27915489/e220a98c-ac31-4f89-8b1d-a2eec5aae8d7"/>
  <h1 align="center">Online Chat App</h1>
</p>


# Information

**Project Name:** Online Chat App - Final Project Of University

**Author:** Huynh Trung Hieu

This is front-end repository, and associate with back-end from this repo: [huynhtrunghieu2000/video-conference-backend](https://github.com/huynhtrunghieu2000/video-conference-backend)


# Features

## Featured features
- Two person/Group real-time text messages 💬
- Send files, images, video through chat
- Video chat between group
- Schedule meeting in-app for chatroom
- Personal information management

## Chatroom
Each user after success login can be create own Chatroom
- Create chatroom
- Edit chatroom information
- Delete chatroom
- User role in management in chatroom with 2 role: Admin, Member
## Channel
Each chatroom will also have separated channel, Admin of chatroom can manage that channels:
- Create channel with either **text message based** channel or **video based** channel
- Edit channel name
- Delete channel
## Text message based channel
After joining text-based channel, people in a channel can chat in real-time:
- Sending text message
- Send images
- Send attachments
## Video based channel
When joining in Video based channel, user will be ask allow camera and microphone before joining. After joined, they can:
- See themselves and others video in chatroom. It's a meeting!
- Share screen in the meeting
- Send text message in channel
## Schedule calendar
Each user login success, they will have a screen to manage their schedule through a calendar
- Create a event on calendar
- Quickly change event schedule using drag and drop
- Edit event
- Delete event

Moreover, schedule can be associate with a chatroom:
- Chatroom admin can create a event in a chatroom and set the location to a video based channel in that chatroom
- Others in chatroom(included admins and members) can be join that event
- People join in an event will automatically have that event added to their personal calendar
## Notification
User login success will have a notification board for receive information realtime about their chatroom, the event they joined
- See chatroom notification
- See event notification
- Mark all notification as read
## Personal information and authentication
Authentication with email & password included:
- Signin
- Signup
- Forgot password
- Reset password

User logged in will can be:
- Edit personal infomation: Name, Bio, Avatar
- Change their password

# Technologies
I will just list technologies for this Front-end repo

### For the core features
- [Socket.io](https://socket.io/) for real-time features
- [WebRTC](https://webrtc.org/) as core tech for video chat
- [Mediasoup](https://mediasoup.org/) library support WebRTC handle

### For the App
- [ReactJS](https://react.dev/) the main library for handling UI and logic
- [Chakra-ui](https://chakra-ui.com/) for increase speed building UI
- [react-hook-form](https://react-hook-form.com/) handle form and validation
- [Redux](https://redux.js.org/) and [Redux saga](https://redux-saga.js.org/) for state management
- [Axios](https://www.npmjs.com/package/axios) for handle some REST API

And some others...

