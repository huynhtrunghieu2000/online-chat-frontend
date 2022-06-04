import React from 'react';
import {
  Box,
  Button,
  Icon,
  Text,
  useMultiStyleConfig,
  useTab,
} from '@chakra-ui/react';
import { Home } from '@mui/icons-material';

const CustomTab = React.forwardRef((props: any, ref: any) => {
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];
  const styles = useMultiStyleConfig('Tabs', tabProps);

  return (
    <Box
      __css={styles.tab}
      {...tabProps}
      p={2}
      w={100}
      display="flex"
      flexDir="column"
      alignItems="center"
      borderRadius={4}
      borderBottomColor={isSelected ? 'purple.500' : 'transparent'}
      backgroundColor={isSelected ? 'gray.100' : 'transparent'}
      _hover={{ backgroundColor: 'gray.100' }}
      _focus={{ outline: 'none' }}
    >
      <Icon
        as={props.icon}
        color={isSelected ? 'purple.500' : 'gray.400'}
        m={1}
      />
      <Text fontSize="sm" color={isSelected ? '' : 'gray.400'}>
        {props.name}
      </Text>
    </Box>
  );
});
export default CustomTab;
