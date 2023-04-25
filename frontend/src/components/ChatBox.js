import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider";


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
const { selectedChat } = ChatState();

  return (

    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      p={3}
      mt="-70px"
      mr={-4}
      ml={-3}
      h="111%"
      maxH="111%"
      w="74.25%"
      
      borderRadius="lg"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;