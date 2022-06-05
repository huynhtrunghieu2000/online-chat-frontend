import React from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { storage } from 'app/core/services/firebase.service';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { Avatar, Box, Button } from '@chakra-ui/react';

interface Props {
  initAvatar?: string;
  name?: string;
}
const AvatarUpload = (props: Props) => {
  const [images, setImages] = React.useState([]);
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
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          console.log('File available at', downloadURL);
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
          <Box className="upload__image-wrapper">
            <Avatar
              name={props.name || 'avatar'}
              src={props.initAvatar || imageList[0]?.dataURL}
              size="2xl"
              style={isDragging ? { filter: 'brightness(0.8)' } : undefined}
              onClick={
                imageList[0]?.dataURL ? onImageUpload : () => onImageUpdate(0)
              }
              _hover={{
                cursor: 'pointer',
                filter: 'brightness(0.8)',
              }}
              {...dragProps}
            />
            {imageList[0]?.dataURL && (
              <Box>
                <Button
                  variant="solid"
                  colorScheme="purple"
                  onClick={() => onUploadImageToStorage(imageList[0])}
                >
                  Save
                </Button>
                <Button variant="solid" onClick={onImageRemoveAll}>
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
