import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield } from 'lucide-react';
import Button from '../../../components/ui/Button';

const TermsModal = ({ isOpen, onClose, type = 'terms', language = 'en' }) => {
  const translations = {
    en: {
      terms: {
        title: 'Terms of Service',
        lastUpdated: 'Last updated: August 26, 2025',
        content: {
          acceptance: {
            title: '1. Acceptance of Terms',
            text: 'By accessing and using EduPlatform, you accept and agree to be bound by the terms and provision of this agreement.'
          },
          services: {
            title: '2. Use of Services',
            text: 'EduPlatform provides online educational content and learning management services. You may use our services for lawful purposes only.'
          },
          account: {
            title: '3. User Accounts',
            text: 'You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.'
          },
          content: {
            title: '4. Content and Intellectual Property',
            text: 'All content on EduPlatform, including courses, materials, and assessments, is owned by EduPlatform or its licensors and is protected by intellectual property laws.'
          },
          conduct: {
            title: '5. User Conduct',
            text: 'You agree not to use the services for any unlawful purpose or in any way that could damage, disable, or impair the service.'
          },
          termination: {
            title: '6. Termination',
            text: 'We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service.'
          }
        }
      },
      privacy: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: August 26, 2025',
        content: {
          collection: {
            title: '1. Information We Collect',
            text: 'We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us for support.'
          },
          usage: {
            title: '2. How We Use Your Information',
            text: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.'
          },
          sharing: {
            title: '3. Information Sharing',
            text: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.'
          },
          security: {
            title: '4. Data Security',
            text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
          },
          cookies: {
            title: '5. Cookies and Tracking',
            text: 'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content.'
          },
          rights: {
            title: '6. Your Rights',
            text: 'You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.'
          }
        }
      },
      close: 'Close'
    },
    ru: {
      terms: {
        title: 'Условия Использования',
        lastUpdated: 'Последнее обновление: 26 августа 2025',
        content: {
          acceptance: {
            title: '1. Принятие Условий',
            text: 'Получив доступ к EduPlatform и используя её, вы принимаете и соглашаетесь соблюдать условия данного соглашения.'
          },
          services: {
            title: '2. Использование Услуг',
            text: 'EduPlatform предоставляет онлайн образовательный контент и услуги управления обучением. Вы можете использовать наши услуги только в законных целях.'
          },
          account: {
            title: '3. Учетные Записи Пользователей',
            text: 'Вы несете ответственность за сохранение конфиденциальности своей учетной записи и пароля. Вы соглашаетесь немедленно уведомить нас о любом несанкционированном использовании вашей учетной записи.'
          },
          content: {
            title: '4. Контент и Интеллектуальная Собственность',
            text: 'Весь контент на EduPlatform, включая курсы, материалы и оценки, принадлежит EduPlatform или её лицензиарам и защищен законами об интеллектуальной собственности.'
          },
          conduct: {
            title: '5. Поведение Пользователя',
            text: 'Вы соглашаетесь не использовать услуги для незаконных целей или любым способом, который может повредить, отключить или ухудшить работу сервиса.'
          },
          termination: {
            title: '6. Прекращение',
            text: 'Мы можем немедленно прекратить или приостановить вашу учетную запись без предварительного уведомления за поведение, которое, по нашему мнению, нарушает эти Условия обслуживания.'
          }
        }
      },
      privacy: {
        title: 'Политика Конфиденциальности',
        lastUpdated: 'Последнее обновление: 26 августа 2025',
        content: {
          collection: {
            title: '1. Информация, Которую Мы Собираем',
            text: 'Мы собираем информацию, которую вы предоставляете нам напрямую, например, когда вы создаете учетную запись, записываетесь на курсы или обращаетесь к нам за поддержкой.'
          },
          usage: {
            title: '2. Как Мы Используем Вашу Информацию',
            text: 'Мы используем собираемую информацию для предоставления, поддержания и улучшения наших услуг, обработки транзакций и общения с вами.'
          },
          sharing: {
            title: '3. Обмен Информацией',
            text: 'Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением случаев, описанных в данной политике.'
          },
          security: {
            title: '4. Безопасность Данных',
            text: 'Мы применяем соответствующие технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.'
          },
          cookies: {
            title: '5. Файлы Cookie и Отслеживание',
            text: 'Мы используем файлы cookie и аналогичные технологии для улучшения вашего опыта, анализа шаблонов использования и персонализации контента.'
          },
          rights: {
            title: '6. Ваши Права',
            text: 'Вы имеете право доступа, обновления или удаления вашей личной информации. Вы также можете отказаться от определенных сообщений от нас.'
          }
        }
      },
      close: 'Закрыть'
    }
  };

  const t = translations?.[language]?.[type] || translations?.en?.[type];

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[80vh] glass-lg rounded-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {type === 'terms' ? (
                <FileText className="h-6 w-6 text-primary" />
              ) : (
                <Shield className="h-6 w-6 text-primary" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t?.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t?.lastUpdated}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              iconName="X"
              className="h-8 w-8"
            />
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-6">
              {Object?.entries(t?.content || {})?.map(([key, section]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <h3 className="font-semibold text-foreground">
                    {section?.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section?.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <Button
              onClick={onClose}
              fullWidth
              className="font-medium"
            >
              {translations?.[language]?.close}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TermsModal;