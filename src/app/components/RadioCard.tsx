import { Box, Icon, useRadio } from '@chakra-ui/react';
import { RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import React from 'react';

const RadioCard = props => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'purple.500',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        _disabled={{
          opacity: '0.5',
          backgroundColor: 'gray.200',
        }}
        px={5}
        py={3}
        display="flex"
        alignItems="center"
        mb={2}
      >
        <Icon
          mr={2}
          as={props.isChecked ? RadioButtonChecked : RadioButtonUnchecked}
        />
        {props.children}
      </Box>
    </Box>
  );
};

export default RadioCard;
