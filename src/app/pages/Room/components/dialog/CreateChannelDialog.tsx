import {
  Box,
  Button,
  Input,
  Select,
  Text,
  useRadioGroup,
} from '@chakra-ui/react';
import { useDialog } from 'app/components/Dialog/Dialog';
import RadioCard from 'app/components/RadioCard';
import React, { useEffect } from 'react';

const CreateChannelDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const { setDialog } = useDialog();

  const { getRootProps, getRadioProps, value } = useRadioGroup({
    name: 'type',
    defaultValue: 'text',
  });

  const options = [
    { name: 'text', title: 'Text Channel' },
    {
      name: 'video',
      title: 'Video Channel',
    },
  ];
  const group = getRootProps();

  useEffect(() => {
    if (!name) {
      setError("Channel's name is required");
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

  return (
    <Box display="flex" flexDir="column">
      <Text fontWeight="bold" mb={1}>
        Channel type
      </Text>
      <Box {...group}>
        {options.map(value => {
          const radio = getRadioProps({ value: value['name'] });
          return (
            <RadioCard key={value.name} {...radio}>
              {value.title}
            </RadioCard>
          );
        })}
      </Box>
      <Text fontWeight="bold" mt={2} mb={1}>
        Channel name
      </Text>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        mb={2}
        placeholder="Channel name"
      />
      <Text fontSize="smaller">Channel's name at least 3 characters</Text>

      <Box alignSelf="end" mt={4}>
        <Button
          mr={3}
          colorScheme="purple"
          onClick={() => {
            onClose({ name, type: value });
            setDialog(null);
          }}
          disabled={!!error}
        >
          Create
        </Button>
        <Button
          onClick={() => {
            setDialog(null);
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default CreateChannelDialog;
