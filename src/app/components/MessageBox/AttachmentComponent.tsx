import { Box, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import ZipFile from 'assets/images/zip_file.svg';
import GeneralFile from 'assets/images/general_file.svg';
import PdfFile from 'assets/images/pdf_file.svg';
import { GetApp } from '@mui/icons-material';

const AttachmentComponent = ({ attachment }) => {
  const fileImg = {
    pdf: PdfFile,
    general: GeneralFile,
  };
  return attachment.type === 'image' ? (
    <Image src={attachment.url} height={250} maxW={500} my={2} />
  ) : (
    <Box
      my={2}
      p={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height={'60px'}
      // width={300}
      backgroundColor="gray.200"
      border="1px solid"
      borderColor="gray.100"
      borderRadius={4}
      color="gray.600"
    >
      <Box display="flex" alignItems="center">
        <Image src={ZipFile} color="gray.100" />
        <Box whiteSpace="nowrap" color="blue.400" mx={2}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            overflow="hidden"
            textOverflow="ellipsis"
            maxW={400}
            cursor="pointer"
            _hover={{
              textDecor: 'underline',
            }}
            w="min-content"
            as="a"
            href={attachment.url}
          >
            {attachment.name}
          </Text>
          <Text fontSize="xs">{attachment.size}</Text>
        </Box>
      </Box>
      <a href={attachment.url}>
        <Icon as={GetApp} cursor="pointer" />
      </a>
    </Box>
  );
};

export default AttachmentComponent;
