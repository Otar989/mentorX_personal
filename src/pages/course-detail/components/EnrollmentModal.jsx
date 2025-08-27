import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EnrollmentModal = ({ 
  isOpen, 
  onClose, 
  course,
  onEnrollmentComplete 
}) => {
  const [step, setStep] = useState(1); // 1: Payment, 2: Processing, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const finalPrice = course?.price - (course?.price * discount / 100);

  const handlePromoCode = () => {
    // Mock promo code validation
    const validPromoCodes = {
      'WELCOME10': 10,
      'STUDENT20': 20,
      'NEWUSER15': 15
    };

    if (validPromoCodes?.[promoCode?.toUpperCase()]) {
      setDiscount(validPromoCodes?.[promoCode?.toUpperCase()]);
      setPromoApplied(true);
    } else {
      alert('Промокод не найден или недействителен');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setStep(2);

    // Mock payment processing
    setTimeout(() => {
      setStep(3);
      setIsProcessing(false);
    }, 3000);
  };

  const handleComplete = () => {
    onEnrollmentComplete();
    onClose();
    // Redirect to course
    window.location.href = '/lesson-interface';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-lg rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">
              {step === 1 ? 'Оплата курса' : step === 2 ? 'Обработка платежа' : 'Добро пожаловать!'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {course?.title}
            </p>
          </div>
          {step !== 2 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          )}
        </div>

        <div className="p-6">
          {/* Step 1: Payment Form */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Course Summary */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={course?.previewImage}
                    alt={course?.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{course?.title}</h3>
                    <p className="text-sm text-muted-foreground">{course?.instructor?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{course?.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {course?.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(course?.originalPrice)}
                      </div>
                    )}
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(finalPrice)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Промокод (необязательно)</label>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e?.target?.value)}
                    disabled={promoApplied}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handlePromoCode}
                    disabled={!promoCode || promoApplied}
                  >
                    {promoApplied ? 'Применен' : 'Применить'}
                  </Button>
                </div>
                {promoApplied && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span>Скидка {discount}% применена</span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Способ оплаты</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'card', label: 'Банковская карта', icon: 'CreditCard' },
                    { id: 'yoomoney', label: 'ЮMoney', icon: 'Wallet' },
                    { id: 'sbp', label: 'СБП', icon: 'Smartphone' }
                  ]?.map((method) => (
                    <button
                      key={method?.id}
                      onClick={() => setPaymentMethod(method?.id)}
                      className={`p-4 rounded-xl border-2 transition-smooth ${
                        paymentMethod === method?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Icon name={method?.icon} size={24} className="mx-auto mb-2" />
                      <div className="text-sm font-medium">{method?.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  required
                />
                <Input
                  label="Телефон"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  required
                />
              </div>

              {/* Card Details (if card payment selected) */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Input
                    label="Номер карты"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData?.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e?.target?.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Срок действия"
                      type="text"
                      placeholder="MM/YY"
                      value={formData?.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e?.target?.value)}
                      required
                    />
                    <Input
                      label="CVV"
                      type="text"
                      placeholder="123"
                      value={formData?.cvv}
                      onChange={(e) => handleInputChange('cvv', e?.target?.value)}
                      required
                    />
                  </div>
                  <Input
                    label="Имя владельца карты"
                    type="text"
                    placeholder="IVAN PETROV"
                    value={formData?.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e?.target?.value)}
                    required
                  />
                </div>
              )}

              {/* Total */}
              <div className="glass rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Стоимость курса:</span>
                  <span>{formatPrice(course?.price)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center mb-2 text-success">
                    <span>Скидка ({discount}%):</span>
                    <span>-{formatPrice(course?.price * discount / 100)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>К оплате:</span>
                    <span className="text-primary">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button
                variant="default"
                size="lg"
                fullWidth
                onClick={handlePayment}
                iconName="CreditCard"
                iconPosition="left"
              >
                Оплатить {formatPrice(finalPrice)}
              </Button>

              {/* Security Notice */}
              <div className="text-xs text-muted-foreground text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon name="Shield" size={14} />
                  <span>Безопасная оплата через YooKassa</span>
                </div>
                <p>
                  Нажимая "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin">
                  <Icon name="Loader2" size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Обрабатываем платеж</h3>
              <p className="text-muted-foreground mb-6">
                Пожалуйста, подождите. Не закрывайте это окно.
              </p>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="progress-ambient h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">Оплата прошла успешно!</h3>
              <p className="text-muted-foreground mb-6">
                Добро пожаловать на курс "{course?.title}". Вы можете начать обучение прямо сейчас.
              </p>
              
              <div className="glass rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={20} className="text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Чек отправлен на email</p>
                    <p className="text-sm text-muted-foreground">{formData?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="default"
                  size="lg"
                  fullWidth
                  onClick={handleComplete}
                  iconName="Play"
                  iconPosition="left"
                >
                  Начать обучение
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/student-dashboard'}
                >
                  Перейти в личный кабинет
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;