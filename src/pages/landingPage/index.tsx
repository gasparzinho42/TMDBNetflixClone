import React, { useContext, useState } from 'react'
import Box from '../../components/layout/box'
import Button from '../../components/button'
import CardWrapper from '../../components/cardWrapper'
import Footer from '../../components/footer'
import Header from '../../components/header'
import Input from '../../components/input'
import { Title } from './styles'
import backgroundImage from '../../assets/img/appBackground.jpg'
import Checkbox from '../../components/checkbox'

import {
  createSession,
  deleteSession,
  getToken,
  validateWithLogin,
} from '../../common/API'
import {
  IAuthWithLoginRequest,
  ICreateSessionRequest,
  IDeleteSessionRequest,
} from '../../common/interfaces'
import { useNavigate } from 'react-router-dom'
import { TMDBContext, IUserSession } from '../../context'

const LandingPage: React.FC = () => {
  const [login, setLogin] = useState('')
  const [userSessionID, setSessionID] = useState('')
  const [password, setpassword] = useState('')
  const navigate = useNavigate()
  const { setUserSession } = useContext(TMDBContext)

  const loginFunctions = {
    handleLogin: async () => {
      if (login && password) {
        const tokenResponse = await loginFunctions.getLoginToken()
        const requestToken = await loginFunctions.authenticateTMDBUser(
          tokenResponse.request_token
        )
        if (!requestToken) return
        const sessionId = await loginFunctions.createTMDBSession(requestToken)
        if (!sessionId) return
        setSessionID(sessionId)
        const newSession = loginFunctions.createUserSession(
          tokenResponse.expires_at,
          requestToken,
          sessionId
        )
        setUserSession(newSession)
        navigate('/browse')
      }
    },
    getLoginToken: async () => {
      return await getToken()
    },
    createTMDBSession: async (requestToken: string) => {
      const createSessionData: ICreateSessionRequest = {
        request_token: requestToken || '',
      }
      return await createSession(createSessionData)
    },
    authenticateTMDBUser: async (tokenRes: string) => {
      const data: IAuthWithLoginRequest = {
        username: login,
        password: password,
        request_token: tokenRes,
      }
      return await validateWithLogin(data)
    },
    createUserSession: (
      expires_at: Date,
      request_token: string,
      session_id: string
    ) => {
      const session: IUserSession = {
        expires_at: expires_at,
        request_token: request_token,
        session_id: session_id,
      }
      return session
    },
  }
  return (
    <Box
      h='100vh'
      w='100vw'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'red',
        gap: '15px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <Header hideLogout />
      <CardWrapper>
        <Box w='100%' flexDirection='column'>
          <Title style={{ marginBottom: '20px' }}>Entrar</Title>
          <Box w='100%' mb='15px' mt='10px'>
            <Input
              value={login}
              onChange={evt => setLogin(evt.target.value)}
              title='Email ou número de telefone'
            />
          </Box>
          <Box w='100%' mb='30px'>
            <Input
              type='password'
              value={password}
              onChange={evt => setpassword(evt.target.value)}
              title='Senha'
            />
          </Box>
        </Box>

        <Box w='100%' flexDirection='column'>
          <Box w='100%' mb='10px'>
            <Button
              title='Entrar'
              onClick={() => {
                loginFunctions.handleLogin()
              }}
            />
          </Box>
        </Box>
      </CardWrapper>
      <Footer />
    </Box>
  )
}

export default LandingPage
