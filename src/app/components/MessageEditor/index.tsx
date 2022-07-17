import { Box, Icon, IconButton, Input, Textarea } from '@chakra-ui/react';
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
import HTTPService from 'app/core/services/http.service';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { storage } from 'app/core/services/firebase.service';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import EditorToolBox from './EditorToolBox';
import FileComponent from './FileComponent';
import { messages } from './messages';
import LoadingBackdrop from '../layout/LoadingBackdrop';

interface Props {
  onSubmit: (value: any) => void;
  isOnlyText?: boolean;
}

const MessageEditor = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const [message, setMessage] = React.useState('');
  const [isFocus, setIsFocus] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [isSending, setIsSending] = React.useState(false);
  const [numberFileUploaded, setNumberFileUploaded] = React.useState(0);

  const handleChangeMessage = (value: any) => {
    setMessage(value.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault();
      if (message.length === 0 && files.length === 0) return;
      setIsSending(true);
      handleSubmit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      setMessage(message + '\n');
    }
  };

  const handleSubmit = async () => {
    if (message.length === 0 && files.length === 0) return;
    const messageTrimmed = String(message).trim();
    if (files.length) {
      const listUrl = await handleSubmitWithFile();
      const data = {
        message: messageTrimmed,
        attachments: listUrl,
      };
      props.onSubmit(data);
    } else {
      props.onSubmit({ message: messageTrimmed });
    }
    setFiles([]);
    setMessage('');
    setIsSending(false);
  };

  const handleDelete = id => {
    setFiles(files.filter((file: any) => file.id !== id));
  };

  const handleSubmitWithFile = () => {
    const listUpload = files.map(file => handleUpload(file));
    return Promise.all(listUpload);
  };

  const handleUpload = file => {
    if (!file) return;
    const fileToUpload = file;

    const storageRef = ref(
      storage,
      `attachments/${fileToUpload.lastModified}.${file.extension}`,
    );
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(parseInt(progress.toString(), 10));
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        error => {
          console.error(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            // props.saveCallback({ avatar: downloadURL });
            // console.log('File available at', { avatar: downloadURL });
            setNumberFileUploaded(numberFileUploaded + 1);
            const dataUploaded = {
              name: file.name,
              url: downloadURL,
              type: file.type.split('/')[0] === 'image' ? 'image' : 'file',
              size: file.sizeReadable,
            };
            resolve(dataUploaded);
          });
        },
      );
    });
  };

  return (
    <Box pos="relative" overflow="hidden">
      <Box
        pos="relative"
        borderColor={isFocus ? 'gray.500' : 'gray.300'}
        borderWidth={1}
        borderRadius={4}
        // sx={{
        //   '.w-md-editor': {
        //     backgroundColor: 'gray.300',
        //     color: 'gray.900',
        //   },
        //   '.w-md-editor-text-input': {
        //     borderColor: 'transparent !important',
        //     // p: 5,
        //     fontSize: 'md',
        //     // fontFamily: 'body',
        //   },
        //   '.wmde-markdown, .wmde-markdown-var': {
        //     '--color-border-default': 'transparent',
        //   },
        //   // 'language-markdown code-highlight ': {
        //   //   fontSize: 'md',
        //   // },
        // }}
      >
        {/* <MDEditor
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
        /> */}
        {files.length ? (
          <Box
            display="flex"
            overflowX="scroll"
            borderBottomWidth={1}
            borderBottomColor="gray.300"
            p={2}
          >
            {files.map((file: any) => (
              <FileComponent
                key={file?.id}
                file={file}
                onDelete={() => handleDelete(file.id)}
              />
            ))}
          </Box>
        ) : (
          ''
        )}
        <Box display="flex" alignItems="center">
          <Textarea
            borderRadius={0}
            borderWidth={0}
            value={message}
            onChange={handleChangeMessage}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            focusBorderColor="transparent"
            resize="none"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            placeholder="Message..."
          />
          <IconButton
            m={2}
            p={1}
            aria-label="send message"
            isRound={true}
            bgColor="purple.500"
            size="sm"
            onClick={() => handleSubmit()}
            _hover={{ bgColor: 'purple.600' }}
          >
            <Icon as={Send} boxSize={5} color="white" />
          </IconButton>
        </Box>
        {!props.isOnlyText ? (
          <EditorToolBox onChooseFile={files => setFiles(files)} />
        ) : (
          ''
        )}
      </Box>
      <LoadingBackdrop isShow={isSending} />
    </Box>
  );
};

export default MessageEditor;
