import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CourseFAQ = ({ faqs }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev?.[index]
    }));
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Часто задаваемые вопросы</h2>
          <p className="text-muted-foreground">
            Ответы на популярные вопросы о курсе
          </p>
        </div>

        <div className="space-y-4">
          {faqs?.map((faq, index) => (
            <div key={index} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left hover:bg-white/5 transition-smooth"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg pr-4">{faq?.question}</h3>
                  <Icon
                    name="ChevronDown"
                    size={20}
                    className={`text-muted-foreground transition-transform flex-shrink-0 ${
                      expandedItems?.[index] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              {expandedItems?.[index] && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <div className="pt-4 prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq?.answer}
                    </p>
                    {faq?.additionalInfo && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {faq?.additionalInfo}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <div className="glass rounded-xl p-6">
            <h3 className="font-semibold mb-2">Не нашли ответ на свой вопрос?</h3>
            <p className="text-muted-foreground mb-4">
              Наша служба поддержки готова помочь вам 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth">
                <Icon name="MessageCircle" size={16} />
                Написать в чат
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth">
                <Icon name="Mail" size={16} />
                Отправить email
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseFAQ;