import { Box, Icon, Image, Text } from '@chakra-ui/react';
import { Cancel } from '@mui/icons-material';
import React from 'react';

const FileComponent = ({ file, onDelete }) => {
  const { name, extension, type } = file;
  return (
    <Box
      width={100}
      height={120}
      p={1}
      m={2}
      pos="relative"
      sx={{
        '&:hover': {
          '.delete-icon': {
            visibility: 'visible',
          },
        },
      }}
    >
      {type.split('/')[0] === 'image' ? (
        <Image src={URL.createObjectURL(file)} />
      ) : (
        <Box
          width="full"
          height={100}
          backgroundColor="gray.400"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text>{extension}</Text>
        </Box>
      )}
      <Text
        fontSize="sm"
        whiteSpace="nowrap"
        w="full"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {name}
      </Text>
      <Icon
        pos="absolute"
        right={-2}
        top={-2}
        as={Cancel}
        color="gray.700"
        className="delete-icon"
        visibility="hidden"
        cursor="pointer"
        _hover={{
          color: 'gray.600',
        }}
        onClick={onDelete}
      />
    </Box>
  );
};

export default FileComponent;
