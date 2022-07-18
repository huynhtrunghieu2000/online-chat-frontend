import {
  Avatar,
  Box,
  Button,
  IconButton,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { AddCircle, ArrowBack, ArrowForward } from '@mui/icons-material';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RootState } from 'types';
import { messages } from '../messages';
import { useRoomSlice } from '../slice';

// const MeetRoom = React.lazy(() => import('@app'));

interface Props {}

const RoomSideMenu = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const listRoom = useSelector((state: RootState) => state?.room?.roomList);
  const currentRoom = useSelector(
    (state: RootState) => state?.room?.roomDetail,
  );
  const user = useSelector((state: RootState) => state.authSlice?.data?.user);
  const isCreateRoomSuccess = useSelector(
    (state: RootState) => state?.room?.isCreateRoomSuccess,
  );

  useEffect(() => {
    if (isCreateRoomSuccess) {
      dispatch(actions.getRoomDetail({ id: currentRoom.id }));
      toast({
        title: 'Create room success',
        description: 'Your room was created successfully',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearGetChannelDetail());
      dispatch(actions.clearCreateRoom());
    }
  }, [isCreateRoomSuccess]);

  useEffect(() => {
    if (listRoom) {
      console.log(listRoom);
      const index = listRoom?.findIndex(
        item => item.id === Number(location.pathname.split('/')[2]),
      );
      setTabIndex(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRoom]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
  };

  const handleCreateRoom = (data: string) => {
    console.log(data);
    dispatch(actions.createRoom({ userId: user.id, name: data }));
    setIsOpenModal(false);
  };

  const handleInviteMember = userIds => {};
  return (
    <Box
      h="full"
      w={isOpen ? 300 : '64px'}
      borderRight="1px"
      borderColor="gray.200"
      display="flex"
      flexDir="column"
      transition="all 0.3s"
      shadow="lg"
    >
      <Box p={2} display="flex" alignSelf="flex-end" justifyContent="center">
        <IconButton
          aria-label="toggle list class"
          icon={isOpen ? <ArrowBack /> : <ArrowForward />}
          onClick={isOpen ? onClose : onOpen}
        />
      </Box>
      <Tabs
        orientation="vertical"
        variant="unstyled"
        index={tabIndex}
        onChange={handleTabChange}
        overflowY="scroll"
      >
        <TabList w="full">
          {listRoom?.length ? (
            listRoom.map((room, index) => (
              <Link to={`/rooms/${room.id}`} key={room.id}>
                <Tab
                  px={4}
                  py={4}
                  w="full"
                  display="flex"
                  alignItems="center"
                  pos="relative"
                  justifyContent="flex-start"
                  borderRadius={8}
                  textOverflow="ellipsis"
                  transition="all 0.3s"
                  backgroundColor={
                    tabIndex === index ? 'gray.200' : 'transparent'
                  }
                  _after={
                    index === tabIndex
                      ? {
                          content: '""',
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          height: '65%',
                          borderRight: '4px solid purple',
                          borderColor: 'purple.400',
                          borderLeftRadius: '20px',
                          transform: 'translateY(-50%)',
                        }
                      : {}
                  }
                  _hover={{ backgroundColor: 'gray.200' }}
                  _focus={{ outline: 'none' }}
                >
                  <Avatar
                    src={room?.avatar}
                    name={room.name}
                    size={isOpen ? 'xs' : 'sm'}
                    mr={2}
                    transition="all 0.3s"
                  />
                  {isOpen && <Text isTruncated>{room.name}</Text>}
                </Tab>
              </Link>
            ))
          ) : (
            <></>
          )}
          <Tab
            px={4}
            py={4}
            w="full"
            display="flex"
            alignItems="center"
            pos="relative"
            justifyContent="flex-start"
            textOverflow="ellipsis"
            transition="all 0.3s"
            _hover={{ backgroundColor: 'gray.200' }}
            _focus={{ outline: 'none' }}
            onClick={() => setIsOpenModal(true)}
          >
            {isOpen ? (
              <>
                <Icon
                  as={AddCircle}
                  h={'24px'}
                  w={'24px'}
                  mr={2}
                  color="purple.500"
                />
                <Text isTruncated>Create room</Text>
              </>
            ) : (
              <Icon as={AddCircle} h={'32px'} w={'32px'} color="purple.500" />
            )}
          </Tab>
        </TabList>
      </Tabs>
      <CreateRoomDialog
        isOpen={isOpenModal}
        onSubmit={handleCreateRoom}
        onClose={() => setIsOpenModal(false)}
      />
    </Box>
  );
});

const CreateRoomDialog = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!name) {
      setError("Room's name is required");
    } else if (name.length < 3) {
      setError('Name must be at least 3 characters');
    } else setError('');
  }, [name]);

  useEffect(() => {
    return () => {
      setName('');
      setError('');
    };
  }, []);

  const reset = () => {
    setName('');
    setError('');
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new room</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <FormControl>
            <FormLabel>Room's name</FormLabel>
            <Input
              placeholder="Room name"
              value={name}
              onChange={e => {
                setError('');
                setName(e.target.value);
              }}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="purple"
            mr={3}
            onClick={() => {
              onSubmit(name);
              reset();
            }}
            disabled={!!error || !name}
          >
            Create
          </Button>
          <Button
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const inviteMemberDialog = () => {};

export default RoomSideMenu;
