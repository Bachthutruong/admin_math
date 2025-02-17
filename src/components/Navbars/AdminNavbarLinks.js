import React from "react";
import { BellIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ProfileIcon, SettingsIcon } from "components/Icons/Icons";
import { ItemContent } from "components/Menu/ItemContent";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import PropTypes from "prop-types";
import { NavLink, useHistory } from "react-router-dom";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;
  const history = useHistory();

  const settingsRef = React.useRef();

  // Kiểm tra nếu người dùng đã đăng nhập và lấy email
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.data ? user?.data.email : null;

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user"); // Xóa dữ liệu người dùng khỏi localStorage
    history.push("/auth/signin"); // Chuyển hướng đến trang đăng nhập
  };

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems='center'
      flexDirection='row'>
      {/* Nếu có người dùng đăng nhập, hiển thị email và menu logout */}
      {email ? (
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ProfileIcon color="white" w="22px" h="22px" />}
            variant="transparent-with-icon"
          >
            <Text display={{ sm: "none", md: "flex" }} color="white">{email}</Text>
          </MenuButton>
          <MenuList
            border='transparent'
            backdropFilter='blur(63px)'
            bg='linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.69) 76.65%)'
            borderRadius='20px'>
            <MenuItem onClick={handleLogout}>
              <Text >Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <NavLink to='/auth/signin'>
          <Button
            ms='0px'
            px='0px'
            me={{ sm: "2px", md: "16px" }}
            color="white"
            variant="transparent-with-icon"
            rightIcon={<ProfileIcon color="white" w="22px" h="22px" me="0px" />}
          >
            <Text display={{ sm: "none", md: "flex" }}>Sign In</Text>
          </Button>
        </NavLink>
      )}

      <SidebarResponsive
        iconColor="gray.500"
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
