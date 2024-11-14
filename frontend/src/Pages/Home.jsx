import { Link } from 'react-router-dom';
import { ArrowRight, Send, PieChart, Shield } from 'lucide-react';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-lg font-medium text-blue-900 truncate">{title}</dt>
              <dd className="mt-2 text-base text-blue-600">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-blue-900 sm:text-5xl md:text-6xl">
                Fast and Secure Money Transfers
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-blue-700 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Send money to anyone, anywhere in the world with Truewallet. Easy, quick, and reliable.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link to="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<Send className="h-8 w-8 text-blue-600" />}
                  title="Quick Transfers"
                  description="Send money in minutes to friends and family worldwide."
                />
                <FeatureCard
                  icon={<PieChart className="h-8 w-8 text-blue-600" />}
                  title="Low Fees"
                  description="Enjoy competitive rates and low transfer fees."
                />
                <FeatureCard
                  icon={<Shield className="h-8 w-8 text-blue-600" />}
                  title="Secure Transactions"
                  description="Your money and data are protected with bank-level security."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-blue-200">
            &copy; 2024 Truewallet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}