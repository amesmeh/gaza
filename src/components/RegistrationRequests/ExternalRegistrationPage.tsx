import React from 'react';
import { ExternalRegistrationForm } from './ExternalRegistrationForm';

export const ExternalRegistrationPage: React.FC = () => {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // هنا يمكن إرسال البيانات إلى الخادم
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">برنامج المساعدات - قطاع غزة</h1>
              <p className="mt-2 text-teal-100">نموذج طلب التسجيل في برنامج المساعدات</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 bg-teal-50 border-b border-teal-100">
              <h2 className="text-xl font-bold text-teal-800">معلومات هامة</h2>
              <ul className="mt-4 space-y-2 text-teal-700">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mt-0.5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>يرجى تعبئة جميع الحقول المطلوبة بدقة للتمكن من دراسة طلبك.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mt-0.5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن.</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mt-0.5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>في حال وجود أي استفسار، يرجى التواصل مع مندوب المنطقة.</span>
                </li>
              </ul>
            </div>
          </div>

          <ExternalRegistrationForm onSubmit={handleSubmit} />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-300">© 2024 برنامج المساعدات - قطاع غزة. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">سياسة الخصوصية</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">شروط الاستخدام</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};