import { Box, TabList, Tabs } from '@chakra-ui/react';
import { Home } from '@mui/icons-material';
import React, { memo, useEffect, useState } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import CustomTab from './CustomTab';

interface Props {
  list: { name: string; path: string; icon: typeof Home }[];
  onTabChange: (path: string) => void;
}

export const TabNavigator = memo((props: Props) => {
  const location = useLocation().pathname.split('/')[1];
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    props.onTabChange(props.list[index].path);
  };

  useEffect(() => {
    const index = props.list.findIndex(item => item.path === `/${location}`);
    setTabIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Tabs
      colorScheme="purple"
      display="flex"
      h="full"
      index={tabIndex}
      borderBottom="none"
      onChange={handleTabChange}
      variant="soft-rounded"
    >
      <TabList borderBottom="none">
        {props.list.map((option, index) => (
          <CustomTab
            key={option.name}
            name={option.name}
            path={option.path}
            icon={option.icon}
          />
        ))}
      </TabList>
    </Tabs>
  );
});
