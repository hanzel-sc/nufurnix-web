import { Link, useParams } from 'react-router-dom';
import { Button } from '../../shared/components/Button';

export default function SubmissionConfirmationPage() {
  const { submissionId } = useParams<{ submissionId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Submission Received!
        </h1>

        <p className="text-gray-600 mb-6">
          Your request has been successfully submitted. Our team will review it
          and get back to you shortly.
        </p>

        <div className="bg-gray-50 rounded p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Reference Number</p>
          <p className="font-mono text-sm font-semibold text-gray-900">
            {submissionId}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          You will receive a confirmation email with the details of your
          submission.
        </p>

        <Link to="/">
          <Button className="w-full">Return to Catalog</Button>
        </Link>
      </div>
    </div>
  );
}