"use client"

import React from 'react';
import { Flex, Box, Text, IconButton, Spacer, Avatar, useDisclosure } from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import { HiMenu } from 'react-icons/hi';
import { useLocation } from 'react-router';

const Navbar = () => {

  const {pathname} = useLocation()

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding="4"
      color="gray.900"
      position="relative"
      top="0"
      w="100%"
      wrap="wrap"
      zIndex="1"
      borderBottomWidth={1}
      borderColor="gray.300"
    >
      <Flex align="center" gap="2">
        
        <Text fontSize="xl" fontWeight="bold">{ pathname === '/testing' ? 'Testing' : pathname}</Text>
      </Flex>
      <Flex align="center" gap="4">
        <FiBell />
      </Flex>
    </Flex>
  );
};

export default Navbar;
