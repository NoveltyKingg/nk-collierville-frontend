import React from 'react'
import { Typography, Card } from 'antd'

const { Title, Paragraph } = Typography

function Privacy() {
  return (
    <div className='flex justify-center bg-[#f5f5f5] py-10 px-4'>
      {/* <Card className='max-w-4xl w-full shadow-sm border border-gray-200 rounded-2xl'> */}
      <Typography>
        <Title level={2} className='text-center mb-8'>
          Novety King Collierville – Privacy Policy
        </Title>

        <Title level={4}>1. Data Collection</Title>
        <Paragraph>
          Novety King Collierville collects certain information automatically,
          such as IP addresses, device type, and browsing behavior. Personal
          information may also be collected when users register, participate in
          surveys or contests, or interact with the app.
        </Paragraph>

        <Title level={4}>2. Types of Information Collected</Title>
        <Paragraph>
          <strong>Personal Information:</strong> Name, email address, phone
          number, postal code, and payment information (if applicable).
          <br />
          <strong>Verification Information:</strong> Tax ID, sales tax
          information, and other government-issued IDs to verify customers and
          their stores.
          <br />
          <strong>Usage Information:</strong> Pages visited, links clicked, and
          app activity.
        </Paragraph>

        <Title level={4}>3. Use of Information</Title>
        <Paragraph>Information collected is used to:</Paragraph>
        <ul className='list-disc pl-6'>
          <li>Provide requested services and verify business customers</li>
          <li>Improve app functionality and personalize content</li>
          <li>
            Communicate with users regarding updates, promotions, and surveys
          </li>
        </ul>

        <Title level={4}>4. Information Sharing</Title>
        <Paragraph>
          Verification Information (Tax ID, government IDs) is never shared with
          third parties and is strictly used for customer verification.
          <br />
          Personal financial information is used only to complete transactions.
          <br />
          Personally identifiable information is not sold, rented, or shared
          without consent, except as required by law or to provide requested
          services.
        </Paragraph>

        <Title level={4}>5. User Choices</Title>
        <Paragraph>
          Users may update their information, change account settings, or
          opt-in/opt-out of marketing communications at any time.
          <br />
          Upon request, personal information can be removed, though archived
          data may remain for record-keeping.
        </Paragraph>

        <Title level={4}>6. Security Measures</Title>
        <Paragraph>
          Novety King Collierville implements physical, electronic, and
          managerial procedures to protect user information. However,
          transmission over the internet is not completely secure, and the app
          is not liable for unauthorized disclosure due to transmission errors
          or third-party actions.
        </Paragraph>

        <Title level={4}>7. Policy Updates</Title>
        <Paragraph>
          This Privacy Policy may be updated at any time. Changes take effect
          immediately upon posting to the app or website.
        </Paragraph>

        <Title level={4}>8. Age Restrictions</Title>
        <Paragraph>
          The app may include products or content not suitable for individuals
          under 21 years of age, in compliance with applicable laws.
        </Paragraph>

        <Title level={4}>9. Access to Information</Title>
        <Paragraph>
          Users can access and update their personal information through their
          account settings in the app.
        </Paragraph>

        <Paragraph className='text-gray-600 italic mt-10 text-center'>
          Last updated: {new Date().toLocaleDateString()}
        </Paragraph>
      </Typography>
      {/* </Card> */}
    </div>
  )
}

export default Privacy
