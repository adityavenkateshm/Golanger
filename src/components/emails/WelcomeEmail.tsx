import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
  baseUrl: string
}

export const WelcomeEmail = ({ email, baseUrl }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Golanger's Job Alerts</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Golanger's Job Alerts!</Heading>
          
          <Text style={text}>
            Thanks for subscribing to Golanger job alerts! You'll now receive notifications about new Golang job opportunities that match your preferences.
          </Text>

          <Section style={section}>
            <Text style={text}>
              You can customize your job preferences or unsubscribe at any time using the links below.
            </Text>

            <Button style={button} href={`${baseUrl}/preferences?email=${encodeURIComponent(email)}`}>
              Customize Preferences
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            You received this email because you subscribed to Golang job alerts on{' '}
            <Link href={baseUrl} style={link}>
              Golanger.co
            </Link>
            .{' '}
            To stop receiving these emails,{' '}
            <Link href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`} style={link}>
              unsubscribe here
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '12px 0',
}

const section = {
  margin: '32px 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '1',
  padding: '12px 20px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  marginTop: '16px',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '32px 0',
}

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
}

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}