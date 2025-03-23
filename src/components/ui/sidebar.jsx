"use client"

import React from 'react';
import { Box, Flex, IconButton, Image, Link, useDisclosure, VStack } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import Navbar from './header';
import { Outlet } from 'react-router';
import logo from "/src/assets/Logo_Unique_Lables.jpg";
import { TbCircleLetterCFilled, TbCircleLetterFFilled, TbCircleLetterMFilled, TbCircleLetterTFilled } from 'react-icons/tb';

const Sidebar = ({ children }) => {
  const { open, setOpen } = useDisclosure();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box display={"flex"} h="100vh" w="100vw">
      <Box
        position="fixed"
        left="0"
        top="0"
        h="100vh"
        color="gray.900"
        borderRightWidth={1}
        borderColor={"gray.300"}
        w={open ? "80px" : "200px"}
        transition="width 0.2s"
      >
        <Flex p="4" justifyContent={open ? "center" : "space-between"} alignItems="center">
          <IconButton onClick={() => toggleSidebar()} size="sm" color="black">
            <HiMenu />
          </IconButton>
          {!open && <Image src={logo} height="50px" />}
        </Flex>

        <VStack p="2" mt="4" spacing="4" alignItems={"center"}>
          <SidebarItem open={open} to="#" label="Testing" icon={<TbCircleLetterTFilled size={25} />} />
          <SidebarItem open={open} to="#" label="Meeting" icon={<TbCircleLetterMFilled size={25} />} />
          <SidebarItem open={open} to="#" label="Complaints" icon={<TbCircleLetterCFilled size={25} />} />
          <SidebarItem open={open} to="#" label="Feedback" icon={<TbCircleLetterFFilled size={25} />} />
        </VStack>
      </Box>
      <Box w="100%" flex="1" marginLeft={open ? "80px" : "200px"}>
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
};

function SidebarItem({ to, label, open, icon }) {

  return (
    <Link href={to} w="100%">
      <Flex
        color="gray.500"
        w="100%"
        align="center"
        justify={!open ? "start" : "center"}
        p="2"
        gap="2"
        _hover={{
          bg: 'gray.100',
          color: 'gray.900',
        }}
        borderRadius={"md"}
      >
        {icon}
        {!open && label}
      </Flex>
    </Link>
  )
}

export default Sidebar;
