/*!

=========================================================
* Toán Thầy Tài Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";

function TransactionRow(props) {
  const { name, date, logo, price } = props;

  return (
    <Flex mb='24px' justifyContent='space-between'>
      <Flex alignItems='center'>
        <Box
          me='14px'
          borderRadius='50%'
          color={
            price[0] === "+"
              ? "#01B574"
              : price[0] === "-"
              ? "red.500"
              : "gray.400"
          }
          border='1px solid'
          display='flex'
          alignItems='center'
          justifyContent='center'
          w='35px'
          h='35px'>
          <Icon as={logo} w='12px' h='12px' />
        </Box>
        <Flex direction='column'>
          <Text fontSize='sm' color='#fff' mb='4px'>
            {name}
          </Text>
          <Text fontSize={{ sm: "xs", md: "sm" }} color='gray.400'>
            {date}
          </Text>
        </Flex>
      </Flex>
      <Box
        color={
          price[0] === "+"
            ? "#01B574"
            : price[0] === "-"
            ? "red.500"
            : "gray.400"
        }>
        <Text fontSize='sm'>{price}</Text>
      </Box>
    </Flex>
  );
}

export default TransactionRow;
