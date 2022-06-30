import { Box, Button, Center, Text } from '@chakra-ui/react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../Auth/slice';
import { APP_NAME } from 'app/core/constants/general';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>

      <Box height="full" width="full" background="purple.500">
        <Center flexDir="column" width="full" height="70%" color="white">
          <Text
            width="70%"
            lineHeight="shorter"
            fontSize="5xl"
            fontWeight="bold"
            color="white"
            textAlign="center"
          >
            Connect with your team
          </Text>
          <Box width="60%" mt={5}>
            <Text>
              ...where you can belong to a school club, a gaming group, or a
              worldwide art community. Where just you and a handful of friends
              can spend time together. A place that makes it easy to talk every
              day and hang out more often.
            </Text>
          </Box>
          <Button
            variant="ghost"
            backgroundColor="white"
            color="purple.500"
            mt={8}
            w={200}
            size="lg"
            as={Link}
            to="/auth/login"
          >
            Join Now
          </Button>
        </Center>
      </Box>
    </>
  );
}
