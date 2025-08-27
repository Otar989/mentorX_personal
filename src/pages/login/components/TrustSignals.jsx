import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrustSignals = ({ language = 'en', className = '' }) => {
  const translations = {
    en: {
      secureLogin: 'Secure Login',
      dataProtection: 'GDPR Compliant',
      fiscalCompliance: '54-FZ Compliant',
      sslEncryption: 'SSL Encrypted',
      trustedBy: 'Trusted by 10,000+ learners',
      certifiedPlatform: 'Certified Learning Platform'
    },
    ru: {
      secureLogin: 'Безопасный вход',
      dataProtection: 'Соответствие GDPR',
      fiscalCompliance: 'Соответствие 54-ФЗ',
      sslEncryption: 'SSL шифрование',
      trustedBy: 'Доверяют 10,000+ учащихся',
      certifiedPlatform: 'Сертифицированная платформа'
    }
  };

  const t = translations?.[language] || translations?.en;

  const trustItems = [
    {
      icon: 'Shield',
      title: t?.secureLogin,
      description: t?.sslEncryption
    },
    {
      icon: 'FileCheck',
      title: t?.dataProtection,
      description: t?.fiscalCompliance
    },
    {
      icon: 'Users',
      title: t?.trustedBy,
      description: t?.certifiedPlatform
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trustItems?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="glass rounded-xl p-4 text-center hover:glass-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name={item?.icon} size={24} className="text-primary" />
            </div>
            <h3 className="font-medium text-sm text-foreground mb-1">{item?.title}</h3>
            <p className="text-xs text-muted-foreground">{item?.description}</p>
          </motion.div>
        ))}
      </div>
      {/* Compliance Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-6 mt-8"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>ISO 27001</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>GDPR</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>54-ФЗ</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrustSignals;