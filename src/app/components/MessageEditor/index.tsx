import { Box, Icon, IconButton } from '@chakra-ui/react';
import { Send } from '@mui/icons-material';
import MDEditor, {
  bold,
  code,
  image,
  italic,
  link,
  quote,
  strikethrough,
} from '@uiw/react-md-editor';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

interface Props {
  onSubmit: (value: any) => void;
}

const MessageEditor = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const [message, setMessage] = React.useState('');

  const handleChangeMessage = (value: any) => {
    setMessage(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      props.onSubmit(message);
      setMessage('');
    } else if (e.key === 'Enter' && e.ctrlKey) {
      setMessage(message + '\n');
    }
  };

  return (
    <Box pos="relative">
      <Box
        sx={{
          '.w-md-editor': {
            backgroundColor: 'gray.300',
            color: 'gray.900',
          },
          '.w-md-editor-text-input': {
            borderColor: 'transparent !important',
            // p: 5,
            // fontSize: 'md',
            // fontFamily: 'body',
          },
          '.wmde-markdown, .wmde-markdown-var': {
            '--color-border-default': 'transparent',
          },
          // 'language-markdown code-highlight ': {
          //   fontSize: 'md',
          // },
        }}
      >
        <MDEditor
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          autoFocus={true}
          preview="edit"
          height={130}
          commands={[bold, italic, strikethrough, link, quote, code, image]}
          toolbarHeight={40}
          visiableDragbar={false}
          hideToolbar={true}
          highlightEnable={true}
        />
      </Box>
      <IconButton
        position="absolute"
        right={8}
        p={1}
        top={'50%'}
        transform="translateY(-50%)"
        aria-label="send message"
        isRound={true}
        bgColor="purple.500"
        size="sm"
        onClick={() => props.onSubmit(message)}
        _hover={{ bgColor: 'purple.600' }}
      >
        <Icon as={Send} boxSize={5} color="white" />
      </IconButton>
    </Box>
  );
};

export default MessageEditor;
