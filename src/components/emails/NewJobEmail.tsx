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
import { Job } from '@/types'

interface NewJobEmailProps {
  job: Job
  baseUrl: string
}

export const NewJobEmail = ({ job, baseUrl }: NewJobEmailProps) => {
  const previewText = `New Golang job at ${job.company}: ${job.title}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Golang Job Alert</Heading>
          <Section style={jobSection}>
            <Heading as="h2" style={h2}>{job.title}</Heading>
            <Text style={company}>{job.company}</Text>
            <Text style={details}>
              {job.location} • {job.location_type} • {job.role_type}
            </Text>
            {job.salary_min && job.salary_max && (
              <Text style={details}>
                {job.salary_currency}{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
              </Text>
            )}
          </Section>

          <Button
            style={{ ...button, padding: '12px 20px' }}
            href={`${baseUrl}/jobs/${job.id}`}
          >
            View Job Details
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            You received this email because you subscribed to Golang job alerts on{' '}
            <Link href={baseUrl} style={link}>
              GoBoard
            </Link>
            .{' '}
            <Link href={`${baseUrl}/preferences`} style={link}>
              Update your preferences
            </Link>
            {' '}or{' '}
            <Link href={`${baseUrl}/unsubscribe`} style={link}>
              unsubscribe
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0f172a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const h1 = {
  color: '#f8fafc',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const jobSection = {
  backgroundColor: '#1e293b',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
}

const h2 = {
  color: '#f8fafc',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 12px',
}

const company = {
  color: '#94a3b8',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 12px',
}

const details = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 4px',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
}

const hr = {
  borderColor: '#334155',
  margin: '24px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
}

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}