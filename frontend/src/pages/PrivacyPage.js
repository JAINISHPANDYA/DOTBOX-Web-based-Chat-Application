import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import HomeSiteheader from "../components/HomeSiteComponent/HomeSiteheader";
import privacypolicyimage from "../assets/Privacypolicy.png"
import "./PrivacyPage.css"

const privacyPage = () => {
    return (
        <Box className="privacypolicy">
            <HomeSiteheader />
            <Box className="privacypolicyheader">
            <Image className="privacypolicyimage" src={privacypolicyimage}></Image>
            <Box className="privacypolicytitle">
                Privacy Policy
            </Box>
            <Text className="privacypolicytitletwo">
            At our dotbox chat application, we take the privacy of our users very seriously. This Privacy Policy outlines the information we collect, how we use it, and how we protect it.

            </Text>
            </Box>
            <Box className="privacypolicydescription">
            <Text fontWeight={700}>
            Information we collect
            </Text>
            <Text>
            We collect information that is necessary for the operation of our chat application. This includes:
            </Text>
            <Text>
            User account information: We collect information such as your name, email address, and phone number when you create an account with us.
            </Text>
            <Text>
            Chat data: We collect the messages you send and receive through our chat application.
            </Text>
            <Text>
            Usage data: We collect information about how you use our chat application, including your device type, IP address, and browser type.
            </Text>
            <Text fontWeight={700} marginTop="20px">
            How we use your information
            </Text>
            <Text>
            We use your information to provide and improve our chat application. This includes:
            </Text>
            <Text>
            Providing the chat service: We use your account information and chat data to provide you with our chat service.
            </Text>
            <Text>
            Improving our chat service: We use your usage data to analyze how our chat application is being used and make improvements.
            </Text>
            <Text>
            Personalization: We may use your information to personalize your chat experience, such as suggesting contacts or groups to chat with.
            </Text>
            <Text fontWeight={700} marginTop="20px" >
            How we protect your information
            </Text>
            <Text>
            We take the security of your information seriously. We use industry-standard measures to protect your information from unauthorized access, alteration, or destruction. We also limit access to your information to only those who need it to provide our chat service.
            </Text>
            <Text fontWeight={700} marginTop="20px">
            Sharing your information
            </Text>
            <Text>
            We do not sell or share your information with third parties for marketing purposes. However, we may share your information with third-party service providers who help us operate our chat application.
            </Text>
            <Text fontWeight={700} marginTop="20px">
            Your rights
            </Text>
            <Text>
            You have the right to access, update, and delete your information. You can do this by accessing your account settings within our chat application. You can also contact us at any time to request that we delete your information.
            </Text>
            <Text fontWeight={700} marginTop="20px">
            Changes to this Privacy Policy
            </Text>
            <Text>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. Your continued use of our chat application after any changes to this Privacy Policy constitutes your acceptance of the new Privacy Policy.
            </Text>
            <Text fontWeight={700} marginTop="20px">
            Contact Us
            </Text>
            <Text>
            If you have any questions or concerns about this Privacy Policy or our chat application, please contact us at <Text fontWeight={700} color="#3897D3"> support@dotbox.com</Text>
            </Text>
            </Box>
        </Box>
    )
}
export default privacyPage;