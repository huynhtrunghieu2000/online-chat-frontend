import React from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { storage } from 'app/core/services/firebase.service';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Avatar, Box, Button, useToast } from '@chakra-ui/react';

interface Props {
  initAvatar?: string;
  name?: string;
  saveCallback: (data: any) => void;
}
const AvatarUpload = (props: Props) => {
  const toast = useToast();

  const [images, setImages] = React.useState([]);
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const maxNumber = 1;

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList as never[]);
  };

  const onUploadImageToStorage = file => {
    if (!file) return;
    const fileToUpload = file.file;

    const storageRef = ref(storage, `avatar/${fileToUpload.lastModified}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);
    setUploadProgress(10);
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(parseInt(progress.toString(), 10));
        console.log('Upload is ' + progress + '% done');
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          props.saveCallback({ avatar: downloadURL });
          console.log('File available at', { avatar: downloadURL });
          setIsUploadSuccess(true);
          toast({
            title: 'Update avatar success',
            // description: 'Your avatar',
            status: 'success',
            duration: 2000,
          });
          setUploadProgress(0);
          setImages([]);
        });
      },
    );
  };

  return (
    <Box className="App">
      <ImageUploading value={images} onChange={onChange} maxNumber={maxNumber}>
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <Box
            className="upload__image-wrapper"
            px={10}
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <Avatar
              name={props.name || 'avatar'}
              src={imageList[0]?.dataURL || props.initAvatar}
              size="2xl"
              style={isDragging ? { filter: 'brightness(0.8)' } : undefined}
              onClick={
                imageList[0]?.dataURL ? onImageUpload : () => onImageUpdate(0)
              }
              _hover={{
                cursor: 'pointer',
                _before: {
                  content: '"Update"',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  position: 'absolute',
                  pt: '50%',
                  color: 'white',
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '50%',
                },
              }}
              {...dragProps}
            />
            {imageList[0]?.dataURL && (
              <Box
                display="flex"
                flexDir="column"
                height={62}
                mt={2}
                width="100%"
              >
                <Button
                  variant="solid"
                  colorScheme="purple"
                  onClick={() => onUploadImageToStorage(imageList[0])}
                  flex={1}
                  mb={2}
                >
                  {uploadProgress > 0 ? `${uploadProgress}%` : 'Save'}
                </Button>
                <Button variant="solid" onClick={onImageRemoveAll} flex={1}>
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        )}
      </ImageUploading>
    </Box>
  );
};

export default AvatarUpload;
