import { Box, Button, Input, Text, useToast } from '@chakra-ui/react';
import AvatarUpload from 'app/components/AvatarUpload';
import { useDialog } from 'app/components/Dialog/Dialog';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'types';
import { useRoomSlice } from '../../slice';

const UpdateRoomInfoDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const { setDialog } = useDialog();
  const dispatch = useDispatch();
  const toast = useToast();
  const { actions } = useRoomSlice();

  const currentRoom = useSelector((state: RootState) => state.room?.roomDetail);
  const isUpdateRoomDetailSuccess = useSelector(
    (state: RootState) => state.room?.isUpdateRoomDetailSuccess,
  );
  useEffect(() => {
    if (currentRoom) {
      setName(currentRoom.name);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (isUpdateRoomDetailSuccess) {
      toast({
        title: 'Update success',
        status: 'success',
        duration: 2000,
      });
      dispatch(actions.clearUpdateRoomDetail());
    }
  }, [isUpdateRoomDetailSuccess]);

  const onUpdateRoomInfo = (data?: any) => {
    const updateData = {
      id: currentRoom.id,
      name,
      ...data,
    };
    dispatch(actions.updateRoomDetail(updateData));
  };
  return (
    <Box>
      <Box display="flex">
        <Box flex={3} pb={6}>
          <AvatarUpload
            name={currentRoom?.name}
            saveCallback={onUpdateRoomInfo}
            initAvatar={currentRoom.avatar}
          />
        </Box>
        <Box flex={7}>
          <Text fontWeight="bold" mb={1}>
            Room name:
          </Text>
          <Input value={name} onChange={e => setName(e.target.value)} mb={2} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={8}>
        <Button mr={3} onClick={() => onUpdateRoomInfo()} colorScheme="purple">
          Save
        </Button>
        <Button
          mr={3}
          onClick={() => {
            setDialog(null);
          }}
          colorScheme="orange"
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateRoomInfoDialog;
