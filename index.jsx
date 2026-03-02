import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Download } from 'lucide-react';

const DevelopmentHeatQuiz = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [responses, setResponses] = useState({});

  const questions = [
    "Успех или неудача — оба возможны, очевидны и имеют значение.",
    "Требует взятия инициативы и руководства.",
    "Предполагает работу с новыми или самыми разными людьми.",
    "Создаёт высокое личное давление (дедлайны, ставки, масштаб, командировки, долгие рабочие часы).",
    "Требует влияния без формальных полномочий (коллеги, партнёры, клиенты, политика).",
    "Предполагает разнообразие или нечто принципиально иное по сравнению с прошлым опытом.",
    "Работа находится под пристальным вниманием тех, чьё мнение важно.",
    "Включает создание чего-то с нуля или выправление ситуации, находящейся в кризисе.",
    "Требует масштабного интеллектуального/стратегического решения проблем без прецедентов или с минимальным их количеством.",
    "Предполагает работу со значимым руководителем (например, поддерживающим/не поддерживающим, позитивным/негативным примером, конфликты и т.д.).",
    "Чего-то важного не хватает (ресурсов, поддержки, навыков, авторитета)."
  ];

  const scaleLabels = [
    "Минимальная сложность по сравнению с другими задачами/работами",
    "Некоторая сложность по сравнению с другими задачами/работами",
    "Сложность примерно как в большинстве других задач/работ",
    "Бо́льшая сложность, чем в других задачах/работах",
    "Значительно бо́льшая сложность, чем в других задачах/работах"
  ];

  const handleResponse = (questionIndex, value) => {
    setResponses({ ...responses, [questionIndex]: value });
  };

  const calculateScore = () => {
    return Object.values(responses).reduce((sum, val) => sum + val, 0);
  };

  const getScoreInterpretation = (score) => {
    if (score >= 45) return { text: "Очень развивающая", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 35) return { text: "Развивающая", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 21) return { text: "Начинает застаиваться?", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "На пенсии, но всё ещё приходит на работу?", color: "text-red-600", bg: "bg-red-50" };
  };

  const canProceed = () => {
    if (currentScreen === 0) return true;
    if (currentScreen <= questions.length) {
      return responses[currentScreen - 1] !== undefined;
    }
    return true;
  };

  const handleDownloadPDF = () => {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    const scoredQuestions = questions.map((question, index) => ({
      question,
      score: responses[index] || 0
    }));

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Результаты опросника «Температура развития»</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
          h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; }
          .score-box { background: #f3f4f6; border-left: 5px solid #1e40af; padding: 20px; margin: 20px 0; }
          .total-score { font-size: 48px; font-weight: bold; text-align: center; margin: 10px 0; }
          .interpretation { font-size: 24px; font-weight: bold; text-align: center; color: #1e40af; }
          .question-item { padding: 15px; margin: 10px 0; border: 1px solid #e5e7eb; border-radius: 5px; display: flex; justify-content: space-between; align-items: center; }
          .low-score { background: #fef3c7; border: 2px solid #f59e0b; }
          .score-number { font-size: 24px; font-weight: bold; min-width: 50px; text-align: center; }
          .reflection-box { background: #dbeafe; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .interpretation-guide { background: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
          .footer a { color: #2563eb; text-decoration: underline; font-weight: bold; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>Результаты опросника «Температура развития»</h1>
        <div class="score-box">
          <div class="total-score">${score}</div>
          <div class="interpretation">${interpretation.text}</div>
        </div>
        <div class="interpretation-guide">
          <h2>Интерпретация баллов:</h2>
          <ul>
            <li><strong>45–55</strong> = Очень развивающая</li>
            <li><strong>35–44</strong> = Развивающая</li>
            <li><strong>21–34</strong> = Начинает застаиваться?</li>
            <li><strong>&lt;20</strong> = На пенсии, но всё ещё приходит на работу?</li>
          </ul>
        </div>
        <h2>Ваши подробные баллы:</h2>
        ${scoredQuestions.map((item, index) => `
          <div class="question-item ${item.score <= 2 ? 'low-score' : ''}">
            <div style="flex: 1;">${index + 1}. ${item.question}</div>
            <div class="score-number">${item.score}</div>
          </div>
        `).join('')}
        ${scoredQuestions.some(item => item.score <= 2) ? `
          <div class="interpretation-guide" style="background: #fef3c7; border-left: 4px solid #f59e0b;">
            <h3>Области с низким уровнем сложности:</h3>
            <p>Выделенные выше пункты получили оценку 2 или ниже, что указывает на области, в которых роль можно усилить для повышения температуры развития. Учитывайте их при размышлении о возможных изменениях.</p>
          </div>
        ` : ''}
        <div class="reflection-box">
          <h2>Вопросы для рефлексии:</h2>
          <ul>
            <li>Что означает этот балл?</li>
            <li>Какие аспекты роли можно изменить, чтобы повысить температуру развития?</li>
          </ul>
        </div>
        <div class="footer">
          <p style="font-style: italic;">Создано Сергеем Горбатовым и Анджелой Лейн на основе <em>«Eighty-Eight Assignments for Development in Place: Enhancing the Developmental Challenge of existing jobs»</em> Майкла М. Ломбардо и Роберта У. Айхингера.</p>
          <p style="margin-top: 15px;">Больше информации на <a href="https://www.theedgeyouneed.com" target="_blank">theedgeyouneed.com</a></p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 250);
    }
  };

  const IntroScreen = () => (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Опросник «Температура развития»</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>Добро пожаловать в опросник «Температура развития»!</p>
        <p>
          Подумайте о роли, которую вы хорошо знаете. Это может быть ваша нынешняя должность или та,
          которую вы хотели бы занять в качестве следующего шага. Также вы можете подумать о роли для
          одного из членов вашей команды.
        </p>
        <p>
          На следующих экранах вы увидите 11 утверждений. Оцените каждое из них по степени сложности,
          с которой сталкивается / столкнётся человек на этой роли.
        </p>
        <p className="font-semibold">В конце вы увидите итоговый балл.</p>
      </div>
    </div>
  );

  const QuestionScreen = ({ questionIndex }) => (
    <div className="max-w-3xl mx-auto p-8">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Вопрос {questionIndex + 1} из {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800 mb-8">{questions[questionIndex]}</p>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleResponse(questionIndex, value)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              responses[questionIndex] === value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <span className={`font-bold mr-3 ${
                responses[questionIndex] === value ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {value}
              </span>
              <span className={responses[questionIndex] === value ? 'text-gray-800' : 'text-gray-600'}>
                {scaleLabels[value - 1]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ResultsScreen = () => {
    const score = calculateScore();
    const interpretation = getScoreInterpretation(score);
    const scoredQuestions = questions.map((question, index) => ({
      question,
      score: responses[index] || 0,
      index
    }));
    const lowestScores = scoredQuestions.filter(item => item.score <= 2);

    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Ваши результаты</h2>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Скачать PDF
          </button>
        </div>

        <div className={`${interpretation.bg} rounded-lg p-8 mb-8 text-center`}>
          <div className="text-6xl font-bold text-gray-800 mb-4">{score}</div>
          <div className={`text-2xl font-semibold ${interpretation.color}`}>
            {interpretation.text}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Интерпретация баллов:</h3>
          <ul className="space-y-2 text-gray-700">
            <li><span className="font-medium">45–55</span> = Очень развивающая</li>
            <li><span className="font-medium">35–44</span> = Развивающая</li>
            <li><span className="font-medium">21–34</span> = Начинает застаиваться?</li>
            <li><span className="font-medium">&lt;20</span> = На пенсии, но всё ещё приходит на работу?</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-4">Ваши подробные баллы:</h3>
          <div className="space-y-3">
            {scoredQuestions.map((item) => {
              const isLow = item.score <= 2;
              return (
                <div
                  key={item.index}
                  className={`p-4 rounded-lg border-2 ${
                    isLow ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-gray-700 flex-1">{item.question}</p>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className={`text-2xl font-bold ${isLow ? 'text-amber-600' : 'text-gray-800'}`}>
                        {item.score}
                      </span>
                      {isLow && (
                        <span className="text-xs text-amber-600 font-medium mt-1">
                          Низкая сложность
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {lowestScores.length > 0 && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-3">Области с низким уровнем сложности:</h3>
            <p className="text-gray-700">
              Выделенные выше пункты получили оценку 2 или ниже, что указывает на области, в которых
              роль можно усилить для повышения температуры развития. Учитывайте их при размышлении о
              возможных изменениях.
            </p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Вопросы для рефлексии:</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Что означает этот балл?</span>
            </li>
            <li className="flex">
              <span className="mr-2">•</span>
              <span>Какие аспекты роли можно изменить, чтобы повысить температуру развития?</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 italic">
          Создано Сергеем Горбатовым и Анджелой Лейн на основе{' '}
          <em>«Eighty-Eight Assignments for Development in Place: Enhancing the Developmental Challenge of existing jobs»</em>{' '}
          Майкла М. Ломбардо и Роберта У. Айхингера.
        </p>
        <p className="text-sm text-gray-700 mt-3">
          Больше информации на{' '}
          <a
            href="https://www.theedgeyouneed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-semibold"
          >
            theedgeyouneed.com
          </a>
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="bg-white rounded-xl shadow-lg min-h-[600px] mx-4 md:mx-auto md:max-w-4xl">
        {currentScreen === 0 && <IntroScreen />}
        {currentScreen > 0 && currentScreen <= questions.length && (
          <QuestionScreen questionIndex={currentScreen - 1} />
        )}
        {currentScreen === questions.length + 1 && <ResultsScreen />}

        <div className="border-t border-gray-200 p-6 flex justify-between">
          {currentScreen > 0 && (
            <button
              onClick={() => setCurrentScreen(currentScreen - 1)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Назад
            </button>
          )}
          {currentScreen < questions.length + 1 && (
            <button
              onClick={() => setCurrentScreen(currentScreen + 1)}
              disabled={!canProceed()}
              className={`ml-auto flex items-center px-6 py-2 rounded-lg transition-colors ${
                canProceed()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentScreen === questions.length ? 'Посмотреть результаты' : 'Далее'}
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopmentHeatQuiz;
