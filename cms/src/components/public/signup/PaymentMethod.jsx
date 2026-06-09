import React, { useState } from 'react';

const PaymentMethod = () => {
  const [selectedGateway, setSelectedGateway] = useState('razorpay');

  const paymentGateways = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay securely with Cards, UPI, Netbanking',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.809 6.52668C21.809 4.46125 20.0733 2.80645 17.9351 2.80645H4.87391C4.31852 2.80645 3.78722 2.93112 3.31297 3.15791C1.60015 4.0043 0.792969 5.83392 0.792969 7.40279V16.5972C0.792969 18.6626 2.52879 20.3174 4.66687 20.3174H17.728C18.2834 20.3174 18.8147 20.1927 19.289 19.9659C20.7969 19.2234 21.809 17.7268 21.809 16.5972V6.52668Z" fill="#2C51DB"/>
          <path d="M17.728 20.3175H4.66687C2.52879 20.3175 0.792969 18.6627 0.792969 16.5973V7.40283C0.792969 5.83396 1.60015 4.00434 3.31297 3.15795C3.78722 2.93116 4.31852 2.80649 4.87391 2.80649H17.9351C20.0732 2.80649 21.809 4.46129 21.809 6.52672V16.5973C21.809 17.7268 20.7969 19.2235 19.289 19.9659C18.8147 20.1927 18.2834 20.3175 17.728 20.3175Z" stroke="white" strokeWidth="0.5"/>
          <path d="M14.8611 8.39435L6.38874 16.8668" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.8611 14.8835V8.39435H8.37201" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      isEnabled: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Coming soon - International payments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z" stroke="#64748B" strokeWidth="1.5"/>
          <path d="M13.7071 10.5429C13.7071 9.74361 14.3578 9.09286 15.1571 9.09286H16.6071C17.4064 9.09286 18.0571 9.74361 18.0571 10.5429V11.9929C18.0571 12.7921 17.4064 13.4429 16.6071 13.4429H15.1571C14.3578 13.4429 13.7071 12.7921 13.7071 11.9929V10.5429Z" stroke="#64748B" strokeWidth="1.5"/>
          <path d="M5.94287 10.5429C5.94287 9.74361 6.59362 9.09286 7.39287 9.09286H8.84287C9.64213 9.09286 10.2929 9.74361 10.2929 10.5429V11.9929C10.2929 12.7921 9.64213 13.4429 8.84287 13.4429H7.39287C6.59362 13.4429 5.94287 12.7921 5.94287 11.9929V10.5429Z" stroke="#64748B" strokeWidth="1.5"/>
          <path d="M9.81427 11.2679H14.1857" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      isEnabled: false
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Coming soon - PayPal payments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.9982 9.0398H15.7266C15.6301 9.0398 15.5463 9.11426 15.5321 9.20941L14.7867 14.2931C14.7672 14.4283 14.8711 14.5506 15.0081 14.5506H16.1057C16.2022 14.5506 16.286 14.4761 16.3002 14.381L16.5041 13.0647C16.5183 12.9696 16.6021 12.8951 16.6986 12.8951H17.5632C19.4589 12.8951 20.5772 11.9397 20.8678 10.1229C20.9929 9.35805 20.8322 8.74611 20.4451 8.32672C20.0097 7.85614 19.1967 7.66583 17.9982 7.66583V9.0398Z" stroke="#64748B" strokeWidth="1.5" strokeMiterlimit="10"/>
          <path d="M3.13184 9.0398H5.40341C5.49993 9.0398 5.58372 9.11426 5.59791 9.20941L6.34332 14.2931C6.36281 14.4283 6.25899 14.5506 6.12194 14.5506H4.81473C4.71821 14.5506 4.63442 14.4761 4.62023 14.381L4.41634 13.0647C4.40215 12.9696 4.31835 12.8951 4.22184 12.8951H3.35723C1.46156 12.8951 0.343262 11.9397 0.0526674 10.1229C-0.0724054 9.35805 0.088311 8.74611 0.475397 8.32672C0.910809 7.85614 1.72382 7.66583 2.92229 7.66583L3.13184 9.0398Z" stroke="#64748B" strokeWidth="1.5" strokeMiterlimit="10"/>
          <path d="M10.5657 9.0398H12.8373C12.9338 9.0398 13.0176 9.11426 13.0318 9.20941L13.7772 14.2931C13.7967 14.4283 13.6929 14.5506 13.5558 14.5506H12.2486C12.1521 14.5506 12.0683 14.4761 12.0541 14.381L11.8502 13.0647C11.836 12.9696 11.7522 12.8951 11.6557 12.8951H10.7911C8.89544 12.8951 7.77714 11.9397 7.48655 10.1229C7.36148 9.35805 7.52219 8.74611 7.90928 8.32672C8.34469 7.85614 9.1577 7.66583 10.3562 7.66583L10.5657 9.0398Z" stroke="#64748B" strokeWidth="1.5" strokeMiterlimit="10"/>
        </svg>
      ),
      isEnabled: false
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto m-6">
      <div className="space-y-4">
        {paymentGateways.map((gateway) => (
          <div
            key={gateway.id}
            onClick={() => gateway.isEnabled && setSelectedGateway(gateway.id)}
            className={`relative p-4 rounded-lg border transition-colors cursor-pointer
              ${!gateway.isEnabled && 'opacity-50 cursor-not-allowed'}
              ${selectedGateway === gateway.id && gateway.isEnabled 
                ? 'border-primary-base bg-primary-soft' 
                : 'border-stroke-soft'}`}
          >
            <div className="flex items-center gap-4">
              {/* Gateway Icon */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-md
                ${gateway.isEnabled ? 'bg-primary-soft' : 'bg-background-soft'}`}>
                {gateway.icon}
              </div>

              {/* Gateway Info */}
              <div className="flex-grow">
                <h3 className="font-medium">{gateway.name}</h3>
                <p className="text-sm text-text-soft">{gateway.description}</p>
              </div>

              {/* Selection Radio */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedGateway === gateway.id && gateway.isEnabled 
                  ? 'border-primary-base' 
                  : 'border-stroke-base'}`}
              >
                {selectedGateway === gateway.id && gateway.isEnabled && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-base"></div>
                )}
              </div>
            </div>

            {/* Coming Soon Badge */}
            {!gateway.isEnabled && (
              <span className="absolute top-2 right-2 text-xs bg-background-base text-text-soft px-2 py-1 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;