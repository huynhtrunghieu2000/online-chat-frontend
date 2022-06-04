/**
 *
 * Dashboard
 *
 */
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@chakra-ui/react';
import { messages } from './messages';
import { NavigationBar } from 'app/components/layout/NavigationBar';
import PrivateRoute from 'app/core/modules/PrivateRoute';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { DashboardContent } from './containers/DashboardContent/Loadable';
import { SideBar } from 'app/components/layout/SideBar/Loadable';
import { NotFoundPage } from 'app/components/NotFoundPage/Loadable';

interface Props {}

const Dashboard = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { path } = useRouteMatch();
  const { t, i18n } = useTranslation();

  return (
    <Box h="full" w="full" minH={768} minW={1024} pos="fixed">
      <Box h="full">
        <Switch>
          <PrivateRoute path={`/dashboard`} component={DashboardContent} />
          <Route component={NotFoundPage} />
        </Switch>
      </Box>
    </Box>
  );
};

export default Dashboard;
