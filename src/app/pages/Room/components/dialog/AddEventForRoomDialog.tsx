import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  useRadioGroup,
} from '@chakra-ui/react';
import { useDialog } from 'app/components/Dialog/Dialog';
import RadioCard from 'app/components/RadioCard';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'types';
import { useRoomSlice } from 'app/pages/Room/slice';

const AddEventForRoomDialog = props => {
  const { setDialog } = useDialog();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const dispatch = useDispatch();
  const { actions } = useRoomSlice();
  const room = useSelector((state: RootState) => state.room?.roomDetail);
  const channels = useSelector(
    (state: RootState) => state.room?.roomDetail?.Channels,
  );
  const videoChannels = channels.filter(channel => channel.type === 'video');
  const {
    getRootProps,
    getRadioProps,
    value,
    setValue: setLocationOption,
  } = useRadioGroup({
    name: 'location',
    defaultValue: videoChannels.length <= 0 ? 'custom' : 'channel',
  });

  const options = [
    {
      name: 'channel',
      title: 'Channel Video',
      disabled: videoChannels.length <= 0,
    },
    { name: 'custom', title: 'Custom' },
  ];
  const group = getRootProps();

  const submitData = data => {
    const locationChannel = {
      room: {
        id: room.id,
        name: room.name,
      },
      channel: channels.filter(channel => channel.id === +data.channel_id)[0],
    };
    const event = {
      ...props.initData,
      ...data,
      start_time: new Date(data.start).toISOString(),
      end_time: new Date(data.end).toISOString(),
      location: value === 'channel' ? locationChannel : data.location_custom,
    };
    delete event.location_custom;
    delete event.channel_id;
    props.onClose(event);
    setDialog(null);
  };

  const handleDelete = () => {
    props.onDelete(props.initData);
    setDialog(null);
  };

  useEffect(() => {
    if (props.initData) {
      const data = props.initData;
      setValue('title', data.title);
      setValue('start', data.start_time.split('Z')[0]);
      setValue('end', data.end_time.split('Z')[0]);
      setValue('description', data.description);
      if (String(data.location) === data.location) {
        setLocationOption('custom');
        setValue('location_custom', data.location);
      } else {
        setLocationOption('channel');
        setValue('channel_id', data.location.channel.id);
      }
    }
  }, []);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(submitData)}
      display="flex"
      flexDir="column"
    >
      <Text fontWeight="bold" mb={1}>
        Choose Location
      </Text>
      <Box {...group}>
        {options.map(value => {
          const radio = getRadioProps({ value: value['name'] });
          return (
            <RadioCard key={value.name} {...radio} isDisabled={value.disabled}>
              {value.title}
            </RadioCard>
          );
        })}
      </Box>
      {value === 'channel' ? (
        <Box mt={3}>
          <FormControl>
            <FormLabel htmlFor="channel_id" fontWeight="bold">
              Select a channel
            </FormLabel>
            <Select id="channel_id" size="lg" {...register('channel_id')}>
              {videoChannels.map(channel => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box mt={3}>
          <FormControl isInvalid={errors.location_custom}>
            <FormLabel htmlFor="location_custom" fontWeight="bold">
              Enter location
            </FormLabel>
            <Input
              id="location_custom"
              size="lg"
              placeholder="Add location, link or something..."
              {...register('location_custom', {
                required: 'Location required',
              })}
            />
            <FormErrorMessage>
              {errors.location_custom && errors.location_custom.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
      )}
      <Divider my={2} />
      {/*  */}
      <FormControl isInvalid={errors.title}>
        <FormLabel htmlFor="title" fontWeight="bold">
          Title
        </FormLabel>
        <Input
          id="title"
          size="lg"
          placeholder="Title event"
          {...register('title', {
            required: 'Event title is required',
            minLength: { value: 3, message: 'Minimum length should be 3' },
          })}
        />
        <FormErrorMessage>
          {errors.title && errors.title.message}
        </FormErrorMessage>
      </FormControl>
      {/*  */}
      <Box display="flex" gap={2} my={2}>
        <Box flex={1}>
          <FormControl isInvalid={errors.start}>
            <FormLabel htmlFor="start" fontWeight="bold">
              Start
            </FormLabel>
            <Input
              id="start"
              size="lg"
              placeholder="start"
              type="datetime-local"
              min={new Date().toISOString().split('T')[0]}
              {...register('start', {
                required: 'Event start date is required',
                validate: (value: string) => {
                  return (
                    new Date(value).getTime() > new Date().getTime() ||
                    'Start time must in future.'
                  );
                },
              })}
            />
            <FormErrorMessage>
              {errors.start && errors.start.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box flex={1}>
          <FormControl isInvalid={errors.end}>
            <FormLabel htmlFor="end" fontWeight="bold">
              End
            </FormLabel>
            <Input
              id="end"
              size="lg"
              placeholder="end"
              type="datetime-local"
              {...register('end', {
                required: 'Event end date is required',
                validate: (value: string) => {
                  const startDate = getValues('start');
                  return (
                    new Date(value).getTime() > new Date(startDate).getTime() ||
                    'End time must be after start time.'
                  );
                },
              })}
            />
            <FormErrorMessage>
              {errors.end && errors.end.message}
            </FormErrorMessage>
          </FormControl>
        </Box>
      </Box>
      {/*  */}
      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description" fontWeight="bold">
          Description
        </FormLabel>
        <Input
          id="description"
          size="lg"
          placeholder="Description"
          {...register('description')}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>
      <Box display="flex" justifyContent="space-between" mt={5}>
        <Box>
          {props.initData ? (
            <Button onClick={handleDelete} colorScheme="red" w={'90px'}>
              Delete
            </Button>
          ) : (
            ''
          )}
        </Box>
        <Box>
          <Button
            onClick={() => {
              setDialog(null);
            }}
            colorScheme="orange"
            mr={2}
            w={'90px'}
          >
            Close
          </Button>
          <Button type="submit" colorScheme="purple" w={'90px'}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEventForRoomDialog;
