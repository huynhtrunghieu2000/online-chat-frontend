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
import React from 'react';

const CreateChannelDialog = ({ onClose }) => {
  const [name, setName] = React.useState('');
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

      <Box alignSelf="end" mt={4}>
        <Button
          mr={3}
          colorScheme="purple"
          onClick={() => {
            onClose({ name, type: value });
            setDialog(null);
          }}
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
