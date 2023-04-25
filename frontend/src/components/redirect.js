import React from 'react'
import { Route } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'

const redirect = () => {
  return (
    <>
    <Route exact path="/chats" component={<ChatPage />} />
    </>
  )
}

export default redirect