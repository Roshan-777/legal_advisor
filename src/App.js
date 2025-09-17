import { Container, Header, MessageList, Composer, useWebchat, Fab } from '@botpress/webchat'
import { useState, useMemo } from 'react'

const headerConfig = {
  botName: 'LawGic.AI',
  botAvatar: 'https://cdn.botpress.cloud/bot-avatar.png',
  botDescription: 'No suit, no tie, just AI legal guy',
  phone: { title: 'Call Support', link: 'tel:+1234567890' },
  email: { title: 'Email Us', link: 'mailto:support@example.com' },
  website: { title: 'Visit our website', link: 'https://www.example.com' },
  termsOfService: { title: 'Terms of Service', link: 'https://www.example.com/terms' },
  privacyPolicy: { title: 'Privacy Policy', link: 'https://www.example.com/privacy' },
}

function App() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(true)
  const { client, messages, isTyping, user, clientState, newConversation } = useWebchat({
    clientId: '79510b0c-e199-45db-8583-a505bd95ca22', // Replace with your actual Botpress Client ID
  })

  const config = {
    botName: 'LawGic.AI',
    botAvatar: 'https://picsum.photos/id/80/400',
    botDescription: 'No suit, no tie, just AI legal guy ',
  }

  const enrichedMessages = useMemo(
    () =>
      messages.map((message) => {
        const { authorId } = message
        const direction = authorId === user?.userId ? 'outgoing' : 'incoming'
        return {
          ...message,
          direction,
          sender:
            direction === 'outgoing'
              ? { name: user?.name ?? 'You', avatar: user?.pictureUrl }
              : { name: config.botName ?? 'Bot', avatar: config.botAvatar },
        }
      }),
    [config.botAvatar, config.botName, messages, user?.userId, user?.name, user?.pictureUrl]
  )

  const toggleWebchat = () => setIsWebchatOpen((prev) => !prev)

  return (
    <>
      <Container
        connected={clientState !== 'disconnected'}
        style={{
          width: '80%',          // 80% of screen width
          maxWidth: '900px',
          height: '80%',         // 80% of screen height
          maxHeight: '800px',    // cap the height
          display: isWebchatOpen ? 'flex' : 'none',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', // perfectly center
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          background: '#fff',
        }}
      >
        <Header
          defaultOpen={false}
          // closeWindow={() => setIsWebchatOpen(false)}
          restartConversation={newConversation}
          disabled={false}
          configuration={headerConfig}
        />
        <MessageList
          botName={config.botName}
          botDescription={config.botDescription}
          isTyping={isTyping}
          headerMessage="Chat History"
          showMarquee={true}
          messages={enrichedMessages}
          sendMessage={client?.sendMessage}
        />
        <Composer
          disableComposer={false}
          isReadOnly={false}
          allowFileUpload={true}
          connected={clientState !== 'disconnected'}
          sendMessage={client?.sendMessage}
          uploadFile={client?.uploadFile}
          composerPlaceholder="Type a message..."
        />
      </Container>
      {/* <Fab
        onClick={toggleWebchat}
        style={{ position: 'fixed', bottom: '20px', right: '20px', width: '64px', height: '64px' }}
      /> */}
    </>
  )
}

export default App
