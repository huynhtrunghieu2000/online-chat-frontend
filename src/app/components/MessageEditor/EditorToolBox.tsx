import { Box, IconButton, Icon, useToast } from '@chakra-ui/react';
import { AddCircle, InsertPhoto } from '@mui/icons-material';
import React from 'react';
import Files from 'react-files';

const EditorToolBox = ({ onChooseFile }) => {
  const toast = useToast();
  const onFilesError = err => {
    toast({
      title: err.message,
      description: 'Max file size is 10MB.',
      status: 'warning',
      duration: 2000,
    });
  };
  return (
    <Box
      color="gray.600"
      sx={{
        '.files-dropzone': {
          width: 'fit-content',
        },
      }}
    >
      <Files
        className="files-dropzone"
        onChange={onChooseFile}
        onError={onFilesError}
        // accepts={['image/png', '.pdf', 'audio/*']}
        multiple
        maxFileSize={10000000}
        minFileSize={0}
        maxFiles={10}
        clickable
      >
        <Icon
          as={AddCircle}
          cursor="pointer"
          _hover={{ color: 'gray.500' }}
          m={2}
        />
      </Files>
      {/* <IconButton aria-label="add file" background="transparent">
        <Icon as={InsertPhoto} />
      </IconButton> */}
    </Box>
  );
};

export default EditorToolBox;
