import React from 'react';
import { RegistrationRequest } from '../../types';
import { User, Phone, Car as IdCard, Calendar, MapPin, Home, Briefcase, Heart, Baby, ClipboardList, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RegistrationRequestDetailsProps {
  request: RegistrationRequest;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number, reason: string) => void;
}

export const RegistrationRequestDetails: React.FC<RegistrationRequestDetailsProps> = ({ 
  request, 
  onClose,
  onApprove,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = React.useState('');
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('يرجى إدخال سبب الرفض');
      return;
    }
    
    if (onReject) {
      onReject(request.id, rejectionReason);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'تمت الموافقة';
      case 'rejected': return 'مرفوض';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="space-y-8 max-h-[80vh] overflow-y-auto">
      {/* حالة الطلب */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            حالة الطلب
          </h3>
          <div className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="font-medium">{getStatusText(request.status)}</span>
          </div>
        </div>

        {request.status === 'pending' && onApprove && onReject && (
          <div className="mt-6 flex flex-col space-y-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => onApprove(request.id)}
                className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                <span>الموافقة على الطلب</span>
              </button>
              <button
                onClick={() => document.getElementById('rejectionReasonInput')?.focus()}
                className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5" />
                <span>رفض الطلب</span>
              </button>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <label className="block text-sm font-medium text-red-700 mb-2">
                سبب الرفض
              </label>
              <textarea
                id="rejectionReasonInput"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="أدخل سبب رفض الطلب..."
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  تأكيد الرفض
                </button>
              </div>
            </div>
          </div>
        )}

        {request.status === 'rejected' && request.rejectionReason && (
          <div className="mt-4 bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">سبب الرفض:</h4>
            <p className="text-red-700">{request.rejectionReason}</p>
          </div>
        )}

        {request.status !== 'pending' && request.reviewedAt && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              تمت المراجعة بتاريخ: <span className="font-medium">{formatDate(request.reviewedAt)}</span>
              {request.reviewedBy && <span> بواسطة: <span className="font-medium">{request.reviewedBy}</span></span>}
            </p>
          </div>
        )}
      </div>

      {/* القسم الأول: البيانات الأساسية */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
          <User className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          البيانات الأساسية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700 mb-1">الاسم الكامل</p>
                <p className="text-xl font-bold text-blue-900">{request.name}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    request.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                  }`}>
                    {request.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-base font-medium text-gray-700">{request.maritalStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IdCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-700 mb-1">رقم الهوية</p>
                <p className="text-xl font-bold text-purple-900 font-mono" dir="ltr">{request.nationalId}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    request.residenceStatus === 'displaced' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {request.residenceStatus === 'displaced' ? 'نازح' : 'مقيم'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-base font-medium text-gray-700">{request.areaName || 'غير محدد'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الهاتف والمهنة في صف واحد */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-700 mb-1">رقم الهاتف</p>
                <p className="text-xl font-bold text-orange-900 font-mono" dir="ltr">{request.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-amber-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-700 mb-1">الوظيفة الحالية</p>
                <p className="text-xl font-bold text-amber-900">
                  {request.currentJob || 'غير محدد'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثاني: معلومات النزوح (إذا كان نازح) */}
      {request.residenceStatus === 'displaced' && (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-100">
          <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center">
            <Home className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            معلومات النزوح
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {request.originalGovernorate && (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">المحافظة الأصلية</p>
                    <p className="text-xl font-bold text-red-900">{request.originalGovernorate}</p>
                  </div>
                </div>
              </div>
            )}
            
            {request.originalCity && (
              <div className="bg-white p-5 rounded-lg shadow-sm border border-red-100">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Home className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">المدينة الأصلية</p>
                    <p className="text-xl font-bold text-red-900">{request.originalCity}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {request.displacementAddress && (
            <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border border-red-100">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-3 bg-red-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700 mb-2">عنوان النزوح الحالي</p>
                  <p className="text-lg font-semibold text-red-900">{request.displacementAddress}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* القسم الثالث: الزوجات */}
      {request.wives && request.wives.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-100">
          <h3 className="text-xl font-bold text-pink-900 mb-6 flex items-center">
            <Heart className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            الزوجات ({request.wives.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.wives.map((wife, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-pink-100">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-bold text-pink-900">{wife.name}</p>
                    <p className="text-sm text-pink-700 font-mono" dir="ltr">{wife.nationalId}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* القسم الرابع: الأبناء */}
      {request.children && request.children.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
            <Baby className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            الأبناء ({request.children.length})
          </h3>

          <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                      اسم الابن
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                      رقم الهوية
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                      تاريخ الميلاد
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-blue-700 uppercase tracking-wider">
                      الجنس
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.children.map((child, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Baby className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{child.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-semibold text-gray-900" dir="ltr">
                          {child.nationalId}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(child.birthDate)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          child.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {child.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ملاحظات */}
      {request.notes && (
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
            ملاحظات
          </h3>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-lg text-gray-900 leading-relaxed">{request.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* معلومات التسجيل */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calendar className="h-6 w-6 ml-2 rtl:mr-2 rtl:ml-0" />
          معلومات التسجيل
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">آخر تحديث</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatDate(request.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* زر الإغلاق */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};