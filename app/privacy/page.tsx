import React from 'react'

export const dynamic = 'force-dynamic'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect the following types of information when you use our Business Model Canvas service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Account Information:</strong> Email address, name, and authentication data</li>
                <li><strong>Canvas Data:</strong> Your business model canvas content and version history</li>
                <li><strong>Usage Data:</strong> How you interact with our service (anonymized)</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide and maintain our Business Model Canvas service</li>
                <li>Save and sync your canvas data across devices</li>
                <li>Enable version history and collaboration features</li>
                <li>Improve our service through analytics (anonymized)</li>
                <li>Ensure security and prevent abuse</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Storage and Security</h2>
              <p className="text-gray-700 mb-4">
                Your data is stored securely using:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                <li><strong>Access Control:</strong> Only authorized personnel can access your data</li>
                <li><strong>Backup Systems:</strong> Regular automated backups with point-in-time recovery</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and alerting</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Your Rights (GDPR/CCPA)</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Access:</strong> Request a copy of all your personal data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Correction:</strong> Update or correct your personal information</li>
                <li><strong>Deletion:</strong> Request complete deletion of your data</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your data for as long as your account is active. When you delete your account:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All personal data is permanently deleted within 30 days</li>
                <li>Backup copies are deleted within 90 days</li>
                <li>Anonymized analytics data may be retained for service improvement</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Neon Database:</strong> Secure cloud database hosting</li>
                <li><strong>Vercel:</strong> Application hosting and CDN</li>
                <li><strong>Stack Auth:</strong> User authentication and management</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For privacy-related questions or to exercise your rights, contact us:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Email:</strong> privacy@evergreenwebsolutions.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@evergreenwebsolutions.com</li>
                <li><strong>Response Time:</strong> We respond to all requests within 30 days</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Posting the new policy on this page</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice in the application</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
